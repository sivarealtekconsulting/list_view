import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import GnaneshDashboard from "../pages/gnanesh-dashboard";
import { GNANESH_MOCK_JOBS, GNANESH_JOB_LIST_SUMMARY } from '../data/jobs';

// ─────────────────────────────────────────────────────────────
// Mocks — lightweight, just confirm mounting
// ─────────────────────────────────────────────────────────────
vi.mock('../components/cards/StatsCards', () => ({
  default: () => <div data-testid="stats-cards" />,
}));
vi.mock('../components/cards/CalendarCard', () => ({
  default: () => <div data-testid="calendar-card" />,
}));
vi.mock('../components/cards/ClientSubmissionCard', () => ({
  default: () => <div data-testid="client-submission-card" />,
}));
vi.mock('../components/cards/StickyNotesCard', () => ({
  default: () => <div data-testid="sticky-notes-card" />,
}));
vi.mock('../components/cards/OnboardingCard', () => ({
  default: () => <div data-testid="onboarding-card" />,
}));
vi.mock('../components/GnaneshListView', () => ({
  default: () => <div data-testid="gnanesh-list-view" />,
}));

// ─────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────
const renderPage = () =>
  render(
    <BrowserRouter>
      <GnaneshDashboard />
    </BrowserRouter>
  );

const openForm = async () => {
  fireEvent.click(screen.getByText(/Add skill-matched candidate/i));
  await waitFor(() => {
    expect(screen.getByPlaceholderText(/Enter candidate name/i)).toBeInTheDocument();
  });
};

afterEach(() => cleanup());

// ─────────────────────────────────────────────────────────────
// 1. Page Render
// ─────────────────────────────────────────────────────────────
describe('GnaneshDashboard – Page Render', () => {
  it('renders without crashing', () => {
    renderPage();
    expect(document.body).toBeInTheDocument();
  });

  it('renders breadcrumb with Home and Gnanesh Dashboard', () => {
    renderPage();
    expect(screen.getByText(/^Home$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Gnanesh Dashboard$/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// 2. Child Components Mounted
// ─────────────────────────────────────────────────────────────
describe('GnaneshDashboard – Child Components', () => {
  it('mounts StatsCards', () => { renderPage(); expect(screen.getByTestId('stats-cards')).toBeInTheDocument(); });
  it('mounts CalendarCard', () => { renderPage(); expect(screen.getByTestId('calendar-card')).toBeInTheDocument(); });
  it('mounts ClientSubmissionCard', () => { renderPage(); expect(screen.getByTestId('client-submission-card')).toBeInTheDocument(); });
  it('mounts StickyNotesCard', () => { renderPage(); expect(screen.getByTestId('sticky-notes-card')).toBeInTheDocument(); });
  it('mounts OnboardingCard', () => { renderPage(); expect(screen.getByTestId('onboarding-card')).toBeInTheDocument(); });
  it('mounts GnaneshListView', () => { renderPage(); expect(screen.getByTestId('gnanesh-list-view')).toBeInTheDocument(); });
});

// ─────────────────────────────────────────────────────────────
// 3. Candidate Skill Submission Card
// ─────────────────────────────────────────────────────────────
describe('GnaneshDashboard – Candidate Skill Submission Card', () => {
  it('renders card title', () => {
    renderPage();
    expect(screen.getByText(/Candidate Skill Submission/i)).toBeInTheDocument();
  });

  it('renders card subtitle', () => {
    renderPage();
    expect(screen.getByText(/Add candidate details, skill strength, work authorization/i)).toBeInTheDocument();
  });

  it('renders collapse trigger label', () => {
    renderPage();
    expect(screen.getByText(/Add skill-matched candidate/i)).toBeInTheDocument();
  });

  it('expands form on collapse click', async () => {
    renderPage();
    await openForm();
    expect(screen.getByPlaceholderText(/Enter candidate name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter phone number/i)).toBeInTheDocument();
  });

  it('renders all form fields when expanded', async () => {
    renderPage();
    await openForm();
    expect(screen.getByPlaceholderText(/Enter MSP Req ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter job title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Example: React JS, Java, Python/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Example: Strong React and API/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// 4. Form Validation
// ─────────────────────────────────────────────────────────────
describe('GnaneshDashboard – Form Validation', () => {
  it('shows required errors on empty submit', async () => {
    renderPage();
    await openForm();
    fireEvent.click(screen.getByRole('button', { name: /Submit Candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/Candidate name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/MSP Req ID is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Job title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Primary skill is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Remarks are required/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email format', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter email address/i), { target: { value: 'invalidemail' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Candidate/i }));
    await waitFor(() => expect(screen.getByText(/Enter a valid email address/i)).toBeInTheDocument());
  });

  it('shows error for phone number less than 10 digits', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter phone number/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Candidate/i }));
    await waitFor(() => expect(screen.getByText(/Phone number must be 10 digits/i)).toBeInTheDocument());
  });

  it('shows error for candidate name with numbers', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter candidate name/i), { target: { value: 'John123' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Candidate/i }));
    await waitFor(() => expect(screen.getByText(/Candidate name should contain only alphabets/i)).toBeInTheDocument());
  });

  it('shows error for candidate name less than 3 characters', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter candidate name/i), { target: { value: 'Jo' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Candidate/i }));
    await waitFor(() => expect(screen.getByText(/Candidate name should be at least 3 characters/i)).toBeInTheDocument());
  });

  it('shows error for remarks less than 10 characters', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Example: Strong React and API/i), { target: { value: 'Short' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Candidate/i }));
    await waitFor(() => expect(screen.getByText(/Remarks should be at least 10 characters/i)).toBeInTheDocument());
  });

  it('shows error for MSP Req ID with special characters', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter MSP Req ID/i), { target: { value: 'MSP@#123' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Candidate/i }));
    await waitFor(() => expect(screen.getByText(/MSP Req ID can contain only letters, numbers and hyphen/i)).toBeInTheDocument());
  });

  it('shows error for remarks exceeding 300 characters', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Example: Strong React and API/i), { target: { value: 'A'.repeat(301) } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Candidate/i }));
    await waitFor(() => expect(screen.getByText(/Remarks should not exceed 300 characters/i)).toBeInTheDocument());
  });
});

// ─────────────────────────────────────────────────────────────
// 5. Form Reset
// ─────────────────────────────────────────────────────────────
describe('GnaneshDashboard – Form Reset', () => {
  it('clears candidate name field on Reset click', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter candidate name/i), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));
    await waitFor(() => expect(screen.getByPlaceholderText(/Enter candidate name/i).value).toBe(''));
  });

  it('clears email field on Reset click', async () => {
    renderPage();
    await openForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter email address/i), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));
    await waitFor(() => expect(screen.getByPlaceholderText(/Enter email address/i).value).toBe(''));
  });
});

// ─────────────────────────────────────────────────────────────
// 6. Job List Data Contract — fails if mock data is changed
// ─────────────────────────────────────────────────────────────
describe('GnaneshDashboard – Job List Data Contract', () => {
  it('fails if any job is commented out — total must be 7', () => {
    expect(GNANESH_MOCK_JOBS.length).toBe(7);
  });

  it('fails if myJobsCount in summary changes', () => {
    expect(GNANESH_JOB_LIST_SUMMARY.myJobsCount).toBe(7);
  });

  it('fails if allJobsCount in summary changes', () => {
    expect(GNANESH_JOB_LIST_SUMMARY.allJobsCount).toBe(2456);
  });

  it('fails if any job key is removed or renamed', () => {
    const keys = GNANESH_MOCK_JOBS.map(j => j.key);
    expect(keys).toContain('VEN-001');
    expect(keys).toContain('VEN-002');
    expect(keys).toContain('VEN-003');
    expect(keys).toContain('VEN-004');
    expect(keys).toContain('VEN-005');
    expect(keys).toContain('VEN-006');
    expect(keys).toContain('VEN-007');
  });

  it('fails if any job title is changed', () => {
    const titles = GNANESH_MOCK_JOBS.map(j => j.title);
    expect(titles).toContain('Full Stack Developer (3 Years Experience)');
    expect(titles).toContain('Java Developer (Python Experience)');
    expect(titles).toContain('React UI Engineer');
    expect(titles).toContain('Product Data Analyst');
    expect(titles).toContain('Cloud DevOps Specialist');
    expect(titles).toContain('QA Automation Lead');
    expect(titles).toContain('Business Systems Consultant');
  });

  it('fails if any job location is changed', () => {
    const locations = GNANESH_MOCK_JOBS.map(j => j.location);
    expect(locations).toContain('Chennai');
    expect(locations).toContain('Hyderabad');
    expect(locations).toContain('Bengaluru');
    expect(locations).toContain('Pune');
    expect(locations).toContain('Mumbai');
    expect(locations).toContain('Coimbatore');
    expect(locations).toContain('Delhi');
  });

  it('fails if any job status is changed', () => {
    const statuses = GNANESH_MOCK_JOBS.map(j => j.status);
    expect(statuses).toContain('Open');
    expect(statuses).toContain('Submitted');
    expect(statuses).toContain('Interview');
    expect(statuses).toContain('Screening');
    expect(statuses).toContain('Pipeline');
    expect(statuses).toContain('Shortlisted');
    expect(statuses).toContain('Offer');
  });

  it('fails if any job client rate is changed', () => {
    const rates = GNANESH_MOCK_JOBS.map(j => j.clientRate);
    expect(rates).toContain(60);
    expect(rates).toContain(72);
    expect(rates).toContain(68);
    expect(rates).toContain(80);
    expect(rates).toContain(95);
    expect(rates).toContain(88);
    expect(rates).toContain(105);
  });
});