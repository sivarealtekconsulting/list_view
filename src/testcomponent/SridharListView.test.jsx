/**
 * SridharListView.test.jsx
 * ------------------------
 * Deep tests for src/components/sridharListView.jsx.
 * Covers static rendering, toolbar, search, column menu, and API response validation.
 *
 * ── HOW API FIELD VALIDATION WORKS ───────────────────────────────────────────
 *
 * buildApiCoverageReport(jobs, fields, options) scans every record and produces
 * a table showing which required fields are missing and in how many records.
 * Three sampling strategies for large datasets (2000+ records):
 *
 *   'full'   — scan every record (default, fast even at 2000+)
 *   'range'  — random contiguous slice, e.g. records 400-499 (your suggestion)
 *              Tests a realistic "page" of API data with the same server logic.
 *   'firstMiddleLast' — first 10 + middle 10 + last 10 when sampleSize is 30
 *              Catches first-page, middle-page, and last-page API gaps.
 *   'spread' — first 5 + evenly-spaced middle + last 5
 *              Catches edge cases where first/last records have different shapes.
 *   'random' — scattered random picks
 *              Statistically valid for gaps affecting >5% of records at n≥100.
 *
 * Failure output example:
 *
 *   API Field Coverage Report
 *   ────────────────────────────────────────────────────────────────────────
 *   Scanned : range [450–499] — 50 of 2000 records
 *   Result  : ✗ 2 field(s) have gaps
 *   ────────────────────────────────────────────────────────────────────────
 *   FIELD                                            STATUS   MISSING
 *   ────────────────────────────────────────────────────────────────────────
 *   id / _id                  (job detail route)     ✓ OK
 *   title / jobTitle           (Jobs column heading) ✓ OK
 *   clientRate / jobPayDetails (Client Rate column)  ✗ FAIL  12 / 50 (24.0%)
 *                                                    IDs: api-451, api-460, api-471 + 9 more
 *   status / jobStatus         (Status column)       ✗ FAIL  3 / 50 (6.0%)
 *                                                    IDs: api-452, api-465, api-488
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
  REQUIRED_API_JOB_FIELDS,
  buildApiCoverageReport,
  buildHeaderFieldsReport,
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
//
// These tests check that data coming from the real API has all the fields the
// ListView component actually renders. On failure the report tells you exactly
// which fields are missing and in how many records.
//
// For production datasets (2000+ records) use a sampling strategy so the test
// stays fast while still giving high confidence. See file header for guidance.

describe('SridharListView API response validation', () => {

  // ── Self-check: mock data must satisfy the contract ────────────────────────

  it('SRIDHAR_MOCK_JOBS — full scan passes all required field checks', () => {
    const { allPassed, report } = buildApiCoverageReport(SRIDHAR_MOCK_JOBS);
    if (!allPassed) throw new Error(report);
  });

  it('SRIDHAR_DROPDOWN_FIELDS — contains all required column keys', () => {
    const { allPassed, report } = buildHeaderFieldsReport(SRIDHAR_DROPDOWN_FIELDS);
    if (!allPassed) throw new Error(report);
  });

  // ── Renders with real API field names ──────────────────────────────────────

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

    expect(screen.getByRole('link', { name: 'API Engineer' })).toHaveAttribute(
      'href',
      '/sri-detailview/api-001',
    );
    expect(screen.getByText('Austin')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
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

  // ── Missing-field detection with coverage report ───────────────────────────
  //
  // Pattern for production data (2000+ records):
  //
  //   const { allPassed, report } = buildApiCoverageReport(
  //     realApiJobs,
  //     REQUIRED_API_JOB_FIELDS,
  //     { sampleSize: 100, sampleStrategy: 'range' }   ← random page of 100
  //   );
  //   if (!allPassed) throw new Error(report);
  //
  // The report groups errors by field, not by record:
  //   ✗ FAIL  clientRate / jobPayDetails  12 / 100 (12.0%)  → IDs: api-451, api-460...
  // so you see the scale of the problem, not a wall of individual errors.

  it('coverage report detects missing fields and names them clearly', () => {
    const incompleteJobs = [
      { key: 'bad-1', someUnknownField: 'value' },
      { key: 'bad-2', title: 'Partial Job', experience: '3 years' },
      { _id: 'bad-3', jobTitle: 'Almost Complete', jobLocation: 'NYC', jobStatus: 'active', createdAt: '2026-01-01', experience: '2 yrs', clientRate: 80, pipeline: 4 },
    ];

    const { allPassed, failingFields, report } = buildApiCoverageReport(incompleteJobs);

    // Should NOT pass — bad-1 and bad-2 are missing required fields
    expect(allPassed).toBe(false);

    // bad-3 has everything, so only 2 records should be flagged per field
    const idField = failingFields.find((f) => f.label.includes('id /'));
    expect(idField).toBeDefined();
    expect(idField.missing).toBe(2); // bad-1 and bad-2 have no id/_id

    // bad-2 has experience, bad-3 has experience — only bad-1 is missing it
    const expField = failingFields.find((f) => f.label.includes('experience'));
    expect(expField).toBeDefined();
    expect(expField.missing).toBe(1);
    expect(expField.sampleIds).toContain('bad-1');

    // Report text should contain the field labels, not just IDs
    expect(report).toContain('id / _id');
    expect(report).toContain('title / jobTitle');
    expect(report).toContain('✗ FAIL');
    expect(report).toContain('bad-1');
  });

  it('coverage report — range strategy simulates a random page of API results', () => {
    // Simulates what you'd do with 2000+ records:
    // pick a random page of 3 records and check those
    const largeDataset = Array.from({ length: 20 }, (_, i) => ({
      _id: `job-${i + 1}`,
      jobTitle: `Job ${i + 1}`,
      jobLocation: 'City',
      jobStatus: 'active',
      createdAt: '2026-01-01',
      experience: '3 years',
      clientRate: 100,
      pipeline: i,
      // every 5th record is missing clientRate to simulate a real data gap
      ...(i % 5 === 0 ? { clientRate: undefined } : {}),
    }));

    // Range sample of 5 records — the report tells you which fields are missing
    // without printing 20 individual error lines
    const { report, scannedCount } = buildApiCoverageReport(
      largeDataset,
      REQUIRED_API_JOB_FIELDS,
      { sampleSize: 5, sampleStrategy: 'range' },
    );

    expect(scannedCount).toBe(5);
    // Report must show the field labels (not just "undefined" or indices)
    expect(report).toContain('clientRate / jobPayDetails');
    expect(report).toContain('Scanned');
    expect(report).toContain('range');
  });

  it('coverage report — spread strategy catches boundary + middle records', () => {
    // First and last records deliberately broken (common in API edge cases)
    const dataset = Array.from({ length: 30 }, (_, i) => ({
      _id: `job-${i + 1}`,
      jobTitle: `Job ${i + 1}`,
      jobLocation: 'City',
      jobStatus: 'active',
      createdAt: '2026-01-01',
      experience: '3 years',
      clientRate: 100,
      pipeline: i,
    }));
    // Break first and last records
    dataset[0] = { _id: 'job-1', broken: true };
    dataset[29] = { _id: 'job-30', broken: true };

    const { allPassed, failingFields, report } = buildApiCoverageReport(
      dataset,
      REQUIRED_API_JOB_FIELDS,
      { sampleSize: 10, sampleStrategy: 'spread' },
    );

    // Spread samples from boundaries — will catch the broken first/last records
    expect(allPassed).toBe(false);
    expect(report).toContain('spread');
    expect(failingFields.length).toBeGreaterThan(0);
  });

  it('coverage report — first/middle/last strategy reports missing counts by field', () => {
    const dataset = Array.from({ length: 40 }, (_, i) => ({
      _id: `job-${i + 1}`,
      jobTitle: `Job ${i + 1}`,
      jobLocation: 'City',
      jobStatus: 'active',
      createdAt: '2026-01-01',
      experience: '3 years',
      clientRate: 100,
      pipeline: i,
    }));

    dataset[0].jobLocation = '';
    dataset[9].jobLocation = '';
    dataset[15].clientRate = undefined;
    dataset[24].clientRate = undefined;
    dataset[39].jobStatus = '';

    const { allPassed, failingFields, report, scannedCount } = buildApiCoverageReport(
      dataset,
      REQUIRED_API_JOB_FIELDS,
      { sampleSize: 30, sampleStrategy: 'firstMiddleLast' },
    );

    expect(scannedCount).toBe(30);
    expect(allPassed).toBe(false);
    expect(failingFields.find((field) => field.label.includes('location')).missing).toBe(2);
    expect(failingFields.find((field) => field.label.includes('clientRate')).missing).toBe(2);
    expect(failingFields.find((field) => field.label.includes('status')).missing).toBe(1);
    expect(report).toContain('first 10 + middle 10 + last 10');
    expect(report).toContain('2 / 30');
    expect(report).toContain('1 / 30');
  });

  it('reports missing header fields with clear column names', () => {
    const incompleteFields = [{ label: 'Priority', value: 'priority', isVisible: true }];

    const { allPassed, missing, report } = buildHeaderFieldsReport(incompleteFields);

    expect(allPassed).toBe(false);
    expect(missing).toContain('jobs');
    expect(missing).toContain('location');
    expect(missing).toContain('status');
    expect(missing).toContain('createdAt');
    expect(missing).toContain('experience');
    expect(report).toContain('"jobs"');
    expect(report).toContain('"location"');
  });

  it('passes cleanly when all required fields are present', () => {
    const completeJobs = Array.from({ length: 10 }, (_, i) => ({
      _id: `job-${i + 1}`,
      jobTitle: `Complete Job ${i + 1}`,
      jobLocation: 'Chicago',
      jobStatus: 'active',
      createdAt: '2026-01-01',
      experience: '5 years',
      clientRate: 95,
      pipeline: i + 1,
    }));

    const { allPassed } = buildApiCoverageReport(completeJobs);
    expect(allPassed).toBe(true);
  });
});
