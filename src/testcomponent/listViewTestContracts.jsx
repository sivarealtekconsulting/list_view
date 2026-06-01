import { MOCK_JOBS, SRIDHAR_MOCK_JOBS, SRIDHAR_JOB_LIST_SUMMARY } from '../data/jobs';

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
