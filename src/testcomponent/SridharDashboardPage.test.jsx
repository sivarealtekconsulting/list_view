/**
 * SridharDashboardPage.test.jsx
 * ------------------------------
 * Tests for src/pages/sridharDashboard.jsx.
 * Covers static page shell and API-driven rendering (jobs + header fields).
 */

import { ConfigProvider } from 'antd';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SridharDashboardPage from '../pages/sridharDashboard';
import { sridharDashboardValid, SRIDHAR_MOCK_JOBS } from '../data/jobs';
import { getJobs, getHeaderFields } from '../services/dropdownApi';

vi.mock('../services/dropdownApi', () => ({
  getJobs: vi.fn(),
  getHeaderFields: vi.fn(),
}));

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

// Realistic API response shapes matching the actual API contract
const MOCK_API_JOBS_RESPONSE = {
  joblist: [
    {
      _id: 'api-201',
      jobTitle: 'Cloud FinOps Engineer',
      clientInfo: { clientName: 'BlueHarbor Capital', clientReferenceId: '827514' },
      jobLocation: 'Charlotte',
      jobRemoteStatus: 'Hybrid',
      experience: '7 years',
      employmentType: 'Contract',
      clientRate: 104,
      jobStatus: 'active',
      createdAt: 'May 18, 2026',
      createdAgo: '11 days ago',
      pipeline: 9,
      priority: 'High',
    },
    {
      _id: 'api-202',
      jobTitle: 'Generative AI Analyst',
      clientInfo: { clientName: 'Northstar Retail', clientReferenceId: '409731' },
      jobLocation: 'Seattle',
      jobRemoteStatus: 'Remote',
      experience: '5 years',
      employmentType: 'Full-time',
      clientRate: 121,
      jobStatus: 'active',
      createdAt: 'May 20, 2026',
      createdAgo: '9 days ago',
      pipeline: 13,
      priority: 'Medium',
    },
  ],
  tabs: [
    { title: 'My Jobs', count: 2 },
    { title: 'All Jobs', count: 2 },
  ],
  count: 2,
};

// API header fields response matching the auth API contract
const MOCK_API_HEADER_FIELDS_RESPONSE = [
  { label: 'Created date', value: 'createdAt', isVisible: true },
  { label: 'Jobs', value: 'jobs', isVisible: true },
  { label: 'Location', value: 'location', isVisible: true },
  { label: 'Experience', value: 'experience', isVisible: true },
  { label: 'Client Rate', value: 'clientRate', isVisible: true },
  { label: 'Status', value: 'status', isVisible: true },
  { label: 'Priority', value: 'priority', isVisible: true },
  { label: 'Pipeline', value: 'pipeline', isVisible: true },
];

// Required fields that every job from the API must have for correct rendering
const REQUIRED_JOB_FIELDS = [
  { keys: ['id', '_id'], label: 'id / _id (for job detail route)' },
  { keys: ['title', 'jobTitle'], label: 'title / jobTitle (job heading)' },
  { keys: ['location', 'jobLocation'], label: 'location / jobLocation' },
  { keys: ['status', 'jobStatus', 'recruitmentStatus'], label: 'status / jobStatus / recruitmentStatus' },
  { keys: ['createdAt'], label: 'createdAt (created date column)' },
  { keys: ['experience'], label: 'experience' },
  { keys: ['clientRate'], label: 'clientRate' },
];

// Required column keys that the header fields API must include
const REQUIRED_HEADER_FIELD_VALUES = ['jobs', 'location', 'status', 'createdAt', 'experience'];

function validateApiJobsResponse(jobs) {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return ['API response: jobs array is empty or missing'];
  }
  const errors = [];
  jobs.forEach((job, index) => {
    const tag = job.id ?? job._id ?? job.key ?? `job[${index}]`;
    REQUIRED_JOB_FIELDS.forEach(({ keys, label }) => {
      const hasValue = keys.some((k) => job[k] != null && job[k] !== '');
      if (!hasValue) errors.push(`${tag}: missing required field — ${label}`);
    });
  });
  return errors;
}

function validateApiHeaderFields(fields) {
  if (!Array.isArray(fields) || fields.length === 0) {
    return ['API header fields: array is empty or missing'];
  }
  const errors = [];
  REQUIRED_HEADER_FIELD_VALUES.forEach((key) => {
    const found = fields.some(
      (f) => (f.value ?? f.field ?? f.key ?? f.fieldKey) === key,
    );
    if (!found) errors.push(`API header fields: missing required column "${key}"`);
  });
  return errors;
}

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

// ── Page shell (API fails → falls back to mock data) ──────────────────────────

describe.skipIf(!sridharDashboardValid)('sridharDashboard page shell', () => {
  beforeEach(() => {
    getJobs.mockRejectedValue(new Error('Network error'));
    getHeaderFields.mockRejectedValue(new Error('Network error'));
  });

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

// ── API integration ────────────────────────────────────────────────────────────

describe('sridharDashboard API integration', () => {
  beforeEach(() => {
    getJobs.mockReset();
    getHeaderFields.mockReset();
  });

  it('renders jobs from a successful API response', async () => {
    getJobs.mockResolvedValue(MOCK_API_JOBS_RESPONSE);
    getHeaderFields.mockResolvedValue(MOCK_API_HEADER_FIELDS_RESPONSE);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Cloud FinOps Engineer' })).toBeInTheDocument();
    });
    expect(screen.getByText('Charlotte')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Generative AI Analyst' })).toBeInTheDocument();
  });

  it('renders column headers from the API header fields response', async () => {
    getJobs.mockResolvedValue(MOCK_API_JOBS_RESPONSE);
    getHeaderFields.mockResolvedValue(MOCK_API_HEADER_FIELDS_RESPONSE);

    const { container } = renderDashboard();

    await waitFor(() => {
      const headers = container.querySelector('.ant-table-thead')?.textContent ?? '';
      expect(headers).toContain('Location');
      expect(headers).toContain('Experience');
      expect(headers).toContain('Client Rate');
      expect(headers).toContain('Status');
      expect(headers).toContain('Pipeline');
    });
  });

  it('falls back to SRIDHAR_MOCK_JOBS when the jobs API fails', async () => {
    getJobs.mockRejectedValue(new Error('API Error'));
    getHeaderFields.mockResolvedValue(MOCK_API_HEADER_FIELDS_RESPONSE);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: SRIDHAR_MOCK_JOBS[0].title })).toBeInTheDocument();
    });
  });

  it('uses fallback header fields when the header API fails', async () => {
    getJobs.mockRejectedValue(new Error('API Error'));
    getHeaderFields.mockRejectedValue(new Error('API Error'));

    const { container } = renderDashboard();

    await waitFor(() => {
      const headers = container.querySelector('.ant-table-thead')?.textContent ?? '';
      expect(headers).toContain('Jobs');
      expect(headers).toContain('Location');
    });
  });

  it('normalises API job response with non-standard field names', async () => {
    const nonStandardResponse = {
      records: [
        {
          _id: 'api-ns-1',
          jobTitle: 'DevOps Lead',
          jobLocation: 'Denver',
          jobRemoteStatus: ['on-site'],
          experience: { from: 5, to: 8, unit: 'yrs' },
          employmentType: 'full_time',
          jobPayDetails: {
            clientBudgetStart: 110,
            clientBudgetEnd: 130,
            clientBudgetCurrencySymbol: '$',
            clientBudgetUnit: 'hour',
          },
          jobStatus: 'active',
          createdAt: 'Jun 01, 2026',
          createdAgo: '1 day ago',
          hiringProgress: { pipeline: 7 },
          priority: 'high',
        },
      ],
      total: 1,
    };

    getJobs.mockResolvedValue(nonStandardResponse);
    getHeaderFields.mockResolvedValue(MOCK_API_HEADER_FIELDS_RESPONSE);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'DevOps Lead' })).toBeInTheDocument();
    });

    expect(screen.getByText('Denver')).toBeInTheDocument();
    expect(screen.getByText('5 - 8 yrs')).toBeInTheDocument();
    expect(screen.getByText('$110 - 130/hr')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('MOCK_API_JOBS_RESPONSE satisfies all required job field checks', () => {
    const errors = validateApiJobsResponse(MOCK_API_JOBS_RESPONSE.joblist);
    if (errors.length > 0) {
      throw new Error(
        `MOCK_API_JOBS_RESPONSE has missing required fields — update the mock or fix the API contract:\n${errors.join('\n')}`,
      );
    }
  });

  it('MOCK_API_HEADER_FIELDS_RESPONSE satisfies all required column checks', () => {
    const errors = validateApiHeaderFields(MOCK_API_HEADER_FIELDS_RESPONSE);
    if (errors.length > 0) {
      throw new Error(
        `MOCK_API_HEADER_FIELDS_RESPONSE is incomplete:\n${errors.join('\n')}`,
      );
    }
  });

  it('reports every missing field when API job response is incomplete', () => {
    const incompleteJobs = [
      { _id: 'api-bad-1', someField: 'value' },
      { _id: 'api-bad-2', jobTitle: 'Partial Job', experience: '3 years' },
    ];

    const errors = validateApiJobsResponse(incompleteJobs);

    // api-bad-1 is missing everything except _id
    expect(errors).toContain('api-bad-1: missing required field — title / jobTitle (job heading)');
    expect(errors).toContain('api-bad-1: missing required field — location / jobLocation');
    expect(errors).toContain('api-bad-1: missing required field — status / jobStatus / recruitmentStatus');
    expect(errors).toContain('api-bad-1: missing required field — createdAt (created date column)');
    expect(errors).toContain('api-bad-1: missing required field — experience');
    expect(errors).toContain('api-bad-1: missing required field — clientRate');

    // api-bad-2 has jobTitle + experience but missing location, status, createdAt, clientRate
    expect(errors.some((e) => e.startsWith('api-bad-2: missing required field — location'))).toBe(true);
    expect(errors.some((e) => e.startsWith('api-bad-2: missing required field — status'))).toBe(true);
    expect(errors.some((e) => e.startsWith('api-bad-2: missing required field — createdAt'))).toBe(true);
    expect(errors.some((e) => e.startsWith('api-bad-2: missing required field — clientRate'))).toBe(true);
    // api-bad-2 already has experience — should NOT appear in errors for experience
    expect(errors.some((e) => e.startsWith('api-bad-2: missing required field — experience'))).toBe(false);
  });

  it('reports missing required column keys in incomplete header fields response', () => {
    const incompleteHeaderFields = [
      { label: 'Priority', value: 'priority', isVisible: true },
    ];

    const errors = validateApiHeaderFields(incompleteHeaderFields);

    expect(errors).toContain('API header fields: missing required column "jobs"');
    expect(errors).toContain('API header fields: missing required column "location"');
    expect(errors).toContain('API header fields: missing required column "status"');
    expect(errors).toContain('API header fields: missing required column "createdAt"');
    expect(errors).toContain('API header fields: missing required column "experience"');
  });
});
