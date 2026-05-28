/**
 * DashboardCards.test.jsx
 * ────────────────────────
 * Deep UI test suite for src/components/cards/DashboardCards.jsx.
 *
 * Stack : Vitest + React Testing Library
 * Run   : npm test -- DashboardCards.test.jsx
 *
 * Coverage areas
 *  1. Composite render      — all child cards are mounted
 *  2. StatsCards slot       — 3 stat values visible
 *  3. ClientSubmissionCard slot — total and row labels visible
 *  4. StickyNotesCard slot  — heading and notes visible
 *  5. CalendarCard slot     — April 2026 heading and legend visible
 *  6. OnboardingCard slot   — heading and stat labels visible
 *  7. ClientDetailsCard slot — form labels visible
 *  8. Layout structure      — grid rows and columns present
 *
 * Reuse philosophy
 *  This suite only verifies that each child component is present (integration
 *  smoke test). Detailed assertions for each card live in their own test files
 *  (CalendarCard.test.jsx, StatsCards.test.jsx, etc.).
 */

import { render, screen } from '@testing-library/react';
import DashboardCards from '../components/cards/DashboardCards';

const renderDashboardCards = () => render(<DashboardCards />);

// ════════════════════════════════════════════════════════════════════════════
// 1. Composite render
// ════════════════════════════════════════════════════════════════════════════
describe('DashboardCards composite render', () => {
  it('renders without crashing', () => {
    renderDashboardCards();
  });

  it('renders the dashboard-wrapper container', () => {
    const { container } = renderDashboardCards();
    expect(container.querySelector('.dashboard-wrapper')).toBeInTheDocument();
  });

  it('renders multiple ant-card elements (one per child card)', () => {
    const { container } = renderDashboardCards();
    expect(container.querySelectorAll('.ant-card').length).toBeGreaterThanOrEqual(5);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. StatsCards slot
// ════════════════════════════════════════════════════════════════════════════
describe('DashboardCards StatsCards slot', () => {
  it('renders "Total Jobs" stat label', () => {
    renderDashboardCards();
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
  });

  it('renders "Active Jobs" stat label', () => {
    renderDashboardCards();
    expect(screen.getByText('Active Jobs')).toBeInTheDocument();
  });

  it('renders "My Jobs" stat label', () => {
    renderDashboardCards();
    expect(screen.getByText('My Jobs')).toBeInTheDocument();
  });

  it('renders Total Jobs value 1,697', () => {
    renderDashboardCards();
    expect(screen.getByText('1,697')).toBeInTheDocument();
  });

  it('renders Active Jobs value 1,685', () => {
    renderDashboardCards();
    expect(screen.getByText('1,685')).toBeInTheDocument();
  });

  it('renders My Jobs value 600', () => {
    renderDashboardCards();
    expect(screen.getByText('600')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. ClientSubmissionCard slot
// ════════════════════════════════════════════════════════════════════════════
describe('DashboardCards ClientSubmissionCard slot', () => {
  it('renders "Total Client Submission:" label', () => {
    renderDashboardCards();
    expect(screen.getByText('Total Client Submission:')).toBeInTheDocument();
  });

  it('renders total count 1,324', () => {
    renderDashboardCards();
    expect(screen.getByText('1,324')).toBeInTheDocument();
  });

  it('renders "Submitted" row label', () => {
    renderDashboardCards();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });

  it('renders "Rejected" row label', () => {
    renderDashboardCards();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders submitted count 534', () => {
    renderDashboardCards();
    expect(screen.getByText('534')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. StickyNotesCard slot
// ════════════════════════════════════════════════════════════════════════════
describe('DashboardCards StickyNotesCard slot', () => {
  it('renders "Sticky Notes" heading', () => {
    renderDashboardCards();
    expect(screen.getByText('Sticky Notes')).toBeInTheDocument();
  });

  it('renders 2 "Tagged" pill labels', () => {
    renderDashboardCards();
    expect(screen.getAllByText('Tagged')).toHaveLength(2);
  });

  it('renders 2 "Note" pill labels', () => {
    renderDashboardCards();
    expect(screen.getAllByText('Note')).toHaveLength(2);
  });

  it('renders "Resume mismatch on Kiran Erravalla" note title', () => {
    renderDashboardCards();
    expect(screen.getAllByText('Resume mismatch on Kiran Erravalla')).toHaveLength(2);
  });

  it('renders "04 April, 2026" date on the peach note', () => {
    renderDashboardCards();
    expect(screen.getByText('04 April, 2026')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. CalendarCard slot
// ════════════════════════════════════════════════════════════════════════════
describe('DashboardCards CalendarCard slot', () => {
  it('renders "April 2026" calendar heading', () => {
    renderDashboardCards();
    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('renders all 7 day-name headers', () => {
    renderDashboardCards();
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((d) => {
      expect(screen.getByText(d)).toBeInTheDocument();
    });
  });

  it('renders 4 calendar-legend-dot indicators', () => {
    const { container } = renderDashboardCards();
    expect(container.querySelectorAll('.calendar-legend-dot').length).toBe(4);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. OnboardingCard slot
// ════════════════════════════════════════════════════════════════════════════
describe('DashboardCards OnboardingCard slot', () => {
  it('renders "Onboarding" heading', () => {
    renderDashboardCards();
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('renders "In Progress" stat label', () => {
    renderDashboardCards();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders "Hired" stat label', () => {
    renderDashboardCards();
    expect(screen.getByText('Hired')).toBeInTheDocument();
  });

  it('renders "Project Completed" stat label', () => {
    renderDashboardCards();
    expect(screen.getByText('Project Completed')).toBeInTheDocument();
  });

  it('renders "Archive" stat label', () => {
    renderDashboardCards();
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });

  it('renders In Progress value 107', () => {
    renderDashboardCards();
    expect(screen.getByText('107')).toBeInTheDocument();
  });

  it('renders at least 2 "View all" links (StickyNotes + Onboarding)', () => {
    renderDashboardCards();
    expect(screen.getAllByText('View all').length).toBeGreaterThanOrEqual(2);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. ClientDetailsCard slot
// ════════════════════════════════════════════════════════════════════════════
describe('DashboardCards ClientDetailsCard slot', () => {
  it('renders "Client Details" card title', () => {
    renderDashboardCards();
    expect(screen.getByText('Client Details')).toBeInTheDocument();
  });

  it('renders the subtitle about basic client information', () => {
    renderDashboardCards();
    expect(
      screen.getByText('Basic client and contact information for this job'),
    ).toBeInTheDocument();
  });

  it('renders "*Name" form label', () => {
    renderDashboardCards();
    expect(screen.getByText('*Name')).toBeInTheDocument();
  });

  it('renders "Contact Person" form label', () => {
    renderDashboardCards();
    expect(screen.getByText('Contact Person')).toBeInTheDocument();
  });

  it('renders "Account Manager" form label', () => {
    renderDashboardCards();
    expect(screen.getByText('Account Manager')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 8. Layout structure
// ════════════════════════════════════════════════════════════════════════════
describe('DashboardCards layout structure', () => {
  it('renders ant-row grid wrappers', () => {
    const { container } = renderDashboardCards();
    expect(container.querySelectorAll('.ant-row').length).toBeGreaterThanOrEqual(1);
  });

  it('renders ant-col grid cells', () => {
    const { container } = renderDashboardCards();
    expect(container.querySelectorAll('.ant-col').length).toBeGreaterThanOrEqual(4);
  });

  it('renders stats-inner-card elements from StatsCards', () => {
    const { container } = renderDashboardCards();
    expect(container.querySelectorAll('.stats-inner-card').length).toBeGreaterThanOrEqual(3);
  });

  it('renders 4 onboarding-item elements from OnboardingCard', () => {
    const { container } = renderDashboardCards();
    expect(container.querySelectorAll('.onboarding-item').length).toBe(4);
  });

  it('renders 4 sticky-note elements from StickyNotesCard', () => {
    const { container } = renderDashboardCards();
    expect(container.querySelectorAll('.sticky-note').length).toBe(4);
  });
});
