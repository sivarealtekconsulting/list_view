/**
 * DemoSamplePage.test.jsx
 *
 * Test suite for the Venkatesh demo dashboard page.
 *
 * Coverage:
 *  1. Dashboard layout and KPI cards
 *  2. Add / Edit Personality form validation and formatting
 *  3. Calendar navigation and legend
 *  4. Supporting cards: Sticky Notes, Onboarding, Client Submission
 *  5. Inline list view: headers, routes, search, tabs, selection, actions
 *  6. Inline filter drawer controls
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DemoSamplePage from './DemoSamplePage';

vi.mock('../hooks/useDropdownFields', () => ({
  useDropdownFields: () => ({
    fields: [
      { label: 'Jobs', value: 'title' },
      { label: 'Location', value: 'location' },
      { label: 'Status', value: 'status' },
    ],
    loading: false,
    error: null,
  }),
}));

vi.mock('../hooks/useDropdownValues', () => ({
  useDropdownValues: () => ({
    valuesByField: {
      title: [{ label: 'Java Developer (Python Experience)', value: 'Java Developer (Python Experience)' }],
      location: [{ label: 'Chennai', value: 'Chennai' }],
      status: [{ label: 'Open', value: 'Open' }],
    },
    loadingFields: new Set(),
    fetchValues: vi.fn(),
  }),
}));

const renderPage = () => render(
  <MemoryRouter>
    <DemoSamplePage />
  </MemoryRouter>,
);

function getPersonalityListCard() {
  return screen.getByText('Personality List').closest('.ant-card');
}

function getCalendarCard() {
  return screen.getByText('April 2026').closest('.ant-card');
}

describe('DemoSamplePage - Dashboard Render', () => {
  it('renders the main dashboard sections', () => {
    renderPage();

    expect(screen.getByText('Add / Edit Personality')).toBeInTheDocument();
    expect(screen.getByText('Personality List')).toBeInTheDocument();
    expect(screen.getByText('Sticky Notes')).toBeInTheDocument();
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Total Client Submission:')).toBeInTheDocument();
  });

  it('renders KPI labels and values', () => {
    renderPage();

    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
    expect(screen.getByText('1,697')).toBeInTheDocument();
    expect(screen.getByText('Active Jobs')).toBeInTheDocument();
    expect(screen.getByText('1,685')).toBeInTheDocument();
    expect(screen.getAllByText('My Jobs').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('600')).toBeInTheDocument();
  });

  it('renders supporting dashboard card labels', () => {
    renderPage();

    expect(screen.getAllByText('Tagged')).toHaveLength(2);
    expect(screen.getAllByText('Note')).toHaveLength(2);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Project Completed')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });
});

describe('DemoSamplePage - Form Validation', () => {
  it('shows required validation when Save is clicked without mandatory fields', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findAllByText('Mandatory Field')).toHaveLength(3);
  });

  it('formats entered personality name while typing', async () => {
    renderPage();

    const nameInput = screen.getByPlaceholderText('Enter personality name');
    await userEvent.type(nameInput, 'john doe');

    expect(nameInput).toHaveValue('John Doe');
  });

  it('validates alphabet-only name and optional DOB format', async () => {
    renderPage();

    await userEvent.type(screen.getByPlaceholderText('Enter personality name'), 'John123');
    await userEvent.type(screen.getByPlaceholderText('MM/DD/YYYY'), '13/40/2024');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Only alphabets and spaces are allowed.')).toBeInTheDocument();
    expect(await screen.findByText('DOB must be in MM/DD/YYYY format.')).toBeInTheDocument();
  });

  it('does not show name required validation after a valid name is entered', async () => {
    renderPage();

    await userEvent.type(screen.getByPlaceholderText('Enter personality name'), 'john doe');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findAllByText('Mandatory Field')).toHaveLength(2);
  });
});

describe('DemoSamplePage - Calendar', () => {
  it('renders the default calendar month', () => {
    renderPage();

    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('moves between months using calendar navigation', async () => {
    renderPage();

    const calendarCard = getCalendarCard();
    await userEvent.click(within(calendarCard).getByRole('button', { name: /left/i }));
    expect(screen.getByText('March 2026')).toBeInTheDocument();

    await userEvent.click(within(calendarCard).getByRole('button', { name: /right/i }));
    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('renders calendar legend items', () => {
    renderPage();

    expect(screen.getByText('Onboarded date')).toBeInTheDocument();
    expect(screen.getByText('Exit date')).toBeInTheDocument();
    expect(screen.getByText('To-do mentioned')).toBeInTheDocument();
    expect(screen.getByText('Interview scheduled')).toBeInTheDocument();
  });
});

describe('DemoSamplePage - Inline List View', () => {
  it('renders list tabs and table headers', () => {
    renderPage();

    expect(screen.getAllByText('My Jobs').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('All Jobs')).toBeInTheDocument();
    expect(screen.getAllByText('Jobs')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Location').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Created date').length).toBeGreaterThanOrEqual(1);
  });

  it('renders job detail links with correct route', () => {
    renderPage();

    expect(screen.getByRole('link', { name: /Full Stack Developer/i })).toHaveAttribute(
      'href',
      '/Venkatesh-detailview/1',
    );
  });

  it('renders pagination controls and result range', () => {
    renderPage();

    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.getByText('/ page')).toBeInTheDocument();
    expect(screen.getByText('Showing of 1 - 5 of 30')).toBeInTheDocument();
  });

  it('keeps list unfiltered until search reaches three characters', async () => {
    renderPage();

    await userEvent.type(screen.getByPlaceholderText('Min 3 Chars to search'), 'Fu');

    expect(screen.getByText('Full Stack Developer (3 Years Experience)')).toBeInTheDocument();
    expect(screen.getAllByText('Java Developer (Python Experience)').length).toBeGreaterThanOrEqual(1);
  });

  it('filters list results after minimum search characters', async () => {
    renderPage();

    await userEvent.type(screen.getByPlaceholderText('Min 3 Chars to search'), 'Full');

    expect(screen.getByText('Full Stack Developer (3 Years Experience)')).toBeInTheDocument();
    expect(screen.queryByText('Java Developer (Python Experience)')).not.toBeInTheDocument();
  });

  it('shows selected row count when a row checkbox is selected', async () => {
    renderPage();

    const checkboxes = within(getPersonalityListCard()).getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);

    expect(screen.getByText('Selected (1)')).toBeInTheDocument();
  });

  it('switches to All Jobs tab without losing table data', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('tab', { name: /All Jobs/i }));

    expect(screen.getByRole('tab', { name: /All Jobs/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Full Stack Developer (3 Years Experience)')).toBeInTheDocument();
  });

  it('opens the inline list actions menu', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Actions/i }));

    expect(await screen.findByText('Export selected')).toBeInTheDocument();
    expect(screen.getByText('Assign')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('opens the inline list column visibility menu', async () => {
    const { container } = renderPage();

    await userEvent.click(container.querySelector('.job-actions-button'));

    expect(await screen.findByText('Select All')).toBeInTheDocument();
    expect(screen.getByText('Created Date')).toBeInTheDocument();
    expect(screen.getAllByText('Location').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Pipeline').length).toBeGreaterThanOrEqual(1);
  });
});

describe('DemoSamplePage - Filters', () => {
  it('opens the filter drawer and shows filter controls', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /filter/i }));

    expect(await screen.findByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Field')).toBeInTheDocument();
    expect(screen.getByText('Values')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Row/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apply/i })).toBeInTheDocument();
  });

  it('adds another filter row inside the drawer', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /filter/i }));
    expect(await screen.findByText('Filters')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Add Row/i }));

    await waitFor(() => {
      expect(screen.getAllByText('Field')).toHaveLength(2);
    });
  });
});
