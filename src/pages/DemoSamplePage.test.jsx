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

function renderDemoPage() {
  return render(
    <MemoryRouter>
      <DemoSamplePage />
    </MemoryRouter>,
  );
}

function getPersonalityListCard() {
  return screen.getByText('Personality List').closest('.ant-card');
}

function getCalendarCard() {
  return screen.getByText('April 2026').closest('.ant-card');
}

describe('DemoSamplePage dashboard', () => {
  it('renders the main dashboard sections', () => {
    renderDemoPage();

    expect(screen.getByText('Add / Edit Personality')).toBeInTheDocument();
    expect(screen.getByText('Personality List')).toBeInTheDocument();
    expect(screen.getByText('Sticky Notes')).toBeInTheDocument();
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Total Client Submission:')).toBeInTheDocument();
  });

  it('renders KPI labels and values', () => {
    renderDemoPage();

    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
    expect(screen.getByText('1,697')).toBeInTheDocument();
    expect(screen.getByText('Active Jobs')).toBeInTheDocument();
    expect(screen.getByText('1,685')).toBeInTheDocument();
    expect(screen.getAllByText('My Jobs').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('600')).toBeInTheDocument();
  });

  it('renders supporting dashboard card labels', () => {
    renderDemoPage();

    expect(screen.getAllByText('Tagged')).toHaveLength(2);
    expect(screen.getAllByText('Note')).toHaveLength(2);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Project Completed')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });
});

describe('DemoSamplePage form', () => {
  it('shows required validation when Save is clicked without mandatory fields', async () => {
    renderDemoPage();

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findAllByText('Mandatory Field')).toHaveLength(3);
  });

  it('formats entered personality name while typing', async () => {
    renderDemoPage();

    const nameInput = screen.getByPlaceholderText('Enter personality name');
    await userEvent.type(nameInput, 'john doe');

    expect(nameInput).toHaveValue('John Doe');
  });

  it('validates alphabet-only name and optional DOB format', async () => {
    renderDemoPage();

    await userEvent.type(screen.getByPlaceholderText('Enter personality name'), 'John123');
    await userEvent.type(screen.getByPlaceholderText('MM/DD/YYYY'), '13/40/2024');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Only alphabets and spaces are allowed.')).toBeInTheDocument();
    expect(await screen.findByText('DOB must be in MM/DD/YYYY format.')).toBeInTheDocument();
  });

  it('does not show name required validation after a valid name is entered', async () => {
    renderDemoPage();

    await userEvent.type(screen.getByPlaceholderText('Enter personality name'), 'john doe');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findAllByText('Mandatory Field')).toHaveLength(2);
  });
});

describe('DemoSamplePage calendar', () => {
  it('renders the default calendar month', () => {
    renderDemoPage();

    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('moves between months using calendar navigation', async () => {
    renderDemoPage();

    const calendarCard = getCalendarCard();
    await userEvent.click(within(calendarCard).getByRole('button', { name: /left/i }));
    expect(screen.getByText('March 2026')).toBeInTheDocument();

    await userEvent.click(within(calendarCard).getByRole('button', { name: /right/i }));
    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('renders calendar legend items', () => {
    renderDemoPage();

    expect(screen.getByText('Onboarded date')).toBeInTheDocument();
    expect(screen.getByText('Exit date')).toBeInTheDocument();
    expect(screen.getByText('To-do mentioned')).toBeInTheDocument();
    expect(screen.getByText('Interview scheduled')).toBeInTheDocument();
  });
});

describe('DemoSamplePage inline list view', () => {
  it('renders list tabs and table headers', () => {
    renderDemoPage();

    expect(screen.getAllByText('My Jobs').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('All Jobs')).toBeInTheDocument();
    expect(screen.getAllByText('Jobs')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Location').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Created date').length).toBeGreaterThanOrEqual(1);
  });

  it('renders job detail links with correct route', () => {
    renderDemoPage();

    expect(screen.getByRole('link', { name: /Full Stack Developer/i })).toHaveAttribute(
      'href',
      '/Venkatesh-detailview/1',
    );
  });

  it('renders pagination controls and result range', () => {
    renderDemoPage();

    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.getByText('/ page')).toBeInTheDocument();
    expect(screen.getByText('Showing of 1 - 5 of 30')).toBeInTheDocument();
  });

  it('keeps list unfiltered until search reaches three characters', async () => {
    renderDemoPage();

    await userEvent.type(screen.getByPlaceholderText('Min 3 Chars to search'), 'Fu');

    expect(screen.getByText('Full Stack Developer (3 Years Experience)')).toBeInTheDocument();
    expect(screen.getAllByText('Java Developer (Python Experience)').length).toBeGreaterThanOrEqual(1);
  });

  it('filters list results after minimum search characters', async () => {
    renderDemoPage();

    await userEvent.type(screen.getByPlaceholderText('Min 3 Chars to search'), 'Full');

    expect(screen.getByText('Full Stack Developer (3 Years Experience)')).toBeInTheDocument();
    expect(screen.queryByText('Java Developer (Python Experience)')).not.toBeInTheDocument();
  });

  it('shows selected row count when a row checkbox is selected', async () => {
    renderDemoPage();

    const checkboxes = within(getPersonalityListCard()).getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);

    expect(screen.getByText('Selected (1)')).toBeInTheDocument();
  });

  it('switches to All Jobs tab without losing table data', async () => {
    renderDemoPage();

    await userEvent.click(screen.getByRole('tab', { name: /All Jobs/i }));

    expect(screen.getByRole('tab', { name: /All Jobs/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Full Stack Developer (3 Years Experience)')).toBeInTheDocument();
  });

  it('opens the inline list actions menu', async () => {
    renderDemoPage();

    await userEvent.click(screen.getByRole('button', { name: /Actions/i }));

    expect(await screen.findByText('Export selected')).toBeInTheDocument();
    expect(screen.getByText('Assign')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('opens the inline list column visibility menu', async () => {
    const { container } = renderDemoPage();

    await userEvent.click(container.querySelector('.job-actions-button'));

    expect(await screen.findByText('Select All')).toBeInTheDocument();
    expect(screen.getByText('Created Date')).toBeInTheDocument();
    expect(screen.getAllByText('Location').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Pipeline').length).toBeGreaterThanOrEqual(1);
  });
});

describe('DemoSamplePage filters', () => {
  it('opens the filter drawer and shows filter controls', async () => {
    renderDemoPage();

    await userEvent.click(screen.getByRole('button', { name: /filter/i }));

    expect(await screen.findByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Field')).toBeInTheDocument();
    expect(screen.getByText('Values')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Row/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apply/i })).toBeInTheDocument();
  });

  it('adds another filter row inside the drawer', async () => {
    renderDemoPage();

    await userEvent.click(screen.getByRole('button', { name: /filter/i }));
    expect(await screen.findByText('Filters')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Add Row/i }));

    await waitFor(() => {
      expect(screen.getAllByText('Field')).toHaveLength(2);
    });
  });
});
