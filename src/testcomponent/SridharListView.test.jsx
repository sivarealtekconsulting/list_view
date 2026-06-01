/**
 * SridharListView.test.jsx
 * ------------------------
 * Deep tests for src/components/sridharListView.jsx.
 * Covers static rendering, toolbar, search, column menu, and API response validation.
 */

import { ConfigProvider } from 'antd';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SridharListView from '../components/sridharListView';
import { SRIDHAR_MOCK_JOBS, SRIDHAR_JOB_LIST_SUMMARY, sridharJobsValid } from '../data/jobs';
import {
  assertListViewContract,
  assertSridharColumnMenuContract,
  SRIDHAR_DROPDOWN_FIELDS,
} from './listViewTestContracts';

function renderSridharListView(props = {}) {
  return render(
    <ConfigProvider>
      <MemoryRouter>
        <SridharListView
          jobs={SRIDHAR_MOCK_JOBS}
          dropdownFields={SRIDHAR_DROPDOWN_FIELDS}
          summary={SRIDHAR_JOB_LIST_SUMMARY}
          {...props}
        />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

const getSearchInput = () => screen.getByPlaceholderText('Min 3 Chars to search');

// ── API response validation helpers ───────────────────────────────────────────

const REQUIRED_JOB_FIELDS = [
  { keys: ['id', '_id'], label: 'id / _id (for job detail route)' },
  { keys: ['title', 'jobTitle'], label: 'title / jobTitle (job heading)' },
  { keys: ['location', 'jobLocation'], label: 'location / jobLocation' },
  { keys: ['status', 'jobStatus', 'recruitmentStatus'], label: 'status / jobStatus / recruitmentStatus' },
  { keys: ['createdAt'], label: 'createdAt (created date column)' },
  { keys: ['experience'], label: 'experience' },
  { keys: ['clientRate'], label: 'clientRate' },
];

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

// ── Component contract ─────────────────────────────────────────────────────────

describe.skipIf(!sridharJobsValid)('SridharListView component contract', () => {
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

// ── Toolbar and table ──────────────────────────────────────────────────────────

describe.skipIf(!sridharJobsValid)('SridharListView toolbar and table', () => {
  it('renders toolbar controls and selected row count', () => {
    const { container } = renderSridharListView();

    expect(container.querySelector('.job-search-input')).toBeInTheDocument();
    expect(container.querySelector('.job-summary-button')).toBeInTheDocument();
    expect(container.querySelectorAll('.job-toolbar-icon-button')).toHaveLength(2);
    expect(container.querySelector('.job-selected-count')).toHaveTextContent('Selected (2)');
  });

  it('links job titles to the Sridhar detail route', () => {
    renderSridharListView();

    expect(screen.getByRole('link', { name: SRIDHAR_MOCK_JOBS[0].title })).toHaveAttribute(
      'href',
      `/sri-detailview/${SRIDHAR_MOCK_JOBS[0].id}`,
    );
  });

  it('updates selected count when a row checkbox is selected', async () => {
    const { container } = renderSridharListView();

    await userEvent.click(screen.getAllByRole('checkbox')[3]);

    expect(container.querySelector('.job-selected-count')).toHaveTextContent('Selected (3)');
  });

  it('filters only after at least 3 search characters', async () => {
    renderSridharListView();
    const matchingLocation = SRIDHAR_MOCK_JOBS[1].location;
    const hiddenLocation = SRIDHAR_MOCK_JOBS[0].location;

    await userEvent.type(getSearchInput(), 'te');
    expect(screen.getByText(hiddenLocation)).toBeInTheDocument();

    await userEvent.clear(getSearchInput());
    await userEvent.type(getSearchInput(), matchingLocation.toLowerCase());

    expect(screen.getByText(matchingLocation)).toBeInTheDocument();
    expect(screen.queryByText(hiddenLocation)).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 - 1 of 1')).toBeInTheDocument();
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

// ── JSON data props ────────────────────────────────────────────────────────────

describe('SridharListView JSON data props', () => {
  it('renders different job values when a different JSON-shaped list is passed', () => {
    const customJobs = [
      {
        ...SRIDHAR_MOCK_JOBS[0],
        key: 'custom-1',
        id: 9001,
        title: 'Azure Data Engineer',
        client: 'Infosys - 9001',
        location: 'Seattle',
        experience: '9 years',
        employmentType: 'Contract',
        clientRate: 120,
        targetSub: { filled: 2, total: 4 },
        pipeline: 5,
        status: 'Open',
        createdAt: 'Jun 01, 2026',
        createdAgo: '1 day ago',
      },
    ];

    render(
      <ConfigProvider>
        <MemoryRouter>
          <SridharListView
            jobs={customJobs}
            dropdownFields={SRIDHAR_DROPDOWN_FIELDS}
            summary={{ myJobsCount: 1, allJobsCount: 1 }}
            initialSelectedRowKeys={['custom-1']}
          />
        </MemoryRouter>
      </ConfigProvider>,
    );

    expect(screen.getByRole('link', { name: 'Azure Data Engineer' })).toHaveAttribute(
      'href',
      '/sri-detailview/9001',
    );
    expect(screen.getByText('Infosys - 9001')).toBeInTheDocument();
    expect(screen.getByText('Seattle')).toBeInTheDocument();
    expect(screen.getByText('Selected (1)')).toBeInTheDocument();
    expect(document.querySelector('[title="1"]')).toBeInTheDocument();
  });

  it('still renders the table when fields are missing or empty', () => {
    const brokenJobs = [
      {
        ...SRIDHAR_MOCK_JOBS[0],
        key: 'broken-1',
        title: '',
        location: undefined,
        locationType: 'Remote',
        pipeline: 0,
      },
      {
        ...SRIDHAR_MOCK_JOBS[1],
        key: 'broken-2',
        locationType: null,
        pipeline: undefined,
      },
    ];

    const { container } = render(
      <ConfigProvider>
        <MemoryRouter>
          <SridharListView
            jobs={brokenJobs}
            dropdownFields={SRIDHAR_DROPDOWN_FIELDS}
            summary={SRIDHAR_JOB_LIST_SUMMARY}
            initialSelectedRowKeys={[]}
          />
        </MemoryRouter>
      </ConfigProvider>,
    );

    expect(container.querySelector('.job-list-table')).toBeInTheDocument();
  });
});

// ── API response validation ────────────────────────────────────────────────────

describe('SridharListView API response validation', () => {
  it('SRIDHAR_MOCK_JOBS passes all required field checks', () => {
    const errors = validateApiJobsResponse(SRIDHAR_MOCK_JOBS);
    if (errors.length > 0) {
      throw new Error(
        `SRIDHAR_MOCK_JOBS (or the real API) is missing required fields — fix the data:\n${errors.join('\n')}`,
      );
    }
  });

  it('SRIDHAR_DROPDOWN_FIELDS contains all required column keys', () => {
    const errors = validateApiHeaderFields(SRIDHAR_DROPDOWN_FIELDS);
    if (errors.length > 0) {
      throw new Error(`Header field config is incomplete:\n${errors.join('\n')}`);
    }
  });

  it('renders correctly when jobs use API field names (jobTitle / jobLocation / jobStatus)', () => {
    const apiShapedJobs = [
      {
        _id: 'api-001',
        jobTitle: 'API Engineer',
        clientInfo: { clientName: 'TechCorp', clientReferenceId: 'TC-55' },
        jobLocation: 'Austin',
        jobRemoteStatus: 'Remote',
        experience: '4 years',
        employmentType: 'Full-time',
        clientRate: 95,
        jobStatus: 'active',
        createdAt: 'Jun 01, 2026',
        createdAgo: '0 days ago',
        pipeline: 3,
        priority: 'High',
      },
    ];

    render(
      <ConfigProvider>
        <MemoryRouter>
          <SridharListView
            jobs={apiShapedJobs}
            dropdownFields={SRIDHAR_DROPDOWN_FIELDS}
            summary={{ myJobsCount: 1, allJobsCount: 1 }}
            initialSelectedRowKeys={[]}
          />
        </MemoryRouter>
      </ConfigProvider>,
    );

    // jobTitle renders as the link text
    expect(screen.getByRole('link', { name: 'API Engineer' })).toHaveAttribute(
      'href',
      '/sri-detailview/api-001',
    );
    // jobLocation renders in the Location column
    expect(screen.getByText('Austin')).toBeInTheDocument();
    // jobStatus: 'active' normalises to 'Open'
    expect(screen.getByText('Open')).toBeInTheDocument();
    // clientInfo is used for the client label
    expect(screen.getByText('TechCorp - TC-55')).toBeInTheDocument();
  });

  it('renders nested experience / pay / pipeline fields from API shape', () => {
    const apiShapedJobs = [
      {
        _id: 'api-002',
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
    ];

    render(
      <ConfigProvider>
        <MemoryRouter>
          <SridharListView
            jobs={apiShapedJobs}
            dropdownFields={SRIDHAR_DROPDOWN_FIELDS}
            summary={{ myJobsCount: 1, allJobsCount: 1 }}
            initialSelectedRowKeys={[]}
          />
        </MemoryRouter>
      </ConfigProvider>,
    );

    expect(screen.getByText('5 - 8 yrs')).toBeInTheDocument();
    expect(screen.getByText('$110 - 130/hr')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Denver')).toBeInTheDocument();
  });

  it('reports all missing fields when API job response is incomplete', () => {
    const incompleteJobs = [
      { key: 'bad-1', someUnknownField: 'value' },
      { key: 'bad-2', title: 'Partial Job' },
    ];

    const errors = validateApiJobsResponse(incompleteJobs);

    // bad-1 has no id, title, location, status, createdAt, experience, clientRate
    expect(errors).toContain('bad-1: missing required field — id / _id (for job detail route)');
    expect(errors).toContain('bad-1: missing required field — title / jobTitle (job heading)');
    expect(errors).toContain('bad-1: missing required field — location / jobLocation');
    expect(errors).toContain('bad-1: missing required field — status / jobStatus / recruitmentStatus');
    expect(errors).toContain('bad-1: missing required field — createdAt (created date column)');

    // bad-2 has title but still missing location, status, etc.
    expect(errors.some((e) => e.startsWith('bad-2: missing required field — location'))).toBe(true);
    expect(errors.some((e) => e.startsWith('bad-2: missing required field — status'))).toBe(true);
  });

  it('reports missing header fields when API column config is incomplete', () => {
    const incompleteFields = [
      { label: 'Priority', value: 'priority' },
    ];

    const errors = validateApiHeaderFields(incompleteFields);

    expect(errors).toContain('API header fields: missing required column "jobs"');
    expect(errors).toContain('API header fields: missing required column "location"');
    expect(errors).toContain('API header fields: missing required column "status"');
    expect(errors).toContain('API header fields: missing required column "createdAt"');
    expect(errors).toContain('API header fields: missing required column "experience"');
  });

  it('reports empty jobs array as an error', () => {
    const errors = validateApiJobsResponse([]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/empty or missing/);
  });

  it('reports empty header fields array as an error', () => {
    const errors = validateApiHeaderFields([]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/empty or missing/);
  });
});
