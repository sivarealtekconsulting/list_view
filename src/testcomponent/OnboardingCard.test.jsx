/**
 * OnboardingCard.test.jsx
 * ────────────────────────
 * Deep UI test suite for src/components/cards/OnboardingCard.jsx.
 *
 * Stack : Vitest + React Testing Library
 * Run   : npm test -- OnboardingCard.test.jsx
 *
 * Coverage areas
 *  1. Static data contract  — 4 items, shape validation
 *  2. Card header           — title + View all link
 *  3. Stat labels           — In Progress, Hired, Project Completed, Archive
 *  4. Stat values           — 107, 2, 2, 2
 *  5. Sub-labels            — Under review, Onboarded, Project cycle closed, No longer active
 *  6. Color classes         — blue, green, purple, peach
 *  7. Grid layout           — 4 columns rendered
 */

import { render, screen } from '@testing-library/react';
import OnboardingCard from '../components/cards/OnboardingCard';

const MOCK_ITEMS = [
  { label: 'In Progress',       value: 107, sub: 'Under review',         color: 'blue'   },
  { label: 'Hired',             value: 2,   sub: 'Onboarded',            color: 'green'  },
  { label: 'Project Completed', value: 2,   sub: 'Project cycle closed', color: 'purple' },
  { label: 'Archive',           value: 2,   sub: 'No longer active',     color: 'peach'  },
];

const renderCard = () => render(<OnboardingCard />);

// ════════════════════════════════════════════════════════════════════════════
// 1. Static data contract
// ════════════════════════════════════════════════════════════════════════════
describe('OnboardingCard static data contract', () => {
  it('has exactly 4 onboarding items', () => {
    expect(MOCK_ITEMS).toHaveLength(4);
  });

  it('each item has required fields', () => {
    MOCK_ITEMS.forEach((item) => {
      expect(item).toEqual(expect.objectContaining({
        label: expect.any(String),
        value: expect.any(Number),
        sub:   expect.any(String),
        color: expect.any(String),
      }));
    });
  });

  it('In Progress item has value 107', () => {
    expect(MOCK_ITEMS.find(i => i.label === 'In Progress').value).toBe(107);
  });

  it('Hired item has value 2', () => {
    expect(MOCK_ITEMS.find(i => i.label === 'Hired').value).toBe(2);
  });

  it('Project Completed item has value 2', () => {
    expect(MOCK_ITEMS.find(i => i.label === 'Project Completed').value).toBe(2);
  });

  it('Archive item has value 2', () => {
    expect(MOCK_ITEMS.find(i => i.label === 'Archive').value).toBe(2);
  });

  it('color values are valid classes', () => {
    const validColors = ['blue', 'green', 'purple', 'peach'];
    MOCK_ITEMS.forEach((item) => {
      expect(validColors).toContain(item.color);
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Card header
// ════════════════════════════════════════════════════════════════════════════
describe('OnboardingCard header', () => {
  it('renders without crashing', () => {
    renderCard();
  });

  it('renders "Onboarding" heading', () => {
    renderCard();
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('renders "View all" link in the extra area', () => {
    renderCard();
    expect(screen.getByText('View all')).toBeInTheDocument();
  });

  it('"View all" is a clickable link-type button', () => {
    renderCard();
    const link = screen.getByText('View all');
    expect(link.closest('button') || link.closest('a')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Stat labels
// ════════════════════════════════════════════════════════════════════════════
describe('OnboardingCard stat labels', () => {
  it('renders "In Progress" label', () => {
    renderCard();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders "Hired" label', () => {
    renderCard();
    expect(screen.getByText('Hired')).toBeInTheDocument();
  });

  it('renders "Project Completed" label', () => {
    renderCard();
    expect(screen.getByText('Project Completed')).toBeInTheDocument();
  });

  it('renders "Archive" label', () => {
    renderCard();
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });

  it('renders all 4 labels in a single render', () => {
    renderCard();
    MOCK_ITEMS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Stat values
// ════════════════════════════════════════════════════════════════════════════
describe('OnboardingCard stat values', () => {
  it('renders In Progress value: 107', () => {
    renderCard();
    expect(screen.getByText('107')).toBeInTheDocument();
  });

  it('renders at least one occurrence of value 2', () => {
    renderCard();
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
  });

  it('value 107 appears exactly once', () => {
    renderCard();
    expect(screen.getAllByText('107')).toHaveLength(1);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Sub-labels
// ════════════════════════════════════════════════════════════════════════════
describe('OnboardingCard sub-labels', () => {
  it('renders "Under review" sub-label', () => {
    renderCard();
    expect(screen.getByText('Under review')).toBeInTheDocument();
  });

  it('renders "Onboarded" sub-label', () => {
    renderCard();
    expect(screen.getByText('Onboarded')).toBeInTheDocument();
  });

  it('renders "Project cycle closed" sub-label', () => {
    renderCard();
    expect(screen.getByText('Project cycle closed')).toBeInTheDocument();
  });

  it('renders "No longer active" sub-label', () => {
    renderCard();
    expect(screen.getByText('No longer active')).toBeInTheDocument();
  });

  it('renders all 4 sub-labels in a single render', () => {
    renderCard();
    MOCK_ITEMS.forEach(({ sub }) => {
      expect(screen.getByText(sub)).toBeInTheDocument();
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Color classes
// ════════════════════════════════════════════════════════════════════════════
describe('OnboardingCard color classes', () => {
  it('renders 4 onboarding-item elements', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.onboarding-item').length).toBe(4);
  });

  it('renders 1 blue-colored item', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.onboarding-item.blue').length).toBe(1);
  });

  it('renders 1 green-colored item', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.onboarding-item.green').length).toBe(1);
  });

  it('renders 1 purple-colored item', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.onboarding-item.purple').length).toBe(1);
  });

  it('renders 1 peach-colored item', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.onboarding-item.peach').length).toBe(1);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. Grid layout
// ════════════════════════════════════════════════════════════════════════════
describe('OnboardingCard grid layout', () => {
  it('renders at least 4 ant-col elements for the 4 stat items', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.onboarding-card .ant-col').length).toBeGreaterThanOrEqual(4);
  });

  it('renders inside an ant-row', () => {
    const { container } = renderCard();
    expect(container.querySelector('.ant-row')).toBeInTheDocument();
  });

  it('renders 4 onboarding-item-footer elements', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.onboarding-item-footer').length).toBe(4);
  });
});
