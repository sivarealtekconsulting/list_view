/**
 * CalendarCard.test.jsx
 * ──────────────────────
 * Deep UI test suite for src/components/cards/CalendarCard.jsx.
 *
 * Stack : Vitest + React Testing Library
 * Run   : npm test -- CalendarCard.test.jsx
 *
 * Coverage areas
 *  1. buildCells()       — pure function unit tests
 *  2. Default view       — April 2026 heading
 *  3. Month navigation   — prev and next month buttons
 *  4. Year boundary      — Dec 2025 ← and Jan 2027 →
 *  5. Day name headers   — Sun through Sat
 *  6. Legend items       — 4 event-type labels
 *  7. Event dots         — dots rendered for known event dates
 *  8. Navigation buttons — presence via icon selectors
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarCard from '../components/cards/CalendarCard';

/** Local mirror of the buildCells logic in CalendarCard.jsx */
function buildCells(year, month) {
  const first       = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays    = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = first - 1; i >= 0; i--)  cells.push({ day: prevDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  while (cells.length % 7 !== 0)         cells.push({ day: cells.length - daysInMonth - first + 1, cur: false });
  return cells;
}

const renderCard = () => render(<CalendarCard />);

const getPrevBtn = (container) => container.querySelector('.anticon-left').closest('button');
const getNextBtn = (container) => container.querySelector('.anticon-right').closest('button');

// ════════════════════════════════════════════════════════════════════════════
// 1. buildCells() — pure function unit tests
// ════════════════════════════════════════════════════════════════════════════
describe('buildCells() pure function', () => {
  it('returns a multiple of 7 cells (complete weeks)', () => {
    [[2026, 3], [2026, 0], [2026, 11], [2025, 1]].forEach(([y, m]) => {
      expect(buildCells(y, m).length % 7).toBe(0);
    });
  });

  it('marks April 2026 with 30 current-month cells', () => {
    const cells = buildCells(2026, 3);
    expect(cells.filter(c => c.cur)).toHaveLength(30);
  });

  it('marks January 2026 with 31 current-month cells', () => {
    const cells = buildCells(2026, 0);
    expect(cells.filter(c => c.cur)).toHaveLength(31);
  });

  it('marks February 2026 with 28 current-month cells', () => {
    const cells = buildCells(2026, 1);
    expect(cells.filter(c => c.cur)).toHaveLength(28);
  });

  it('April 2026 first day is Wednesday — 3 leading filler cells', () => {
    const cells = buildCells(2026, 3);
    const leadingFillers = cells.findIndex(c => c.cur);
    expect(leadingFillers).toBe(3);
  });

  it('all cells before the first current day are filler', () => {
    const cells = buildCells(2026, 3);
    const firstCurrentIdx = cells.findIndex(c => c.cur);
    cells.slice(0, firstCurrentIdx).forEach(c => expect(c.cur).toBe(false));
  });

  it('all cells after the last current day are filler', () => {
    const cells = buildCells(2026, 3);
    const lastCurrentIdx = cells.map(c => c.cur).lastIndexOf(true);
    cells.slice(lastCurrentIdx + 1).forEach(c => expect(c.cur).toBe(false));
  });

  it('handles December — 31 current-month cells', () => {
    const cells = buildCells(2026, 11);
    expect(cells.filter(c => c.cur)).toHaveLength(31);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Default view — April 2026
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard default view', () => {
  it('renders without crashing', () => {
    renderCard();
  });

  it('shows "April 2026" as the default heading', () => {
    renderCard();
    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('renders the calendar-card container', () => {
    const { container } = renderCard();
    expect(container.querySelector('.calendar-card')).toBeInTheDocument();
  });

  it('does not show March 2026 by default', () => {
    renderCard();
    expect(screen.queryByText('March 2026')).not.toBeInTheDocument();
  });

  it('does not show May 2026 by default', () => {
    renderCard();
    expect(screen.queryByText('May 2026')).not.toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Month navigation
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard month navigation', () => {
  it('shows March 2026 after clicking the previous button once', async () => {
    const { container } = renderCard();
    await userEvent.click(getPrevBtn(container));
    expect(screen.getByText('March 2026')).toBeInTheDocument();
  });

  it('shows May 2026 after clicking the next button once', async () => {
    const { container } = renderCard();
    await userEvent.click(getNextBtn(container));
    expect(screen.getByText('May 2026')).toBeInTheDocument();
  });

  it('returns to April 2026 when next then prev are clicked', async () => {
    const { container } = renderCard();
    await userEvent.click(getNextBtn(container));
    await userEvent.click(getPrevBtn(container));
    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('shows February 2026 after clicking prev twice', async () => {
    const { container } = renderCard();
    await userEvent.click(getPrevBtn(container));
    await userEvent.click(getPrevBtn(container));
    expect(screen.getByText('February 2026')).toBeInTheDocument();
  });

  it('shows June 2026 after clicking next twice', async () => {
    const { container } = renderCard();
    await userEvent.click(getNextBtn(container));
    await userEvent.click(getNextBtn(container));
    expect(screen.getByText('June 2026')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Year boundary navigation
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard year boundary navigation', () => {
  it('shows December 2025 after clicking prev 4 times from April 2026', async () => {
    const { container } = renderCard();
    for (let i = 0; i < 4; i++) await userEvent.click(getPrevBtn(container));
    expect(screen.getByText('December 2025')).toBeInTheDocument();
  });

  it('shows January 2027 after clicking next 9 times from April 2026', async () => {
    const { container } = renderCard();
    for (let i = 0; i < 9; i++) await userEvent.click(getNextBtn(container));
    expect(screen.getByText('January 2027')).toBeInTheDocument();
  });

  it('shows November 2025 after clicking prev 5 times from April 2026', async () => {
    const { container } = renderCard();
    for (let i = 0; i < 5; i++) await userEvent.click(getPrevBtn(container));
    expect(screen.getByText('November 2025')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Day name headers
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard day name headers', () => {
  it('renders "Sun" header', () => {
    renderCard();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('renders "Mon" header', () => {
    renderCard();
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('renders "Tue" header', () => {
    renderCard();
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });

  it('renders "Wed" header', () => {
    renderCard();
    expect(screen.getByText('Wed')).toBeInTheDocument();
  });

  it('renders "Thu" header', () => {
    renderCard();
    expect(screen.getByText('Thu')).toBeInTheDocument();
  });

  it('renders "Fri" header', () => {
    renderCard();
    expect(screen.getByText('Fri')).toBeInTheDocument();
  });

  it('renders "Sat" header', () => {
    renderCard();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('renders exactly 7 day-name header cells', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.calendar-day-name').length).toBe(7);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Legend items — dot indicators
//    Tests are dot-based because the text labels are currently hidden.
//    Add text assertions here if <Text>{label}</Text> is re-enabled.
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard legend items', () => {
  it('renders 4 legend items in the legend container', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.calendar-legend-item').length).toBe(4);
  });

  it('renders 4 legend dot spans', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.calendar-legend-dot').length).toBe(4);
  });

  it('legend dot 1 is green — Onboarded date color', () => {
    const { container } = renderCard();
    const dots = container.querySelectorAll('.calendar-legend-dot');
    expect(dots[0].style.background).toBe('rgb(34, 197, 94)');
  });

  it('legend dot 2 is red — Exit date color', () => {
    const { container } = renderCard();
    const dots = container.querySelectorAll('.calendar-legend-dot');
    expect(dots[1].style.background).toBe('rgb(239, 68, 68)');
  });

  it('legend dot 3 is orange — To-do mentioned color', () => {
    const { container } = renderCard();
    const dots = container.querySelectorAll('.calendar-legend-dot');
    expect(dots[2].style.background).toBe('rgb(249, 115, 22)');
  });

  it('legend dot 4 is blue — Interview scheduled color', () => {
    const { container } = renderCard();
    const dots = container.querySelectorAll('.calendar-legend-dot');
    expect(dots[3].style.background).toBe('rgb(59, 130, 246)');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. Event dots
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard event dots', () => {
  it('renders at least one calendar-dot in April 2026 (which has events)', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.calendar-dot').length).toBeGreaterThan(0);
  });

  it('renders the week rows container', () => {
    const { container } = renderCard();
    expect(container.querySelector('.calendar-weeks')).toBeInTheDocument();
  });

  it('renders calendar cells for the current month', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.calendar-cell').length).toBeGreaterThan(0);
  });

  it('dot count decreases when navigating to a month without events', async () => {
    const { container } = renderCard();
    const dotsBefore = container.querySelectorAll('.calendar-dot').length;
    // Navigate to August 2026 (month 7) — no EVENTS defined for that month
    for (let i = 0; i < 4; i++) await userEvent.click(getNextBtn(container));
    const dotsAfter = container.querySelectorAll('.calendar-dot').length;
    expect(dotsAfter).toBeLessThan(dotsBefore);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 8. Navigation buttons — presence via icon selectors
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard navigation buttons', () => {
  it('renders the calendar icon in the header', () => {
    const { container } = renderCard();
    expect(container.querySelector('.anticon-calendar')).toBeInTheDocument();
  });

  it('renders the left-arrow icon for the prev button', () => {
    const { container } = renderCard();
    expect(container.querySelector('.anticon-left')).toBeInTheDocument();
  });

  it('renders the right-arrow icon for the next button', () => {
    const { container } = renderCard();
    expect(container.querySelector('.anticon-right')).toBeInTheDocument();
  });

  it('both nav buttons are rendered inside the calendar-nav container', () => {
    const { container } = renderCard();
    const nav = container.querySelector('.calendar-nav');
    expect(nav).toBeInTheDocument();
    expect(nav.querySelectorAll('button').length).toBe(2);
  });

  it('prev button contains the anticon-left icon', () => {
    const { container } = renderCard();
    const prevBtn = getPrevBtn(container);
    expect(prevBtn).toBeInTheDocument();
    expect(prevBtn.querySelector('.anticon-left')).toBeInTheDocument();
  });

  it('next button contains the anticon-right icon', () => {
    const { container } = renderCard();
    const nextBtn = getNextBtn(container);
    expect(nextBtn).toBeInTheDocument();
    expect(nextBtn.querySelector('.anticon-right')).toBeInTheDocument();
  });
});
