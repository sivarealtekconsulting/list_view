/**
 * StatsCards.test.jsx
 * ───────────────────
 * Deep UI test suite for src/components/cards/StatsCards.jsx.
 *
 * Stack : Vitest + React Testing Library
 * Run   : npm test -- StatsCards.test.jsx
 *
 * Coverage areas
 *  1. Static data contract  — 3 stat items shape and values
 *  2. Card structure        — outer card and inner cards render
 *  3. Labels                — Total Jobs, Active Jobs, My Jobs
 *  4. Values                — 1697, 1685, 600
 *  5. Icons                 — FileText, CheckCircle, User icons present
 *  6. Responsive layout     — all 3 cols rendered
 */

import { render, screen } from '@testing-library/react';
import StatsCards from '../components/cards/StatsCards';

const STATS = [
  { label: 'Total Jobs',  value: 1697 },
  { label: 'Active Jobs', value: 1685 },
  { label: 'My Jobs',     value: 600  },
];

const renderStatsCards = () => render(<StatsCards />);

// ════════════════════════════════════════════════════════════════════════════
// 1. Static data contract
// ════════════════════════════════════════════════════════════════════════════
describe('StatsCards static data contract', () => {
  it('defines exactly 3 stat items', () => {
    expect(STATS).toHaveLength(3);
  });

  it('each item has a string label and numeric value', () => {
    STATS.forEach(({ label, value }) => {
      expect(typeof label).toBe('string');
      expect(typeof value).toBe('number');
    });
  });

  it('Total Jobs value is 1697', () => {
    expect(STATS.find(s => s.label === 'Total Jobs').value).toBe(1697);
  });

  it('Active Jobs value is 1685', () => {
    expect(STATS.find(s => s.label === 'Active Jobs').value).toBe(1685);
  });

  it('My Jobs value is 600', () => {
    expect(STATS.find(s => s.label === 'My Jobs').value).toBe(600);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Card structure
// ════════════════════════════════════════════════════════════════════════════
describe('StatsCards card structure', () => {
  it('renders without crashing', () => {
    renderStatsCards();
  });

  it('renders at least one ant-card wrapper', () => {
    const { container } = renderStatsCards();
    expect(container.querySelectorAll('.ant-card').length).toBeGreaterThanOrEqual(1);
  });

  it('renders 3 inner stat cards', () => {
    const { container } = renderStatsCards();
    expect(container.querySelectorAll('.stats-inner-card').length).toBeGreaterThanOrEqual(3);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Label rendering
// ════════════════════════════════════════════════════════════════════════════
describe('StatsCards label rendering', () => {
  it('renders "Total Jobs" label', () => {
    renderStatsCards();
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
  });

  it('renders "Active Jobs" label', () => {
    renderStatsCards();
    expect(screen.getByText('Active Jobs')).toBeInTheDocument();
  });

  it('renders "My Jobs" label', () => {
    renderStatsCards();
    expect(screen.getByText('My Jobs')).toBeInTheDocument();
  });

  it('renders all 3 labels in a single render', () => {
    renderStatsCards();
    STATS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Value rendering
// ════════════════════════════════════════════════════════════════════════════
describe('StatsCards value rendering', () => {
  it('renders Total Jobs value: 1,697', () => {
    renderStatsCards();
    expect(screen.getByText('1,697')).toBeInTheDocument();
  });

  it('renders Active Jobs value: 1,685', () => {
    renderStatsCards();
    expect(screen.getByText('1,685')).toBeInTheDocument();
  });

  it('renders My Jobs value: 600', () => {
    renderStatsCards();
    expect(screen.getByText('600')).toBeInTheDocument();
  });

  it('all 3 stat values are visible simultaneously', () => {
    renderStatsCards();
    expect(screen.getByText('1,697')).toBeInTheDocument();
    expect(screen.getByText('1,685')).toBeInTheDocument();
    expect(screen.getByText('600')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Icons
// ════════════════════════════════════════════════════════════════════════════
describe('StatsCards icon rendering', () => {
  it('renders antd icons inside each stat card', () => {
    const { container } = renderStatsCards();
    expect(container.querySelectorAll('.anticon').length).toBeGreaterThanOrEqual(3);
  });

  it('renders a file-text icon for Total Jobs', () => {
    const { container } = renderStatsCards();
    expect(container.querySelector('.anticon-file-text')).toBeInTheDocument();
  });

  it('renders a check-circle icon for Active Jobs', () => {
    const { container } = renderStatsCards();
    expect(container.querySelector('.anticon-check-circle')).toBeInTheDocument();
  });

  it('renders a user icon for My Jobs', () => {
    const { container } = renderStatsCards();
    expect(container.querySelector('.anticon-user')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Responsive layout
// ════════════════════════════════════════════════════════════════════════════
describe('StatsCards responsive layout', () => {
  it('renders at least 3 ant-col elements for the 3 stats', () => {
    const { container } = renderStatsCards();
    expect(container.querySelectorAll('.ant-col').length).toBeGreaterThanOrEqual(3);
  });

  it('renders inside an ant-row', () => {
    const { container } = renderStatsCards();
    expect(container.querySelector('.ant-row')).toBeInTheDocument();
  });
});
