/**
 * SridharListView.test.jsx
 * ------------------------
 * Deep tests for src/components/sridharListView.jsx.
 */

import { ConfigProvider } from 'antd';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SridharListView from '../components/sridharListView';
import { SRIDHAR_MOCK_JOBS, SRIDHAR_JOB_LIST_SUMMARY, sridharJobsValid } from '../data/jobs';
import {
  assertListViewContract,
  assertSridharColumnMenuContract,
} from './listViewTestContracts';

function renderSridharListView() {
  return render(
    <ConfigProvider>
      <MemoryRouter>
        <SridharListView jobs={SRIDHAR_MOCK_JOBS} summary={SRIDHAR_JOB_LIST_SUMMARY} />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

const getSearchInput = () => screen.getByPlaceholderText('Min 3 Chars to search');

describe.skipIf(!sridharJobsValid)('SridharListView component contract', () => {
  it('renders the exact visible labels, headers, toolbar, tabs, and first row contract', () => {
    const { container } = renderSridharListView();

    assertListViewContract('SridharListView', container);
  });

  it('renders the exact column menu labels', async () => {
    const { container } = renderSridharListView();

    await userEvent.click(container.querySelector('.job-actions-button'));

    assertSridharColumnMenuContract(document.body);
  });
});

describe.skipIf(!sridharJobsValid)('SridharListView toolbar and table', () => {
  it('renders toolbar controls and selected row count', () => {
    const { container } = renderSridharListView();

    expect(container.querySelector('.job-search-input')).toBeInTheDocument();
    expect(container.querySelector('.job-summary-button')).toBeInTheDocument();
    expect(container.querySelectorAll('.job-toolbar-icon-button')).toHaveLength(2);
    expect(container.querySelector('.job-selected-count')).toHaveTextContent('Selected (2)');
  });

  it('links job titles to the Sridhar detail route', () => {
    renderSridharListView();

    expect(screen.getByRole('link', { name: SRIDHAR_MOCK_JOBS[0].title })).toHaveAttribute(
      'href',
      `/sri-detailview/${SRIDHAR_MOCK_JOBS[0].id}`,
    );
  });

  it('updates selected count when a row checkbox is selected', async () => {
    const { container } = renderSridharListView();

    await userEvent.click(screen.getAllByRole('checkbox')[3]);

    expect(container.querySelector('.job-selected-count')).toHaveTextContent('Selected (3)');
  });

  it('filters only after at least 3 search characters', async () => {
    renderSridharListView();
    const matchingLocation = SRIDHAR_MOCK_JOBS[1].location;
    const hiddenLocation = SRIDHAR_MOCK_JOBS[0].location;

    await userEvent.type(getSearchInput(), 'te');
    expect(screen.getByText(hiddenLocation)).toBeInTheDocument();

    await userEvent.clear(getSearchInput());
    await userEvent.type(getSearchInput(), matchingLocation.toLowerCase());

    expect(screen.getByText(matchingLocation)).toBeInTheDocument();
    expect(screen.queryByText(hiddenLocation)).not.toBeInTheDocument();
    expect(screen.getByText(/Showing of 1 - 1 of 30/)).toBeInTheDocument();
  });

  it('can hide and restore the Location column from the column menu', async () => {
    const { container } = renderSridharListView();

    await userEvent.click(container.querySelector('.job-actions-button'));
    await userEvent.click(screen.getAllByLabelText('Location')[0]);

    expect(screen.queryByRole('columnheader', { name: /location/i })).not.toBeInTheDocument();

    await userEvent.click(screen.getAllByLabelText('Location')[0]);

    expect(screen.getByRole('columnheader', { name: /location/i })).toBeInTheDocument();
  });
});

describe('SridharListView JSON data props', () => {
  it('renders different job values when a different JSON-shaped list is passed', () => {
    const customJobs = [
      {
        ...SRIDHAR_MOCK_JOBS[0],
        key: 'custom-1',
        id: 9001,
        title: 'Azure Data Engineer',
        client: 'Infosys - 9001',
        location: 'Seattle',
        experience: '9 years',
        employmentType: 'Contract',
        clientRate: 120,
        targetSub: { filled: 2, total: 4 },
        pipeline: 5,
        status: 'Open',
        createdAt: 'Jun 01, 2026',
        createdAgo: '1 day ago',
      },
    ];

    render(
      <ConfigProvider>
        <MemoryRouter>
          <SridharListView
            jobs={customJobs}
            summary={{ myJobsCount: 1, allJobsCount: 1 }}
            initialSelectedRowKeys={['custom-1']}
          />
        </MemoryRouter>
      </ConfigProvider>,
    );

    expect(screen.getByRole('link', { name: 'Azure Data Engineer' })).toHaveAttribute(
      'href',
      '/sri-detailview/9001',
    );
    expect(screen.getByText('Infosys - 9001')).toBeInTheDocument();
    expect(screen.getByText('Seattle')).toBeInTheDocument();
    expect(screen.getByText('Selected (1)')).toBeInTheDocument();
    expect(document.querySelector('[title="1"]')).toBeInTheDocument();
  });

  it('still renders the table when fields are missing or empty', () => {
    const brokenJobs = [
      {
        ...SRIDHAR_MOCK_JOBS[0],
        key: 'broken-1',
        title: '',
        location: undefined,
        locationType: 'Remote',
        pipeline: 0,
      },
      {
        ...SRIDHAR_MOCK_JOBS[1],
        key: 'broken-2',
        locationType: null,
        pipeline: undefined,
      },
    ];

    const { container } = render(
      <ConfigProvider>
        <MemoryRouter>
          <SridharListView
            jobs={brokenJobs}
            summary={SRIDHAR_JOB_LIST_SUMMARY}
            initialSelectedRowKeys={[]}
          />
        </MemoryRouter>
      </ConfigProvider>,
    );

    expect(container.querySelector('.job-list-table')).toBeInTheDocument();
  });
});
