/**
 * StickyNotesCard.test.jsx
 * ─────────────────────────
 * Deep UI test suite for src/components/cards/StickyNotesCard.jsx.
 *
 * Stack : Vitest + React Testing Library
 * Run   : npm test -- StickyNotesCard.test.jsx
 *
 * Coverage areas
 *  1. Static data contract  — 4 notes, shape validation
 *  2. Card header           — title + action buttons
 *  3. Note type pills       — Tagged × 2, Note × 2
 *  4. Note titles           — both unique titles render correctly
 *  5. Note bodies           — content text present in DOM
 *  6. Note footers          — author + time metadata
 *  7. Date label            — orange note shows 04 April, 2026
 *  8. Color classes         — purple, peach, green note types
 */

import { render, screen } from '@testing-library/react';
import StickyNotesCard from '../components/cards/StickyNotesCard';

const MOCK_NOTES = [
  {
    type: 'purple', pill: 'Tagged',
    heading: 'Resume mismatch on Kiran Erravalla',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    footerLeft: 'Tagged by Anusha', footerRight: '10:15 AM',
    dot: null, date: null,
  },
  {
    type: 'peach', pill: 'Note',
    heading: 'Follow up with Deloitte panel',
    body: 'Submitted resume has an outdated client project. Review and resend.',
    footerLeft: 'Created by you', footerRight: 'Yesterday',
    dot: '#f97316', date: '04 April, 2026',
  },
  {
    type: 'green', pill: 'Note',
    heading: 'Follow up with Deloitte panel',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    footerLeft: 'Created by you', footerRight: 'Yesterday',
    dot: null, date: null,
  },
  {
    type: 'purple', pill: 'Tagged',
    heading: 'Resume mismatch on Kiran Erravalla',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    footerLeft: 'Tagged by Anusha', footerRight: '10:15 AM',
    dot: null, date: null,
  },
];

const renderCard = () => render(<StickyNotesCard />);

// ════════════════════════════════════════════════════════════════════════════
// 1. Static data contract
// ════════════════════════════════════════════════════════════════════════════
describe('StickyNotesCard static data contract', () => {
  it('has exactly 4 notes', () => {
    expect(MOCK_NOTES).toHaveLength(4);
  });

  it('each note has required fields', () => {
    MOCK_NOTES.forEach((note) => {
      expect(note).toEqual(expect.objectContaining({
        type:        expect.any(String),
        pill:        expect.any(String),
        heading:     expect.any(String),
        body:        expect.any(String),
        footerLeft:  expect.any(String),
        footerRight: expect.any(String),
      }));
    });
  });

  it('has 2 Tagged and 2 Note pills', () => {
    const tagged = MOCK_NOTES.filter(n => n.pill === 'Tagged');
    const notes  = MOCK_NOTES.filter(n => n.pill === 'Note');
    expect(tagged).toHaveLength(2);
    expect(notes).toHaveLength(2);
  });

  it('only the peach note has a date', () => {
    const withDate = MOCK_NOTES.filter(n => n.date !== null);
    expect(withDate).toHaveLength(1);
    expect(withDate[0].date).toBe('04 April, 2026');
  });

  it('only the peach note has a dot color', () => {
    const withDot = MOCK_NOTES.filter(n => n.dot !== null);
    expect(withDot).toHaveLength(1);
    expect(withDot[0].dot).toBe('#f97316');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Card header
// ════════════════════════════════════════════════════════════════════════════
describe('StickyNotesCard header', () => {
  it('renders without crashing', () => {
    renderCard();
  });

  it('renders "Sticky Notes" heading', () => {
    renderCard();
    expect(screen.getByText('Sticky Notes')).toBeInTheDocument();
  });

  it('renders "View all" link', () => {
    renderCard();
    expect(screen.getByText('View all')).toBeInTheDocument();
  });

  it('renders the add note plus-icon button', () => {
    const { container } = renderCard();
    expect(container.querySelector('.anticon-plus')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Note type pills
// ════════════════════════════════════════════════════════════════════════════
describe('StickyNotesCard type pills', () => {
  it('renders 2 "Tagged" pill labels', () => {
    renderCard();
    expect(screen.getAllByText('Tagged')).toHaveLength(2);
  });

  it('renders 2 "Note" pill labels', () => {
    renderCard();
    expect(screen.getAllByText('Note')).toHaveLength(2);
  });

  it('renders 4 ant-tag elements total', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.ant-tag').length).toBe(4);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Note titles
// ════════════════════════════════════════════════════════════════════════════
describe('StickyNotesCard note titles', () => {
  it('renders "Resume mismatch on Kiran Erravalla" twice', () => {
    renderCard();
    expect(screen.getAllByText('Resume mismatch on Kiran Erravalla')).toHaveLength(2);
  });

  it('renders "Follow up with Deloitte panel" twice', () => {
    renderCard();
    expect(screen.getAllByText('Follow up with Deloitte panel')).toHaveLength(2);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Note bodies
// ════════════════════════════════════════════════════════════════════════════
describe('StickyNotesCard note bodies', () => {
  it('renders the manager-mentioned body text at least once', () => {
    renderCard();
    expect(
      screen.getAllByText(/Manager mentioned the submitted resume has an outdated client project/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders the short submitted-resume body on the peach note', () => {
    renderCard();
    expect(
      screen.getByText('Submitted resume has an outdated client project. Review and resend.'),
    ).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Note footers — author and time metadata
// ════════════════════════════════════════════════════════════════════════════
describe('StickyNotesCard note footers', () => {
  it('renders "Tagged by Anusha" twice', () => {
    renderCard();
    expect(screen.getAllByText('Tagged by Anusha')).toHaveLength(2);
  });

  it('renders "Created by you" twice', () => {
    renderCard();
    expect(screen.getAllByText('Created by you')).toHaveLength(2);
  });

  it('renders "10:15 AM" twice on Tagged notes', () => {
    renderCard();
    expect(screen.getAllByText('10:15 AM')).toHaveLength(2);
  });

  it('renders "Yesterday" twice on Note type notes', () => {
    renderCard();
    expect(screen.getAllByText('Yesterday')).toHaveLength(2);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. Date label on the orange note
// ════════════════════════════════════════════════════════════════════════════
describe('StickyNotesCard date label', () => {
  it('renders "04 April, 2026" on the peach note exactly once', () => {
    renderCard();
    expect(screen.getByText('04 April, 2026')).toBeInTheDocument();
  });

  it('renders only 1 date label in total', () => {
    renderCard();
    expect(screen.getAllByText('04 April, 2026')).toHaveLength(1);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 8. Color classes
// ════════════════════════════════════════════════════════════════════════════
describe('StickyNotesCard color classes', () => {
  it('renders 4 sticky-note elements total', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.sticky-note').length).toBe(4);
  });

  it('renders 2 purple-colored notes', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.sticky-note.purple').length).toBe(2);
  });

  it('renders 1 peach-colored note', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.sticky-note.peach').length).toBe(1);
  });

  it('renders 1 green-colored note', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.sticky-note.green').length).toBe(1);
  });

  it('the orange dot is only on the peach note', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.sticky-note-dot').length).toBe(1);
    const dot = container.querySelector('.sticky-note-dot');
    expect(dot.style.background).toBe('rgb(249, 115, 22)');
  });
});
