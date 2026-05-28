import { MOCK_JOBS } from '../data/jobs';

const LIST_VIEW_SOURCES = {
  ListView: 'src/components/ListView.jsx:63',
  SridharListView: 'src/components/sridharListView.jsx:83',
};

const firstJob = MOCK_JOBS[0];

const SRIDHAR_LIST_VIEW_LABELS = [
  { text: 'My Jobs', source: 'src/components/sridharListView.jsx:341' },
  { text: 'All Jobs', source: 'src/components/sridharListView.jsx:342' },
  { text: 'View Summary', source: 'src/components/sridharListView.jsx:381' },
  { text: 'Actions', source: 'src/components/sridharListView.jsx:412' },
  { text: 'Selected (2)', source: 'src/components/sridharListView.jsx:417' },
  { text: firstJob.title, source: 'src/components/sridharListView.jsx:192' },
  { text: firstJob.client, source: 'src/components/sridharListView.jsx:194' },
  { text: firstJob.location, source: 'src/components/sridharListView.jsx:207' },
  { text: firstJob.experience, source: 'src/components/sridharListView.jsx:220' },
  { text: firstJob.status, source: 'src/components/sridharListView.jsx:269' },
  { text: firstJob.createdAt, source: 'src/components/sridharListView.jsx:279' },
];

const SRIDHAR_LIST_VIEW_HEADERS = [
  { text: 'Jobs', source: 'src/components/sridharListView.jsx:182' },
  { text: 'Location', source: 'src/components/sridharListView.jsx:200' },
  { text: 'Experience', source: 'src/components/sridharListView.jsx:213' },
  { text: 'Client Rate (hr)', source: 'src/components/sridharListView.jsx:226' },
  { text: 'Target Sub', source: 'src/components/sridharListView.jsx:235' },
  { text: 'Pipeline', source: 'src/components/sridharListView.jsx:246' },
  { text: 'Status', source: 'src/components/sridharListView.jsx:263' },
  { text: 'Created date', source: 'src/components/sridharListView.jsx:272' },
];

const SRIDHAR_COLUMN_MENU_LABELS = [
  { text: 'Select All', source: 'src/components/sridharListView.jsx:313' },
  { text: 'Created Date', source: 'src/components/sridharListView.jsx:27' },
  { text: 'Jobs', source: 'src/components/sridharListView.jsx:28' },
  { text: 'Location', source: 'src/components/sridharListView.jsx:29' },
  { text: 'Experience', source: 'src/components/sridharListView.jsx:30' },
  { text: 'Client Rate', source: 'src/components/sridharListView.jsx:31' },
  { text: 'Status', source: 'src/components/sridharListView.jsx:32' },
  { text: 'Target Sub', source: 'src/components/sridharListView.jsx:33' },
  { text: 'Pipeline', source: 'src/components/sridharListView.jsx:34' },
];

const getHeaderText = (container) => container.querySelector('.ant-table-thead')?.textContent || '';

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
  SRIDHAR_LIST_VIEW_LABELS.forEach((label) => assertText(container, label, contract));
  assertSelector(container, '[placeholder="Min 3 Chars to search"]', contract);
  assertSelector(container, '[title="6"]', contract);
  assertSelector(container, '[title="2456"]', contract);
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
