/**
 * Focused tests for src/pages/sridharDetailePage.jsx.
 */

import { ConfigProvider } from 'antd';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SridharDetailPage from '../pages/sridharDetailePage';
import { SRIDHAR_MOCK_JOBS, sridharDashboardValid } from '../data/jobs';

const PAGE_SOURCE = 'src/pages/sridharDetailePage.jsx';

const OVERVIEW_LABELS = [
  { text: 'Overview', line: 156 },
  { text: 'Job Summary', line: 163 },
  { text: 'Job Title', line: 169 },
  { text: 'Client', line: 170 },
  { text: 'Location', line: 171 },
  { text: 'Work Mode', line: 172 },
  { text: 'Experience', line: 173 },
  { text: 'Employment Type', line: 174 },
  { text: 'Client Rate', line: 175 },
  { text: 'Created', line: 176 },
  { text: 'Skills', line: 180 },
  { text: 'Activity', line: 189 },
  { text: 'Candidate ID', line: 35 },
  { text: 'Name', line: 36 },
  { text: 'Client Job ID', line: 37 },
  { text: 'Gross Margin', line: 38 },
  { text: 'Net Margin', line: 39 },
  { text: 'Stage', line: 40 },
];

const TAB_LABELS = [
  { text: 'Candidates', line: 210 },
  { text: 'Submission', line: 226 },
  { text: 'Add Note', line: 250 },
  { text: 'Full Form', line: 336 },
];

const PAGE_COMPONENT_SLOTS = [
  { name: 'ParamListView', selector: '.dynamic-list-view', line: 188 },
  { name: 'CalendarCard', selector: '.calendar-card', line: 199 },
];

const SUBMISSION_COMPONENT_SLOTS = [
  { name: 'ClientSubmissionCard', selector: '.submission-card', line: 231 },
  { name: 'StickyNotesCard', selector: '.sticky-card', line: 232 },
  { name: 'StatsCards', selector: '.stats-inner-card', line: 238 },
  { name: 'OnboardingCard', selector: '.onboarding-card', line: 241 },
];

const theme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
};

function renderDetail(jobId = 2) {
  return render(
    <ConfigProvider theme={theme}>
      <MemoryRouter initialEntries={[`/sri-detailview/${jobId}`]}>
        <Routes>
          <Route path="/sri-dashboard" element={<div>Dashboard route reached</div>} />
          <Route path="/sri-detailview/:jobId" element={<SridharDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ConfigProvider>,
  );
}

function expectPageText(text, line) {
  const label = typeof text === 'string' ? { text, line } : text;
  if (screen.queryAllByText(label.text).length > 0) return;

  throw new Error([
    `Page contract failed: ${PAGE_SOURCE}:${label.line}`,
    `Missing text: "${label.text}"`,
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

describe.skipIf(!sridharDashboardValid)('sridharDetailePage route and overview', () => {
  it('renders the route job data and breadcrumb actions', async () => {
    const job = SRIDHAR_MOCK_JOBS.find((j) => j.id === 2) ?? SRIDHAR_MOCK_JOBS[0];
    renderDetail(2);

    expectPageText('Home', 363);
    expectPageText('Dashboard', 366);
    expectPageText('Detail View', 371);
    expectPageText(job.title, 385);
    expectPageText(job.client, 386);
    expectPageText(job.location, 405);
    expectPageText(`$${job.clientRate}/hr`, 419);
    expectPageText(String(job.pipeline), 426);

    await userEvent.click(screen.getByText('Dashboard'));

    expect(screen.getByText('Dashboard route reached')).toBeInTheDocument();
  });

  it('renders exact overview labels and tab labels', () => {
    const { container } = renderDetail(2);

    OVERVIEW_LABELS.forEach(expectPageText);
    TAB_LABELS.forEach(expectPageText);
    expectPageText('AUTO123456', 90);
    PAGE_COMPONENT_SLOTS.forEach((slot) => expectPageSelector(container, slot));
  });
});

describe.skipIf(!sridharDashboardValid)('sridharDetailePage tab content', () => {
  it('renders the Sridhar list view inside the Candidates tab', async () => {
    renderDetail(2);

    await userEvent.click(screen.getByRole('tab', { name: /candidates/i }));

    expectPageText('Submitted Candidates', 228);
    const candidatesCard = screen.getByText('Submitted Candidates').closest('.ant-card');
    expect(candidatesCard.querySelector('.job-list-table')).toBeInTheDocument();
  });

  it('renders the submission tab cards', async () => {
    const { container } = renderDetail(2);

    await userEvent.click(screen.getByRole('tab', { name: /submission/i }));

    SUBMISSION_COMPONENT_SLOTS.forEach((slot) => expectPageSelector(container, slot));
  });
});
