import { MOCK_JOBS, SRIDHAR_MOCK_JOBS, SRIDHAR_JOB_LIST_SUMMARY } from '../data/jobs';

const LIST_VIEW_SOURCES = {
  ListView: 'src/components/ListView.jsx:63',
  SridharListView: 'src/components/sridharListView.jsx:79',
};

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

const SRIDHAR_LIST_VIEW_HEADERS = [
  { text: 'Jobs', source: 'src/components/sridharListView.jsx:186' },
  { text: 'Location', source: 'src/components/sridharListView.jsx:204' },
  { text: 'Experience', source: 'src/components/sridharListView.jsx:217' },
  { text: 'Client Rate (hr)', source: 'src/components/sridharListView.jsx:230' },
  { text: 'Target Sub', source: 'src/components/sridharListView.jsx:239' },
  { text: 'Pipeline', source: 'src/components/sridharListView.jsx:250' },
  { text: 'Status', source: 'src/components/sridharListView.jsx:267' },
  { text: 'Created date', source: 'src/components/sridharListView.jsx:276' },
];

const SRIDHAR_COLUMN_MENU_LABELS = [
  { text: 'Select All', source: 'src/components/sridharListView.jsx:317' },
  { text: 'Created Date', source: 'src/components/sridharListView.jsx:23' },
  { text: 'Jobs', source: 'src/components/sridharListView.jsx:24' },
  { text: 'Location', source: 'src/components/sridharListView.jsx:25' },
  { text: 'Experience', source: 'src/components/sridharListView.jsx:26' },
  { text: 'Client Rate', source: 'src/components/sridharListView.jsx:27' },
  { text: 'Status', source: 'src/components/sridharListView.jsx:28' },
  { text: 'Target Sub', source: 'src/components/sridharListView.jsx:29' },
  { text: 'Pipeline', source: 'src/components/sridharListView.jsx:30' },
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

  SRIDHAR_LIST_VIEW_HEADERS.forEach((header) => {
    if (!getHeaderText(container).includes(header.text)) {
      failContract({
        ...contract,
        source: header.source,
        message: `Missing table header: "${header.text}"`,
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
