/**
 * Focused tests for src/pages/sridharDashboard.jsx.
 */

import { ConfigProvider } from 'antd';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SridharDashboardPage from '../pages/sridharDashboard';
import { sridharJobsValid } from '../data/jobs';

const PAGE_SOURCE = 'src/pages/sridharDashboard.jsx';

const PAGE_LABELS = [
  { text: 'Home', line: 38 },
  { text: 'Dashboard', line: 40 },
  { text: 'Quick job intake', line: 54 },
  { text: 'Job Title', line: 64 },
  { text: 'Client Company', line: 83 },
  { text: 'Contact Email', line: 102 },
  { text: 'Phone Number', line: 121 },
  { text: 'Remarks', line: 142 },
  { text: 'Submit', line: 158 },
  { text: 'Reset', line: 161 },
  { text: 'Jobs List', line: 181 },
];

const PAGE_COMPONENT_SLOTS = [
  { name: 'StatsCards', selector: '.stats-inner-card', line: 48 },
  { name: 'CalendarCard', selector: '.calendar-card', line: 171 },
  { name: 'SridharListView', selector: '.job-list-table', line: 185 },
  { name: 'ClientSubmissionCard', selector: '.submission-card', line: 193 },
  { name: 'OnboardingCard', selector: '.onboarding-card', line: 194 },
  { name: 'StickyNotesCard', selector: '.sticky-card', line: 200 },
  { name: 'ClientDetailsCard', selector: '.client-details-card', line: 201 },
];

const theme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
};

function renderDashboard() {
  return render(
    <ConfigProvider theme={theme}>
      <MemoryRouter initialEntries={['/sri-dashboard']}>
        <SridharDashboardPage />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

function expectPageText({ text, line }) {
  if (screen.queryAllByText(text).length > 0) return;

  throw new Error([
    `Page contract failed: ${PAGE_SOURCE}:${line}`,
    `Missing text: "${text}"`,
  ].join('\n'));
}

function expectPageSelector(container, { name, selector, line }) {
  if (container.querySelector(selector)) return;

  throw new Error([
    `Page component missing: ${PAGE_SOURCE}:${line}`,
    `Expected component slot: ${name}`,
    `Missing selector: ${selector}`,
  ].join('\n'));
}

describe.skipIf(!sridharJobsValid)('sridharDashboard page shell', () => {
  it('renders the exact dashboard-owned labels', () => {
    renderDashboard();

    PAGE_LABELS.forEach(expectPageText);

    const jobsCards = screen.getAllByText('Jobs List');
    expect(jobsCards).toHaveLength(1);
  });

  it('renders each reused component slot once on the dashboard', () => {
    const { container } = renderDashboard();

    PAGE_COMPONENT_SLOTS.forEach((slot) => expectPageSelector(container, slot));
  });

  it('mounts SridharListView inside the Jobs List card', () => {
    renderDashboard();

    const jobsCard = screen.getByText('Jobs List').closest('.ant-card');
    expect(jobsCard).toBeInTheDocument();
    expect(jobsCard.querySelector('.job-list-table')).toBeInTheDocument();
  });
});
