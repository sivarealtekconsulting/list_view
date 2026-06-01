import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VenkateshDetailViewPage from './VenkateshDetailViewPage';
import personalitiesData from '../data/personalities.json';
import venkateshDetailMockData from '../data/venkateshDetailMockData.json';

const PERSONALITIES = personalitiesData.personalities;
const PERSONALITY_STATUS_COLORS = personalitiesData.statusColors;

const mandatoryPersonalityFields = [
  'key',
  'code',
  'name',
  'category',
  'role',
  'status',
  'assignedTo',
  'email',
  'phone',
  'location',
  'department',
  'priority',
  'completion',
  'dob',
  'date',
  'lastUpdated',
  'description',
  'notes',
  'tags',
];

const mandatoryCandidateFields = [
  'key',
  'candidateId',
  'name',
  'role',
  'experience',
  'location',
  'status',
  'submittedDate',
];

function renderDetailPage(initialEntry = '/Venkatesh-detailview/1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/Venkatesh-detailview/:id" element={<VenkateshDetailViewPage />} />
        <Route path="/Venkatesh-detailview/:id/edit-job" element={<div>Edit Job Route</div>} />
        <Route path="/Venkatesh" element={<div>Venkatesh Route</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function getCandidatesCard() {
  return screen.getAllByText('Candidates')[1].closest('.ant-card');
}

function isMissing(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

describe('VenkateshDetailViewPage mock data', () => {
  it('has complete mandatory personality data', () => {
    const missingFields = [];
    const invalidFields = [];

    PERSONALITIES.forEach((record) => {
      const recordLabel = record.code || record.key || 'Personality';

      mandatoryPersonalityFields.forEach((field) => {
        if (!Object.prototype.hasOwnProperty.call(record, field) || isMissing(record[field])) {
          missingFields.push(`${recordLabel} ${field} is missing`);
        }
      });

      if (!isMissing(record.status) && !PERSONALITY_STATUS_COLORS[record.status]) {
        invalidFields.push(`${recordLabel} status is invalid`);
      }

      if (!isMissing(record.completion) && !/^\d+%$/.test(record.completion)) {
        invalidFields.push(`${recordLabel} completion is invalid`);
      }

      if (Array.isArray(record.tags)) {
        record.tags.forEach((tag, index) => {
          if (isMissing(tag)) {
            missingFields.push(`${recordLabel} tags[${index}] is missing`);
          }
        });
      }
    });

    expect([...missingFields, ...invalidFields]).toEqual([]);
  });

  it('has complete mandatory candidate data', () => {
    const missingFields = [];

    venkateshDetailMockData.candidateRows.forEach((candidate) => {
      const candidateLabel = candidate.candidateId || candidate.key || 'Candidate';

      mandatoryCandidateFields.forEach((field) => {
        if (!Object.prototype.hasOwnProperty.call(candidate, field) || isMissing(candidate[field])) {
          missingFields.push(`${candidateLabel} ${field} is missing`);
        }
      });
    });

    expect(missingFields).toEqual([]);
  });
});

describe('VenkateshDetailViewPage details tab', () => {
  it('renders personality, contact, summary, and timeline sections', () => {
    renderDetailPage();

    expect(screen.getByText('Personality Details')).toBeInTheDocument();
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  it('renders detail labels and summary controls', () => {
    renderDetailPage();

    expect(screen.getByText('Personality ID')).toBeInTheDocument();
    expect(screen.getByText('Personality Name')).toBeInTheDocument();
    expect(screen.getAllByText('Completion').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Created Date')).toBeInTheDocument();
    expect(screen.getByText('Last Updated')).toBeInTheDocument();
  });

  it('navigates to edit route when Edit is clicked', async () => {
    renderDetailPage();

    await userEvent.click(screen.getByRole('button', { name: /Edit/i }));

    expect(screen.getByText('Edit Job Route')).toBeInTheDocument();
  });

  it('navigates back to list route when Back is clicked', async () => {
    renderDetailPage();

    await userEvent.click(screen.getByRole('button', { name: /Back/i }));

    expect(screen.getByText('Venkatesh Route')).toBeInTheDocument();
  });
});

describe('VenkateshDetailViewPage activity tab', () => {
  it('shows activity feed and next step content', async () => {
    renderDetailPage();

    await userEvent.click(screen.getByRole('tab', { name: /Activity/i }));

    expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    expect(screen.getByText('Activity Snapshot')).toBeInTheDocument();
    expect(screen.getByText('Next Step')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Assigned')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('activity snapshot shows event count, owner, latest update, and status', async () => {
    renderDetailPage();

    await userEvent.click(screen.getByRole('tab', { name: /Activity/i }));

    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Latest')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('moves from activity tab to candidates tab with View Candidates action', async () => {
    renderDetailPage();

    await userEvent.click(screen.getByRole('tab', { name: /Activity/i }));
    await userEvent.click(screen.getByRole('button', { name: /View Candidates/i }));

    expect(screen.getAllByText('Candidate ID').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Candidate Name').length).toBeGreaterThanOrEqual(1);
  });
});

describe('VenkateshDetailViewPage candidates tab', () => {
  it('shows selected candidate count and deletes one selected row', async () => {
    renderDetailPage();

    await userEvent.click(screen.getByRole('tab', { name: /Candidates/i }));
    expect(screen.getAllByText('Candidate Name').length).toBeGreaterThanOrEqual(1);

    const candidatesCard = getCandidatesCard();
    expect(within(candidatesCard).getByRole('button', { name: /Delete/i })).toBeDisabled();

    const checkboxes = within(candidatesCard).getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);

    expect(screen.getByText('Selected (1)')).toBeInTheDocument();
    await userEvent.click(within(candidatesCard).getByRole('button', { name: /Delete/i }));

    expect(screen.queryByText('Selected (1)')).not.toBeInTheDocument();
  });

  it('selects all candidate rows and deletes them together', async () => {
    renderDetailPage();

    await userEvent.click(screen.getByRole('tab', { name: /Candidates/i }));

    const candidatesCard = getCandidatesCard();
    const checkboxes = within(candidatesCard).getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);

    expect(screen.getByText('Selected (3)')).toBeInTheDocument();
    await userEvent.click(within(candidatesCard).getByRole('button', { name: /Delete/i }));

    expect(screen.queryByText('Selected (3)')).not.toBeInTheDocument();
  });

  it('keeps candidate table readable after sortable header is clicked', async () => {
    renderDetailPage();

    await userEvent.click(screen.getByRole('tab', { name: /Candidates/i }));
    await userEvent.click(screen.getAllByText('Candidate Name')[0]);

    expect(screen.getAllByText('Candidate ID').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Submitted Date').length).toBeGreaterThanOrEqual(1);
  });
});

describe('VenkateshDetailViewPage fallback', () => {
  it('renders not found state for unknown record id', () => {
    renderDetailPage('/Venkatesh-detailview/999');

    expect(screen.getByText('Personality record not found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Venkatesh/i })).toBeInTheDocument();
  });
});
