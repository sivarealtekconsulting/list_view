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
import { MOCK_JOBS } from '../data/jobs';
import {
  assertListViewContract,
  assertSridharColumnMenuContract,
} from './listViewTestContracts';

function renderSridharListView() {
  return render(
    <ConfigProvider>
      <MemoryRouter>
        <SridharListView />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

const getSearchInput = () => screen.getByPlaceholderText('Min 3 Chars to search');

describe('SridharListView component contract', () => {
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

describe('SridharListView toolbar and table', () => {
  it('renders toolbar controls and selected row count', () => {
    const { container } = renderSridharListView();

    expect(container.querySelector('.job-search-input')).toBeInTheDocument();
    expect(container.querySelector('.job-summary-button')).toBeInTheDocument();
    expect(container.querySelectorAll('.job-toolbar-icon-button')).toHaveLength(2);
    expect(container.querySelector('.job-selected-count')).toHaveTextContent('Selected (2)');
  });

  it('links job titles to the Sridhar detail route', () => {
    renderSridharListView();

    expect(screen.getByRole('link', { name: MOCK_JOBS[0].title })).toHaveAttribute(
      'href',
      `/sri-detailview/${MOCK_JOBS[0].id}`,
    );
  });

  it('updates selected count when a row checkbox is selected', async () => {
    const { container } = renderSridharListView();

    await userEvent.click(screen.getAllByRole('checkbox')[3]);

    expect(container.querySelector('.job-selected-count')).toHaveTextContent('Selected (3)');
  });

  it('filters only after at least 3 search characters', async () => {
    renderSridharListView();

    await userEvent.type(getSearchInput(), 'te');
    expect(screen.getByText(MOCK_JOBS[0].title)).toBeInTheDocument();

    await userEvent.clear(getSearchInput());
    await userEvent.type(getSearchInput(), 'texas');

    expect(screen.getByText('Texas')).toBeInTheDocument();
    expect(screen.queryByText('North Davidfurt')).not.toBeInTheDocument();
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
