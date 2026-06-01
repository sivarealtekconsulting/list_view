const countSelector = (container, selector) => container.querySelectorAll(selector).length;

function failContract({ componentName, source, message }) {
  throw new Error(
    [
      `Component contract failed: ${componentName}`,
      `Source: ${source}`,
      message,
    ].join('\n'),
  );
}

function assertText(container, text, contract) {
  if (container.textContent.includes(text)) return;

  failContract({
    ...contract,
    message: `Missing text: "${text}"`,
  });
}

function assertAllText(container, labels, contract) {
  labels.forEach((label) => assertText(container, label, contract));
}

function assertSelectorCount(container, selector, expected, contract) {
  const actual = countSelector(container, selector);
  const pass = typeof expected === 'number'
    ? actual === expected
    : expected(actual);

  if (pass) return;

  failContract({
    ...contract,
    message: `Selector "${selector}" rendered ${actual} time(s), expected ${
      typeof expected === 'number' ? expected : expected.description
    }.`,
  });
}

const atLeast = (count) => Object.assign(
  (actual) => actual >= count,
  { description: `at least ${count}` },
);

const greaterThan = (count) => Object.assign(
  (actual) => actual > count,
  { description: `greater than ${count}` },
);

export const CARD_CONTRACTS = {
  StatsCards: {
    source: 'src/components/cards/StatsCards.jsx:14',
    assert(container, contract) {
      assertAllText(container, ['Total Jobs', 'Active Jobs', 'My Jobs'], contract);
      assertAllText(container, ['1,697', '1,685', '600'], contract);
    },
  },
  CalendarCard: {
    source: 'src/components/cards/CalendarCard.jsx:53',
    assert(container, contract) {
      assertText(container, 'April 2026', contract);
      assertAllText(container, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], contract);
      assertSelectorCount(container, '.calendar-cell', atLeast(30), contract);
      assertSelectorCount(container, '.calendar-legend-item', 4, contract);
      assertSelectorCount(container, '.calendar-dot', greaterThan(0), contract);
    },
  },
  ClientSubmissionCard: {
    source: 'src/components/cards/ClientSubmissionCard.jsx:13',
    assert(container, contract) {
      assertAllText(container, ['Total Client Submission:', '1,324', 'Submitted', 'Rejected', '534', '87'], contract);
      assertSelectorCount(container, '.submission-bar-track', 2, contract);
    },
  },
  OnboardingCard: {
    source: 'src/components/cards/OnboardingCard.jsx:14',
    assert(container, contract) {
      assertAllText(container, [
        'Onboarding',
        'In Progress',
        'Hired',
        'Project Completed',
        'Archive',
        'Under review',
        'Onboarded',
        'Project cycle closed',
        'No longer active',
      ], contract);
      assertSelectorCount(container, '.onboarding-item', 4, contract);
    },
  },
  StickyNotesCard: {
    source: 'src/components/cards/StickyNotesCard.jsx:39',
    assert(container, contract) {
      assertAllText(container, ['Sticky Notes', '04 April, 2026'], contract);
      assertSelectorCount(container, '.sticky-note .ant-tag', 4, contract);
      assertSelectorCount(container, '.sticky-note', 4, contract);
    },
  },
  ClientDetailsCard: {
    source: 'src/components/cards/ClientDetailsCard.jsx:7',
    assert(container, contract) {
      assertAllText(container, [
        'Client Details',
        'Basic client and contact information for this job',
        '*Name',
        '* Client Req ID',
        'Contact Person',
        'End Client',
        'Client Location',
        'Account Manager',
      ], contract);
      assertSelectorCount(container, '.cd-form-item', atLeast(6), contract);
    },
  },
};

export function assertCardContract(componentName, container) {
  const contract = CARD_CONTRACTS[componentName];

  if (!contract) {
    throw new Error(`No card test contract exists for ${componentName}`);
  }

  contract.assert(container, { componentName, source: contract.source });
}
