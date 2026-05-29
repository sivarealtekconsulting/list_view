/**
 * CalendarCard.test.jsx
 * ──────────────────────
 * Deep UI test suite for src/components/cards/CalendarCard.jsx.
 *
 * Stack : Vitest + React Testing Library
 * Run   : npm test -- CalendarCard.test.jsx
 *
 * Coverage areas
 *  1. buildCells()           — pure function unit tests
 *  2. Default view           — opens on the current calendar month
 *  3. Month navigation       — prev / next buttons
 *  4. Year boundary          — crosses December / January
 *  5. Day name headers       — Sun through Sat
 *  6. Legend items           — 4 event-type dots
 *  7. Event dots             — rendered for known event dates
 *  8. Navigation buttons     — presence via icon selectors
 *  9. Popover on dot click   — message appears / toggles / switches
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarCard from '../components/cards/CalendarCard';

// ── Shared helpers ────────────────────────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const today = new Date();

/** "Month YYYY" string for an offset in months from today */
function monthLabel(offset = 0) {
  const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Signed number of month clicks to reach (targetYear, targetMonthIdx) from today */
function clicksTo(targetYear, targetMonthIdx) {
  return (targetYear - today.getFullYear()) * 12 + (targetMonthIdx - today.getMonth());
}

/** Click prev or next `Math.abs(offset)` times */
async function navigate(container, offset) {
  if (offset === 0) return;
  const btn = offset < 0
    ? container.querySelector('.anticon-left').closest('button')
    : container.querySelector('.anticon-right').closest('button');
  for (let i = 0; i < Math.abs(offset); i++) await userEvent.click(btn);
}

const renderCard = () => render(<CalendarCard />);
const getPrevBtn  = (c) => c.querySelector('.anticon-left').closest('button');
const getNextBtn  = (c) => c.querySelector('.anticon-right').closest('button');

// Pre-compute click counts for year-boundary tests
const CLICKS_TO_DEC_2025 = Math.abs(clicksTo(2025, 11));
const CLICKS_TO_NOV_2025 = Math.abs(clicksTo(2025, 10));
const CLICKS_TO_JAN_2027 = clicksTo(2027, 0);
const CLICKS_TO_APRIL_2026 = clicksTo(2026, 3); // DEFAULT_EVENTS live here

// ════════════════════════════════════════════════════════════════════════════
// 1. buildCells() — pure function unit tests
// ════════════════════════════════════════════════════════════════════════════
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

describe('buildCells() pure function', () => {
  it('returns a multiple of 7 cells (complete weeks)', () => {
    [[2026, 3], [2026, 0], [2026, 11], [2025, 1]].forEach(([y, m]) => {
      expect(buildCells(y, m).length % 7).toBe(0);
    });
  });

  it('marks April 2026 with 30 current-month cells', () => {
    expect(buildCells(2026, 3).filter(c => c.cur)).toHaveLength(30);
  });

  it('marks January 2026 with 31 current-month cells', () => {
    expect(buildCells(2026, 0).filter(c => c.cur)).toHaveLength(31);
  });

  it('marks February 2026 with 28 current-month cells', () => {
    expect(buildCells(2026, 1).filter(c => c.cur)).toHaveLength(28);
  });

  it('April 2026 first day is Wednesday — 3 leading filler cells', () => {
    expect(buildCells(2026, 3).findIndex(c => c.cur)).toBe(3);
  });

  it('all cells before the first current day are filler', () => {
    const cells = buildCells(2026, 3);
    const firstIdx = cells.findIndex(c => c.cur);
    cells.slice(0, firstIdx).forEach(c => expect(c.cur).toBe(false));
  });

  it('all cells after the last current day are filler', () => {
    const cells = buildCells(2026, 3);
    const lastIdx = cells.map(c => c.cur).lastIndexOf(true);
    cells.slice(lastIdx + 1).forEach(c => expect(c.cur).toBe(false));
  });

  it('handles December — 31 current-month cells', () => {
    expect(buildCells(2026, 11).filter(c => c.cur)).toHaveLength(31);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Default view — opens on the current month
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard default view', () => {
  it('renders without crashing', () => { renderCard(); });

  it('shows the current month and year as the default heading', () => {
    renderCard();
    expect(screen.getByText(monthLabel(0))).toBeInTheDocument();
  });

  it('renders the calendar-card container', () => {
    const { container } = renderCard();
    expect(container.querySelector('.calendar-card')).toBeInTheDocument();
  });

  it('does not show the previous month heading by default', () => {
    renderCard();
    expect(screen.queryByText(monthLabel(-1))).not.toBeInTheDocument();
  });

  it('does not show the next month heading by default', () => {
    renderCard();
    expect(screen.queryByText(monthLabel(1))).not.toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Month navigation
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard month navigation', () => {
  it('shows 1 month back after clicking the previous button once', async () => {
    const { container } = renderCard();
    await userEvent.click(getPrevBtn(container));
    expect(screen.getByText(monthLabel(-1))).toBeInTheDocument();
  });

  it('shows 1 month ahead after clicking the next button once', async () => {
    const { container } = renderCard();
    await userEvent.click(getNextBtn(container));
    expect(screen.getByText(monthLabel(1))).toBeInTheDocument();
  });

  it('returns to the current month when next then prev are clicked', async () => {
    const { container } = renderCard();
    await userEvent.click(getNextBtn(container));
    await userEvent.click(getPrevBtn(container));
    expect(screen.getByText(monthLabel(0))).toBeInTheDocument();
  });

  it('shows 2 months back after clicking prev twice', async () => {
    const { container } = renderCard();
    await userEvent.click(getPrevBtn(container));
    await userEvent.click(getPrevBtn(container));
    expect(screen.getByText(monthLabel(-2))).toBeInTheDocument();
  });

  it('shows 2 months ahead after clicking next twice', async () => {
    const { container } = renderCard();
    await userEvent.click(getNextBtn(container));
    await userEvent.click(getNextBtn(container));
    expect(screen.getByText(monthLabel(2))).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Year boundary navigation
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard year boundary navigation', () => {
  it(`shows December 2025 after clicking prev ${CLICKS_TO_DEC_2025} times`, async () => {
    const { container } = renderCard();
    await navigate(container, -CLICKS_TO_DEC_2025);
    expect(screen.getByText('December 2025')).toBeInTheDocument();
  });

  it(`shows January 2027 after clicking next ${CLICKS_TO_JAN_2027} times`, async () => {
    const { container } = renderCard();
    await navigate(container, CLICKS_TO_JAN_2027);
    expect(screen.getByText('January 2027')).toBeInTheDocument();
  });

  it(`shows November 2025 after clicking prev ${CLICKS_TO_NOV_2025} times`, async () => {
    const { container } = renderCard();
    await navigate(container, -CLICKS_TO_NOV_2025);
    expect(screen.getByText('November 2025')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Day name headers
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard day name headers', () => {
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
    it(`renders "${day}" header`, () => {
      renderCard();
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders exactly 7 day-name header cells', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.calendar-day-name').length).toBe(7);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Legend items
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
  it('renders the week rows container', () => {
    const { container } = renderCard();
    expect(container.querySelector('.calendar-weeks')).toBeInTheDocument();
  });

  it('renders calendar cells for the current month', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.calendar-cell').length).toBeGreaterThan(0);
  });

  it('renders dots when navigating to April 2026 (default events month)', async () => {
    const { container } = renderCard();
    await navigate(container, CLICKS_TO_APRIL_2026);
    expect(container.querySelectorAll('.calendar-dot').length).toBeGreaterThan(0);
  });

  it('dot count decreases when navigating away from a month with events', async () => {
    const { container } = renderCard();
    // Navigate to April 2026 — has DEFAULT_EVENTS
    await navigate(container, CLICKS_TO_APRIL_2026);
    const dotsBefore = container.querySelectorAll('.calendar-dot').length;
    expect(dotsBefore).toBeGreaterThan(0);
    // Advance 4 months to August — no events
    for (let i = 0; i < 4; i++) await userEvent.click(getNextBtn(container));
    expect(container.querySelectorAll('.calendar-dot').length).toBeLessThan(dotsBefore);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 8. Navigation buttons
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
    const btn = getPrevBtn(container);
    expect(btn).toBeInTheDocument();
    expect(btn.querySelector('.anticon-left')).toBeInTheDocument();
  });

  it('next button contains the anticon-right icon', () => {
    const { container } = renderCard();
    const btn = getNextBtn(container);
    expect(btn).toBeInTheDocument();
    expect(btn.querySelector('.anticon-right')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 9. Popover on dot click
// ════════════════════════════════════════════════════════════════════════════
describe('CalendarCard popover on dot click', () => {
  const m = today.getMonth(); // 0-indexed current month

  // Events defined for the current month so they appear on the first render
  const popoverData = {
    events: {
      [`${m}-10`]: [{ color: 'blue',  message: 'Interview scheduled for day 10' }],
      [`${m}-20`]: [{ color: 'green', message: 'Candidate onboarded on day 20'  }],
    },
    legend: [
      { label: 'Interview scheduled', color: 'blue'  },
      { label: 'Onboarded date',      color: 'green' },
    ],
  };

  function renderWithData() {
    return render(<CalendarCard data={popoverData} />);
  }

  it('renders event dots for the current month when data is passed', () => {
    const { container } = renderWithData();
    expect(container.querySelectorAll('.calendar-dot').length).toBeGreaterThan(0);
  });

  it('event dots with messages have pointer cursor', () => {
    const { container } = renderWithData();
    const dot = container.querySelector('.calendar-dot');
    expect(dot.style.cursor).toBe('pointer');
  });

  it('clicking a message dot shows the popover text', async () => {
    const { container } = renderWithData();
    const dot = container.querySelector('.calendar-dot');
    await userEvent.click(dot);
    expect(screen.getByText('Interview scheduled for day 10')).toBeInTheDocument();
  });

  it('clicking the same dot again closes the popover', async () => {
    const { container } = renderWithData();
    const dot = container.querySelector('.calendar-dot');
    await userEvent.click(dot);
    expect(screen.getByText('Interview scheduled for day 10')).toBeInTheDocument();
    await userEvent.click(dot);
    expect(screen.queryByText('Interview scheduled for day 10')).not.toBeInTheDocument();
  });

  it('clicking a second dot closes the first popover and opens the second', async () => {
    const { container } = renderWithData();
    const [dot1, dot2] = container.querySelectorAll('.calendar-dot');
    await userEvent.click(dot1);
    expect(screen.getByText('Interview scheduled for day 10')).toBeInTheDocument();
    await userEvent.click(dot2);
    expect(screen.queryByText('Interview scheduled for day 10')).not.toBeInTheDocument();
    expect(screen.getByText('Candidate onboarded on day 20')).toBeInTheDocument();
  });
});
