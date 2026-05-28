import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VenkateshDetailViewPage from './VenkateshDetailViewPage';

const renderPage = (initialEntry = '/Venkatesh-detailview/1') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route path="/Venkatesh-detailview/:id" element={<VenkateshDetailViewPage />} />
      <Route path="/Venkatesh-detailview/:id/edit-job" element={<div>Edit Job Route</div>} />
      <Route path="/Venkatesh" element={<div>Venkatesh Route</div>} />
    </Routes>
  </MemoryRouter>,
);

describe('VenkateshDetailViewPage', () => {
  it('renders personality, contact, summary, and timeline details', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByText('Personality Details')).toBeInTheDocument();
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Owns the product strategy track and coordinates stakeholder reviews for active initiatives.')).toBeInTheDocument();
  });

  it('renders summary paragraph, progress, and tags from the selected record', () => {
    renderPage();

    expect(screen.getByText(/John Doe is a Product Strategist in the Product department/i)).toBeInTheDocument();
    expect(screen.getByText('Strong communication profile with high customer-facing readiness.')).toBeInTheDocument();
    expect(screen.getByText('Strategy')).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
    expect(screen.getByText('Client Facing')).toBeInTheDocument();
    expect(screen.getAllByText('92%').length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to edit route when Edit is clicked', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Edit/i }));

    expect(screen.getByText('Edit Job Route')).toBeInTheDocument();
  });

  it('navigates back to list route when Back is clicked', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Back/i }));

    expect(screen.getByText('Venkatesh Route')).toBeInTheDocument();
  });

  it('shows activity tab with activity feed and next step', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('tab', { name: /Activity/i }));

    expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    expect(screen.getByText('Activity Snapshot')).toBeInTheDocument();
    expect(screen.getByText('Next Step')).toBeInTheDocument();
    expect(screen.getByText('John Doe profile was created on 15 May 2024.')).toBeInTheDocument();
    expect(screen.getByText('Assigned to Sarah Wilson for ownership and follow-up.')).toBeInTheDocument();
    expect(screen.getByText('Profile status is Active and was last updated on 20 May 2024.')).toBeInTheDocument();
  });

  it('activity snapshot shows event count, owner, latest update, and status', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('tab', { name: /Activity/i }));

    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Latest')).toBeInTheDocument();
    expect(screen.getAllByText('20 May 2024').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getAllByText('Sarah Wilson').length).toBeGreaterThanOrEqual(1);
  });

  it('moves from activity to candidates with the View Candidates action', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('tab', { name: /Activity/i }));
    await userEvent.click(screen.getByRole('button', { name: /View Candidates/i }));

    expect(screen.getAllByText('Candidate ID').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Arun Kumar')).toBeInTheDocument();
  });

  it('shows candidate selection count and deletes selected candidate rows', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('tab', { name: /Candidates/i }));
    expect(screen.getByText('Arun Kumar')).toBeInTheDocument();

    const candidatesCard = screen.getAllByText('Candidates')[1].closest('.ant-card');
    expect(within(candidatesCard).getByRole('button', { name: /Delete/i })).toBeDisabled();

    const checkboxes = within(candidatesCard).getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);

    expect(screen.getByText('Selected (1)')).toBeInTheDocument();
    await userEvent.click(within(candidatesCard).getByRole('button', { name: /Delete/i }));

    expect(screen.queryByText('Arun Kumar')).not.toBeInTheDocument();
    expect(screen.queryByText('Selected (1)')).not.toBeInTheDocument();
  });

  it('selects all candidate rows and deletes them together', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('tab', { name: /Candidates/i }));

    const candidatesCard = screen.getAllByText('Candidates')[1].closest('.ant-card');
    const checkboxes = within(candidatesCard).getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);

    expect(screen.getByText('Selected (3)')).toBeInTheDocument();
    await userEvent.click(within(candidatesCard).getByRole('button', { name: /Delete/i }));

    expect(screen.queryByText('Arun Kumar')).not.toBeInTheDocument();
    expect(screen.queryByText('Meera Iyer')).not.toBeInTheDocument();
    expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
  });

  it('keeps candidate table readable after sortable header is clicked', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('tab', { name: /Candidates/i }));
    await userEvent.click(screen.getAllByText('Candidate Name')[0]);

    expect(screen.getByText('Arun Kumar')).toBeInTheDocument();
    expect(screen.getByText('Meera Iyer')).toBeInTheDocument();
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
  });

  it('renders not found state for unknown record id', () => {
    renderPage('/Venkatesh-detailview/999');

    expect(screen.getByText('Personality record not found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Venkatesh/i })).toBeInTheDocument();
  });
});
