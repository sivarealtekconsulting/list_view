import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PugazhDashboard from './pugazh-dashboard';   
import {
  ONBOARDING_STATS,
  JOB_STATS,
  CLIENT_SUBMISSION_STATS,
  CALENDAR_EVENTS,
  CALENDAR_LEGEND,
  STICKY_NOTES,
  PUGAZH_MOCK_JOBS,
  MOCK_CANDIDATES,
  MOCK_CLIENTS,
  FORM_OPTIONS,
} from '../data/pug-data.json';

// ─── Mocks ───────────────────────────────────────────────────
vi.mock('../components/pugalistView', () => ({
  default: () => <div data-testid="job-list-view">Job List View</div>,
}));
vi.mock('../components/cards/StatsCards', () => ({
  default: () => <div data-testid="stats-cards">Stats Cards</div>,
}));
vi.mock('../components/cards/CalendarCard', () => ({
  default: () => <div data-testid="calendar-card">Calendar Card</div>,
}));
vi.mock('../components/cards/ClientSubmissionCard', () => ({
  default: () => <div data-testid="client-submission-card">Client Submission Card</div>,
}));
vi.mock('../components/cards/ClientDetailsCard', () => ({
  default: () => <div data-testid="client-details-card">Client Details Card</div>,
}));
vi.mock('../components/cards/StickyNotesCard', () => ({
  default: () => <div data-testid="sticky-notes-card">Sticky Notes Card</div>,
}));
vi.mock('../components/cards/OnboardingCard', () => ({
  default: () => <div data-testid="onboarding-card">Onboarding Card</div>,
}));
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Affix: ({ children }) => <div>{children}</div>,
    FloatButton: () => null,
  };
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <PugazhDashboard />
    </MemoryRouter>
  );

// ─── SCENARIO 1: Page Structure ───────────────────────────────
describe('Scenario: Dashboard page loads successfully', () => {
  it('should render the root dashboard wrapper', () => {
    const { container } = renderPage();
    expect(container.querySelector('.dashboard-wrapper')).toBeInTheDocument();
  });

  it('should render breadcrumb navigation', () => {
    const { container } = renderPage();
    expect(container.querySelector('.ant-breadcrumb')).toBeInTheDocument();
  });

  it('should render a two-column layout (left and right)', () => {
    const { container } = renderPage();
    expect(container.querySelector('.jobs-page-left')).toBeInTheDocument();
    expect(container.querySelector('.jobs-page-right')).toBeInTheDocument();
  });
});

// ─── SCENARIO 2: Left Panel Cards ─────────────────────────────
describe('Scenario: Left panel renders all required cards', () => {
  it('should render the onboarding status card', () => {
    renderPage();
    expect(screen.getByTestId('onboarding-card')).toBeInTheDocument();
  });

  it('should render the job stats card', () => {
    renderPage();
    expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
  });

  it('should render the job list view', () => {
    renderPage();
    expect(screen.getByTestId('job-list-view')).toBeInTheDocument();
  });

  it('should render onboarding card before stats card (top-to-bottom order)', () => {
    const { container } = renderPage();
    const left = container.querySelector('.jobs-page-left');
    const children = Array.from(left.children);
    const onboardingIndex = children.findIndex(el => el.querySelector('[data-testid="onboarding-card"]'));
    const statsIndex = children.findIndex(el => el.querySelector('[data-testid="stats-cards"]'));
    expect(onboardingIndex).toBeLessThan(statsIndex);
  });

  it('should render stats card before job list view (top-to-bottom order)', () => {
    const { container } = renderPage();
    const left = container.querySelector('.jobs-page-left');
    const children = Array.from(left.children);
    const statsIndex = children.findIndex(el => el.querySelector('[data-testid="stats-cards"]'));
    const listIndex = children.findIndex(el => el.querySelector('[data-testid="job-list-view"]'));
    expect(statsIndex).toBeLessThan(listIndex);
  });
});

// ─── SCENARIO 3: Right Panel Cards ────────────────────────────
describe('Scenario: Right panel renders all required cards', () => {
  it('should render the calendar card', () => {
    renderPage();
    expect(screen.getByTestId('calendar-card')).toBeInTheDocument();
  });

  it('should render the client submission card', () => {
    renderPage();
    expect(screen.getByTestId('client-submission-card')).toBeInTheDocument();
  });

  it('should render the sticky notes card', () => {
    renderPage();
    expect(screen.getByTestId('sticky-notes-card')).toBeInTheDocument();
  });

  it('should render calendar card before client submission card (top-to-bottom order)', () => {
    const { container } = renderPage();
    const right = container.querySelector('.jobs-page-right');
    const children = Array.from(right.children);
    const calIndex = children.findIndex(el => el.querySelector('[data-testid="calendar-card"]'));
    const subIndex = children.findIndex(el => el.querySelector('[data-testid="client-submission-card"]'));
    expect(calIndex).toBeLessThan(subIndex);
  });

  it('should render client submission card before sticky notes card (top-to-bottom order)', () => {
    const { container } = renderPage();
    const right = container.querySelector('.jobs-page-right');
    const children = Array.from(right.children);
    const subIndex = children.findIndex(el => el.querySelector('[data-testid="client-submission-card"]'));
    const notesIndex = children.findIndex(el => el.querySelector('[data-testid="sticky-notes-card"]'));
    expect(subIndex).toBeLessThan(notesIndex);
  });
});

// ─── SCENARIO 4: Client Details Section ───────────────────────
describe('Scenario: Client details section renders below main layout', () => {
  it('should render the client details card', () => {
    renderPage();
    expect(screen.getByTestId('client-details-card')).toBeInTheDocument();
  });

  it('should render client details section with correct wrapper class', () => {
    const { container } = renderPage();
    expect(container.querySelector('.client-details-card')).toBeInTheDocument();
  });
});

// ─── SCENARIO 5: Candidate Registration Form Renders ──────────
describe('Scenario: Candidate registration form is visible on page', () => {
  it('should render the Candidate Registration section heading', () => {
    renderPage();
    expect(screen.getByText(/Candidate Registration/i)).toBeInTheDocument();
  });

  it('should render the candidate registration card class', () => {
    const { container } = renderPage();
    expect(container.querySelector('.candidate-registration-card')).toBeInTheDocument();
  });

  it('should render a form element', () => {
    const { container } = renderPage();
    expect(container.querySelector('form')).toBeInTheDocument();
  });
});

// ─── SCENARIO 6: Candidate Identity Fields ────────────────────
describe('Scenario: Candidate identity input fields are present', () => {
  it('should render Candidate Name label', () => {
    renderPage();
    expect(screen.getByText('Candidate Name')).toBeInTheDocument();
  });

  it('should render candidate name input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter candidate name/i)).toBeInTheDocument();
  });

  it('should render Email label', () => {
    renderPage();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should render email input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter email address/i)).toBeInTheDocument();
  });

  it('should render Phone Number label', () => {
    renderPage();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
  });

  it('should render phone number input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter phone number/i)).toBeInTheDocument();
  });
});

// ─── SCENARIO 7: Job Information Fields ───────────────────────
describe('Scenario: Job information input fields are present', () => {
  it('should render MSP Req ID label', () => {
    renderPage();
    expect(screen.getByText('MSP Req ID')).toBeInTheDocument();
  });

  it('should render MSP Req ID input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter MSP Req ID/i)).toBeInTheDocument();
  });

  it('should render Job Title label', () => {
    renderPage();
    expect(screen.getByText('Job Title')).toBeInTheDocument();
  });

  it('should render job title input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter job title/i)).toBeInTheDocument();
  });

  it('should render Primary Skill label', () => {
    renderPage();
    expect(screen.getByText('Primary Skill')).toBeInTheDocument();
  });

  it('should render primary skill input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Example: React JS, Java, Python/i)).toBeInTheDocument();
  });
});

// ─── SCENARIO 8: Dropdown Fields ──────────────────────────────
describe('Scenario: Dropdown selection fields are present', () => {
  it('should render Experience dropdown label', () => {
    renderPage();
    expect(screen.getAllByText(/Experience/i).length).toBeGreaterThan(0);
  });

  it('should render Contract Type dropdown label', () => {
    renderPage();
    expect(screen.getAllByText(/Contract Type/i).length).toBeGreaterThan(0);
  });

  it('should render Skill Match Level dropdown label', () => {
    renderPage();
    expect(screen.getAllByText(/Skill Match Level/i).length).toBeGreaterThan(0);
  });

  it('should render Work Authorization dropdown label', () => {
    renderPage();
    expect(screen.getAllByText(/Work Authorization/i).length).toBeGreaterThan(0);
  });

  it('should render Notice Period dropdown label', () => {
    renderPage();
    expect(screen.getAllByText(/Notice Period/i).length).toBeGreaterThan(0);
  });
});

// ─── SCENARIO 9: Location and Notes Fields ────────────────────
describe('Scenario: Location and recruiter notes fields are present', () => {
  it('should render Current Location label', () => {
    renderPage();
    expect(screen.getByText('Current Location')).toBeInTheDocument();
  });

  it('should render current location input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter current location/i)).toBeInTheDocument();
  });

  it('should render Recruiter Skill Notes label', () => {
    renderPage();
    expect(screen.getByText(/Recruiter Skill Notes/i)).toBeInTheDocument();
  });

  it('should render recruiter notes textarea', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter recruiter notes/i)).toBeInTheDocument();
  });
});

// ─── SCENARIO 10: Form Action Buttons ─────────────────────────
describe('Scenario: Form submit and reset actions are available', () => {
  it('should render Submit Candidate button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Submit Candidate/i })).toBeInTheDocument();
  });

  it('should render Reset button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
  });

  describe('Scenario: Form submit and reset actions are available', () => {
  it('should render Submit Candidate button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Submit Candidate/i })).toBeInTheDocument();
  });

  it('should render Reset button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
  });
});
});

// ─── SCENARIO 11: Each card renders exactly once ──────────────
describe('Scenario: No duplicate cards rendered on page', () => {
  it('should render each dashboard card exactly once', () => {
    renderPage();
    expect(screen.getAllByTestId('onboarding-card')).toHaveLength(1);
    expect(screen.getAllByTestId('stats-cards')).toHaveLength(1);
    expect(screen.getAllByTestId('job-list-view')).toHaveLength(1);
    expect(screen.getAllByTestId('calendar-card')).toHaveLength(1);
    expect(screen.getAllByTestId('client-submission-card')).toHaveLength(1);
    expect(screen.getAllByTestId('sticky-notes-card')).toHaveLength(1);
    expect(screen.getAllByTestId('client-details-card')).toHaveLength(1);
  });
});