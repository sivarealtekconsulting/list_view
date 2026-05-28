/**
 * ListView.test.jsx
 * -----------------
 * Deep tests for src/components/ListView.jsx.
 */

import { ConfigProvider } from 'antd';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ListView from '../components/ListView';
import { MOCK_JOBS } from '../data/jobs';
import { assertListViewContract } from './listViewTestContracts';

function renderListView() {
  return render(
    <ConfigProvider>
      <MemoryRouter>
        <ListView />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

const getSearchInput = () => screen.getByPlaceholderText('Min 3 Chars to search');

describe('ListView component contract', () => {
  it('renders the visible table, toolbar, tabs, and first row contract', () => {
    const { container } = renderListView();

    assertListViewContract('ListView', container);
  });
});

describe('ListView toolbar and table', () => {
  it('renders toolbar buttons and selected row count', () => {
    renderListView();

    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /plus/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view summary/i })).toBeInTheDocument();
    expect(screen.getByText('Selected (2)')).toBeInTheDocument();
  });

  it('links job titles to the generic job detail route', () => {
    renderListView();

    expect(screen.getByRole('link', { name: MOCK_JOBS[0].title })).toHaveAttribute(
      'href',
      `/jobs/${MOCK_JOBS[0].id}`,
    );
  });

  it('updates selected count when a row checkbox is selected', async () => {
    renderListView();

    await userEvent.click(screen.getAllByRole('checkbox')[3]);

    expect(screen.getByText('Selected (3)')).toBeInTheDocument();
  });

  it('filters only after at least 3 search characters', async () => {
    renderListView();
    const matchingLocation = MOCK_JOBS[1].location;
    const hiddenLocation = MOCK_JOBS[0].location;

    fireEvent.change(getSearchInput(), { target: { value: 'te' } });
    expect(screen.getByText(hiddenLocation)).toBeInTheDocument();

    fireEvent.change(getSearchInput(), { target: { value: matchingLocation.toLowerCase() } });

    expect(screen.getByText(matchingLocation)).toBeInTheDocument();
    expect(screen.queryByText(hiddenLocation)).not.toBeInTheDocument();
    expect(screen.getByText('Showing of 1 - 1 of 30')).toBeInTheDocument();
  });

  it('can hide and restore the Location column from the column menu', async () => {
    const { container } = renderListView();

    await userEvent.click(container.querySelector('.job-actions-button'));
    await userEvent.click(screen.getAllByLabelText('Location')[0]);

    expect(screen.queryByRole('columnheader', { name: /location/i })).not.toBeInTheDocument();

    await userEvent.click(screen.getAllByLabelText('Location')[0]);

    expect(screen.getByRole('columnheader', { name: /location/i })).toBeInTheDocument();
  });
});
