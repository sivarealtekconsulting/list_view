import { MOCK_JOBS, SRIDHAR_MOCK_JOBS, SRIDHAR_JOB_LIST_SUMMARY } from '../data/jobs';

// ── API response helpers ──────────────────────────────────────────────────────

export function extractJobsFromApiResponse(response) {
  return (
    (Array.isArray(response?.joblist) && response.joblist) ||
    (Array.isArray(response?.jobs) && response.jobs) ||
    (Array.isArray(response?.records) && response.records) ||
    (Array.isArray(response?.data?.joblist) && response.data.joblist) ||
    (Array.isArray(response?.data?.jobs) && response.data.jobs) ||
    (Array.isArray(response?.data?.records) && response.data.records) ||
    (Array.isArray(response) && response) ||
    []
  );
}

export function extractHeaderFieldsFromApiResponse(response) {
  return (
    (Array.isArray(response) && response) ||
    (Array.isArray(response?.fields) && response.fields) ||
    (Array.isArray(response?.visibleFields) && response.visibleFields) ||
    (Array.isArray(response?.headers) && response.headers) ||
    (Array.isArray(response?.columns) && response.columns) ||
    (Array.isArray(response?.items) && response.items) ||
    (Array.isArray(response?.rows) && response.rows) ||
    (Array.isArray(response?.data?.fields) && response.data.fields) ||
    (Array.isArray(response?.data?.visibleFields) && response.data.visibleFields) ||
    (Array.isArray(response?.data?.headers) && response.data.headers) ||
    (Array.isArray(response?.data?.columns) && response.data.columns) ||
    []
  );
}

// ── API field definitions used by the ListView ────────────────────────────────
// These are the fields the component actually reads and renders.
// A job missing any of these will silently show "-" in the table.
export const REQUIRED_API_JOB_FIELDS = [
  { keys: ['id', '_id'],                                        label: 'id / _id                  (job detail route)' },
  { keys: ['title', 'jobTitle'],                                label: 'title / jobTitle           (Jobs column heading)' },
  { keys: ['location', 'jobLocation'],                          label: 'location / jobLocation     (Location column)' },
  { keys: ['status', 'jobStatus', 'recruitmentStatus'],         label: 'status / jobStatus         (Status column)' },
  { keys: ['createdAt'],                                        label: 'createdAt                  (Created date column)' },
  { keys: ['experience'],                                       label: 'experience                 (Experience column)' },
  { keys: ['clientRate', 'jobPayDetails'],                      label: 'clientRate / jobPayDetails (Client Rate column)' },
  { keys: ['pipeline', 'hiringProgress'],                       label: 'pipeline / hiringProgress  (Pipeline column)' },
];

export const REQUIRED_LIVE_API_JOB_FIELDS = [
  { keys: ['id', '_id'],                                        label: 'id / _id                  (job detail route)' },
  { keys: ['jobTitle'],                                         label: 'jobTitle                  (Jobs column from real API)' },
  { keys: ['jobLocation'],                                      label: 'jobLocation               (Location column from real API)' },
  { keys: ['jobStatus', 'recruitmentStatus'],                   label: 'jobStatus / recruitmentStatus (Status column from real API)' },
  { keys: ['createdAt'],                                        label: 'createdAt                 (Created date column from real API)' },
  { keys: ['experience'],                                       label: 'experience                (Experience column from real API)' },
  { keys: ['clientRate', 'jobPayDetails'],                      label: 'clientRate / jobPayDetails (Client Rate column from real API)' },
  { keys: ['pipeline', 'hiringProgress'],                       label: 'pipeline / hiringProgress  (Pipeline column from real API)' },
];

export const REQUIRED_API_HEADER_FIELD_VALUES = [
  'jobs', 'location', 'status', 'createdAt', 'experience', 'clientRate', 'pipeline',
];

// ── Sampling strategies ───────────────────────────────────────────────────────

function pickRange(jobs, size) {
  // Random contiguous range — tests a realistic "page" of API data
  const maxOffset = Math.max(0, jobs.length - size);
  const offset = Math.floor(Math.random() * (maxOffset + 1));
  return { sample: jobs.slice(offset, offset + size), note: `range [${offset}–${offset + size - 1}]` };
}

function pickFirstMiddleLast(jobs, size) {
  const groupSize = Math.max(1, Math.floor(size / 3));
  const first = jobs.slice(0, groupSize);
  const middleStart = Math.max(0, Math.floor((jobs.length - groupSize) / 2));
  const middle = jobs.slice(middleStart, middleStart + groupSize);
  const last = jobs.slice(Math.max(0, jobs.length - groupSize));
  const sample = [...first, ...middle, ...last].filter(Boolean);
  const seen = new Set();
  const uniqueSample = sample.filter((job) => {
    if (seen.has(job)) return false;
    seen.add(job);
    return true;
  });

  return {
    sample: uniqueSample,
    note: `first ${first.length} + middle ${middle.length} + last ${last.length}`,
  };
}

function pickSpread(jobs, size) {
  // Evenly distributed: first + last + evenly spaced middle
  // Catches boundary records that often have different shapes
  const boundary = Math.min(5, Math.floor(size / 4));
  const head = jobs.slice(0, boundary);
  const tail = jobs.slice(-boundary);
  const middleSize = size - head.length - tail.length;
  const step = Math.max(1, Math.floor((jobs.length - boundary * 2) / middleSize));
  const middle = Array.from({ length: middleSize }, (_, i) =>
    jobs[Math.min(boundary + i * step, jobs.length - boundary - 1)],
  );
  const sample = [...head, ...middle, ...tail].filter(Boolean);
  return { sample, note: `spread (first ${boundary} + middle + last ${boundary})` };
}

function pickRandom(jobs, size) {
  const shuffled = [...jobs].sort(() => Math.random() - 0.5);
  return { sample: shuffled.slice(0, size), note: `random scatter` };
}

function hasFieldValue(record, key) {
  const value = record?.[key];

  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;

  return true;
}

// ── Coverage report ───────────────────────────────────────────────────────────

/**
 * Scans jobs for missing required fields and returns a formatted coverage report.
 *
 * options:
 *   sampleSize     — number of records to test (default: all)
 *   sampleStrategy — 'range' | 'firstMiddleLast' | 'spread' | 'random' | 'full' (default: 'full')
 *
 * Recommended strategies:
 *   'full'   — always correct, fast even for 2000+ records (JS objects validate in ms)
 *   'range'  — random contiguous page; good for catching systematic gaps in a batch
 *   'firstMiddleLast' — first 10 + middle 10 + last 10 when sampleSize is 30
 *   'spread' — tests boundaries + middle; catches "first/last record has different shape"
 *   'random' — scattered sample; statistically valid for >5% absence rates at n≥100
 *
 * Returns { allPassed, scannedCount, failingFields, report }
 * Throw `new Error(report)` in your test to get a readable failure message.
 */
export function buildApiCoverageReport(jobs, requiredFields = REQUIRED_API_JOB_FIELDS, options = {}) {
  const { sampleSize, sampleStrategy = 'full' } = options;

  let scanned = jobs;
  let sampleNote = `full scan — all ${jobs.length} records`;

  if (sampleSize && sampleSize < jobs.length && sampleStrategy !== 'full') {
    const strategies = {
      range: pickRange,
      firstMiddleLast: pickFirstMiddleLast,
      spread: pickSpread,
      random: pickRandom,
    };
    const picker = strategies[sampleStrategy] ?? pickRandom;
    const result = picker(jobs, sampleSize);
    scanned = result.sample;
    sampleNote = `${result.note} — ${scanned.length} of ${jobs.length} records`;
  }

  const rows = requiredFields.map(({ keys, label }) => {
    const missingJobs = scanned.filter(
      (job) => !keys.some((key) => hasFieldValue(job, key)),
    );
    return {
      label,
      missing: missingJobs.length,
      total: scanned.length,
      pct: ((missingJobs.length / scanned.length) * 100).toFixed(1),
      sampleIds: missingJobs
        .slice(0, 5)
        .map((j) => String(j._id ?? j.id ?? j.key ?? '?')),
      overflow: Math.max(0, missingJobs.length - 5),
    };
  });

  const failingFields = rows.filter((r) => r.missing > 0);
  const col = 48;

  const reportLines = [
    '',
    `  API Field Coverage Report`,
    `  ${'─'.repeat(72)}`,
    `  Scanned : ${sampleNote}`,
    `  Result  : ${failingFields.length === 0 ? '✓ All required fields present' : `✗ ${failingFields.length} field(s) have gaps`}`,
    `  ${'─'.repeat(72)}`,
    `  ${'FIELD'.padEnd(col)} STATUS   MISSING`,
    `  ${'─'.repeat(72)}`,
    ...rows.map((r) => {
      const status = r.missing === 0 ? '✓ OK   ' : '✗ FAIL ';
      const count = r.missing === 0 ? '' : `${r.missing} / ${r.total} (${r.pct}%)`;
      const ids = r.missing > 0
        ? `\n  ${''.padEnd(col + 10)}IDs: ${r.sampleIds.join(', ')}${r.overflow > 0 ? ` + ${r.overflow} more` : ''}`
        : '';
      return `  ${r.label.padEnd(col)} ${status} ${count}${ids}`;
    }),
    `  ${'─'.repeat(72)}`,
    '',
  ];

  return {
    allPassed: failingFields.length === 0,
    scannedCount: scanned.length,
    failingFields,
    report: reportLines.join('\n'),
  };
}

/**
 * Validates API header fields config.
 * Returns { allPassed, missing, report }
 */
export function buildHeaderFieldsReport(fields, requiredValues = REQUIRED_API_HEADER_FIELD_VALUES) {
  if (!Array.isArray(fields) || fields.length === 0) {
    return { allPassed: false, missing: requiredValues, report: '  API header fields: array is empty or missing' };
  }
  const canonicalHeaderValue = (value, label) => {
    const rawValue = String(value ?? '').trim();
    const rawLabel = String(label ?? '').trim();
    const normalized = (rawValue || rawLabel).toLowerCase();
    const normalizedLabel = rawLabel.toLowerCase();
    const aliasMap = {
      jobtitle: 'jobs',
      title: 'jobs',
      jobs: 'jobs',
      job: 'jobs',
      joblocation: 'location',
      location: 'location',
      jobstatus: 'status',
      recruitmentstatus: 'status',
      status: 'status',
      createdat: 'createdAt',
      'created date': 'createdAt',
      'created at': 'createdAt',
      experience: 'experience',
      clientrate: 'clientRate',
      jobpaydetails: 'clientRate',
      'client rate': 'clientRate',
      pipeline: 'pipeline',
      hiringprogress: 'pipeline',
    };

    return aliasMap[normalized] ?? aliasMap[normalizedLabel] ?? rawValue;
  };
  const normalise = (field) => canonicalHeaderValue(
    field.value ?? field.field ?? field.key ?? field.fieldKey ?? field.fieldName ?? field.name,
    field.label ?? field.fieldLabel ?? field.headerName ?? field.displayName,
  );
  const present = new Set(fields.map(normalise));
  const missing = requiredValues.filter((k) => !present.has(k));

  const report = missing.length === 0
    ? `  Header fields OK — all ${requiredValues.length} required columns present`
    : [
        '',
        `  API Header Fields Report`,
        `  ${'─'.repeat(50)}`,
        `  ✗ Missing required column keys (${missing.length}):`,
        ...missing.map((k) => `      "${k}"`),
        `  ${'─'.repeat(50)}`,
        '',
      ].join('\n');

  return { allPassed: missing.length === 0, missing, report };
}

const LIST_VIEW_SOURCES = {
  ListView: 'src/components/ListView.jsx:63',
  SridharListView: 'src/components/sridharListView.jsx:79',
};

// Matches FALLBACK_JOB_HEADER_FIELDS in src/pages/sridharDashboard.jsx
export const SRIDHAR_DROPDOWN_FIELDS = [
  { label: 'Created date', value: 'createdAt' },
  { label: 'Jobs', value: 'jobs' },
  { label: 'Location', value: 'location' },
  { label: 'Experience', value: 'experience' },
  { label: 'Client Rate', value: 'clientRate' },
  { label: 'Status', value: 'status' },
  { label: 'Priority', value: 'priority' },
  { label: 'Pipeline', value: 'pipeline' },
];

function getListViewLabels(firstJob) {
  return [
    { text: 'My Jobs', source: 'src/components/sridharListView.jsx:345' },
    { text: 'All Jobs', source: 'src/components/sridharListView.jsx:346' },
    { text: 'View Summary', source: 'src/components/sridharListView.jsx:385' },
    { text: 'Actions', source: 'src/components/sridharListView.jsx:416' },
    { text: 'Selected (2)', source: 'src/components/sridharListView.jsx:421' },
    { text: firstJob.title, source: 'src/components/sridharListView.jsx:196' },
    { text: firstJob.client, source: 'src/components/sridharListView.jsx:198' },
    { text: firstJob.location, source: 'src/components/sridharListView.jsx:211' },
    { text: firstJob.experience, source: 'src/components/sridharListView.jsx:224' },
    { text: firstJob.status, source: 'src/components/sridharListView.jsx:273' },
    { text: firstJob.createdAt, source: 'src/components/sridharListView.jsx:283' },
  ];
}

// Column menu labels driven by SRIDHAR_DROPDOWN_FIELDS
const SRIDHAR_COLUMN_MENU_LABELS = [
  { text: 'Select All', source: 'src/components/sridharListView.jsx:317' },
  ...SRIDHAR_DROPDOWN_FIELDS.map((f) => ({
    text: f.label,
    source: 'src/pages/sridharDashboard.jsx (FALLBACK_JOB_HEADER_FIELDS)',
  })),
];

const getHeaderText = (container) => container.querySelector('.ant-table-thead')?.textContent || '';
const getExpectedTabCounts = (componentName) => (
  componentName === 'SridharListView'
    ? SRIDHAR_JOB_LIST_SUMMARY
    : { myJobsCount: 6, allJobsCount: 2456 }
);

function failContract({ componentName, source, message }) {
  throw new Error(
    [
      `List view contract failed: ${componentName}`,
      `Source: ${source}`,
      message,
    ].join('\n'),
  );
}

function assertText(container, { text, source }, contract) {
  if (container.textContent.includes(text)) return;

  failContract({
    ...contract,
    source: source ?? contract.source,
    message: `Missing label/text: "${text}"`,
  });
}

function assertSelector(container, selector, contract) {
  if (container.querySelector(selector)) return;

  failContract({
    ...contract,
    message: `Missing selector: ${selector}`,
  });
}

function assertVisibleTableContract(container, contract) {
  const { myJobsCount, allJobsCount } = getExpectedTabCounts(contract.componentName);
  const firstJob = contract.componentName === 'SridharListView' ? SRIDHAR_MOCK_JOBS[0] : MOCK_JOBS[0];
  const labels = getListViewLabels(firstJob);

  labels.forEach((label) => assertText(container, label, contract));
  assertSelector(container, '[placeholder="Min 3 Chars to search"]', contract);
  assertSelector(container, `[title="${myJobsCount}"]`, contract);
  assertSelector(container, `[title="${allJobsCount}"]`, contract);
  assertSelector(container, '.antd', contract);
  assertSelector(container, '.job-list-table', contract);
  assertSelector(container, '.job-search-input', contract);
  assertSelector(container, '.job-actions-button', contract);

  SRIDHAR_DROPDOWN_FIELDS.forEach((field) => {
    if (!getHeaderText(container).includes(field.label)) {
      failContract({
        ...contract,
        source: 'src/pages/sridharDashboard.jsx (FALLBACK_JOB_HEADER_FIELDS)',
        message: `Missing table header: "${field.label}"`,
      });
    }
  });
}

export function assertListViewContract(componentName, container) {
  const source = LIST_VIEW_SOURCES[componentName];

  if (!source) {
    throw new Error(`No list view test contract exists for ${componentName}`);
  }

  assertVisibleTableContract(container, { componentName, source });
}

export function listViewContractCase(componentName) {
  return [componentName, LIST_VIEW_SOURCES[componentName]];
}

export function assertSridharColumnMenuContract(container) {
  SRIDHAR_COLUMN_MENU_LABELS.forEach((label) => (
    assertText(container, label, {
      componentName: 'SridharListView',
      source: LIST_VIEW_SOURCES.SridharListView,
    })
  ));
}
