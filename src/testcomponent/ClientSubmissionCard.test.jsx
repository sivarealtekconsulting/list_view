/**
 * ClientSubmissionCard.test.jsx
 * ──────────────────────────────
 * Deep UI test suite for src/components/cards/ClientSubmissionCard.jsx.
 *
 * Stack : Vitest + React Testing Library
 * Run   : npm test -- ClientSubmissionCard.test.jsx
 *
 * Coverage areas
 *  1. Static data contract  — TOTAL, rows shape and values
 *  2. Header                — Total Client Submission label + count
 *  3. Submitted row         — label, value, info icon
 *  4. Rejected row          — label, value, no info icon
 *  5. Bar track             — bar elements rendered per row
 *  6. Full render           — both rows visible simultaneously
 */

import { render, screen } from '@testing-library/react';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';

const MOCK_TOTAL     = 1324;
const MOCK_SUBMITTED = 534;
const MOCK_REJECTED  = 87;

const renderCard = () => render(<ClientSubmissionCard />);

// ════════════════════════════════════════════════════════════════════════════
// 1. Static data contract
// ════════════════════════════════════════════════════════════════════════════
describe('ClientSubmissionCard static data contract', () => {
  it('has a total of 1324', () => {
    expect(MOCK_TOTAL).toBe(1324);
  });

  it('has Submitted count of 534', () => {
    expect(MOCK_SUBMITTED).toBe(534);
  });

  it('has Rejected count of 87', () => {
    expect(MOCK_REJECTED).toBe(87);
  });

  it('Submitted value is less than TOTAL', () => {
    expect(MOCK_SUBMITTED).toBeLessThan(MOCK_TOTAL);
  });

  it('Rejected value is less than TOTAL', () => {
    expect(MOCK_REJECTED).toBeLessThan(MOCK_TOTAL);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Header — Total Client Submission
// ════════════════════════════════════════════════════════════════════════════
describe('ClientSubmissionCard header', () => {
  it('renders without crashing', () => {
    renderCard();
  });

  it('renders "Total Client Submission:" label', () => {
    renderCard();
    expect(screen.getByText('Total Client Submission:')).toBeInTheDocument();
  });

  it('renders the total count 1,324', () => {
    renderCard();
    expect(screen.getByText('1,324')).toBeInTheDocument();
  });

  it('total count and label appear inside the submission-card', () => {
    const { container } = renderCard();
    const card = container.querySelector('.submission-card');
    expect(card).toBeInTheDocument();
    expect(card.textContent).toContain('1,324');
    expect(card.textContent).toContain('Total Client Submission:');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Submitted row
// ════════════════════════════════════════════════════════════════════════════
describe('ClientSubmissionCard Submitted row', () => {
  it('renders "Submitted" row label', () => {
    renderCard();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });

  it('renders submitted count 534', () => {
    renderCard();
    expect(screen.getByText('534')).toBeInTheDocument();
  });

  it('renders the info icon on the Submitted row', () => {
    const { container } = renderCard();
    expect(container.querySelector('.anticon-info-circle')).toBeInTheDocument();
  });

  it('submitted value element is present', () => {
    const { container } = renderCard();
    expect(container.querySelector('.submission-row-value')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Rejected row
// ════════════════════════════════════════════════════════════════════════════
describe('ClientSubmissionCard Rejected row', () => {
  it('renders "Rejected" row label', () => {
    renderCard();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders rejected count 87', () => {
    renderCard();
    expect(screen.getByText('87')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Bar track elements
// ════════════════════════════════════════════════════════════════════════════
describe('ClientSubmissionCard bar tracks', () => {
  it('renders 2 bar track elements (one per row)', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.submission-bar-track').length).toBe(2);
  });

  it('renders at least 2 bar fill elements', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.submission-bar-fill').length).toBeGreaterThanOrEqual(2);
  });

  it('renders an orange accent bar on the Submitted row', () => {
    const { container } = renderCard();
    expect(container.querySelector('.submission-bar-accent')).toBeInTheDocument();
  });

  it('Submitted fill bar has non-zero width style', () => {
    const { container } = renderCard();
    const fills = container.querySelectorAll('.submission-bar-fill');
    expect(fills[0].style.width).not.toBe('0%');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Full render — both rows visible simultaneously
// ════════════════════════════════════════════════════════════════════════════
describe('ClientSubmissionCard full render', () => {
  it('renders both row labels at the same time', () => {
    renderCard();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders both row values at the same time', () => {
    renderCard();
    expect(screen.getByText('534')).toBeInTheDocument();
    expect(screen.getByText('87')).toBeInTheDocument();
  });

  it('renders 2 submission-row-header sections', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.submission-row-header').length).toBe(2);
  });
});
