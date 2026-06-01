import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GnaneshDetailedView from "../pages/gnanesh-detailed-view";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const renderPage = (jobId = '1') =>
  render(
    <MemoryRouter initialEntries={[`/gnanesh-detailed-view/${jobId}`]}>
      <Routes>
        <Route
          path="/gnanesh-detailed-view/:jobId"
          element={<GnaneshDetailedView />}
        />
      </Routes>
    </MemoryRouter>
  );

const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Asserts that both a label and its paired value are present
 * within the same container (typically an .ant-card).
 *
 * Avoids relying on .ant-space internals — Ant Design's DOM structure
 * can vary across versions, making closest('.ant-space') unreliable.
 * Checking both strings within the same card is the meaningful contract.
 */
const expectMetricValue = (container, label, value) => {
  expect(
    within(container).queryAllByText(new RegExp(`^${escapeRegExp(label)}$`)).length
  ).toBeGreaterThan(0);
  expect(
    within(container).queryAllByText(new RegExp(`^${escapeRegExp(value)}$`)).length
  ).toBeGreaterThan(0);
};

// ─────────────────────────────────────────────────────────────
// Suite
// ─────────────────────────────────────────────────────────────

describe('GnaneshDetailedView', () => {

  // ── 1. Basic render ──────────────────────────────────────────

  it('renders detailed view page without crashing', () => {
    renderPage();
    expect(document.body).toBeInTheDocument();
  });

  it('renders breadcrumb and header details', () => {
    renderPage();
    expect(screen.getByText(/Gnanesh Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/TCS - MSP ID 10432419/i)).toBeInTheDocument();
    expect(document.body.textContent).toContain('Client rate:');
    expect(document.body.textContent).toContain('/hr');
  });

  // ── 2. Fallback for unknown jobId ────────────────────────────

  it('falls back to the first mock job when jobId does not match any record', () => {
    renderPage('99999');
    expect(document.body).toBeInTheDocument();
    expect(screen.getByText(/Gnanesh Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/TCS - MSP ID 10432419/i)).toBeInTheDocument();
    expect(screen.getByText(/Source Candidate Control/i)).toBeInTheDocument();
  });

  // ── 3. Source Candidate Control ──────────────────────────────

  it('renders Source Candidate Control section and action buttons', () => {
    renderPage();
    expect(screen.getByText(/Source Candidate Control/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Source Candidates/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View Matched Profiles/i })
    ).toBeInTheDocument();
  });

  it('renders correct Ready and Strong Match counts in Source Candidate Control', () => {
    renderPage();
    const card = screen.getByText(/Source Candidate Control/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Ready', '12');
    expectMetricValue(card, 'Strong Match', '4');
  });

  /**
   * Review count should render as "0" when there are no review candidates.
   */
  it('renders Review as "0" in Source Candidate Control', () => {
    renderPage();
    const card = screen.getByText(/Source Candidate Control/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Review', '0');
  });

  it('renders created-on timestamp in Source Candidate Control', () => {
    renderPage();
    const card = screen.getByText(/Source Candidate Control/i).closest('.ant-card');
    expect(card.textContent).toContain('Created on Nov 03, 2025 | 07:00PM');
  });

  // ── 4. Default tab — Skill Insights ──────────────────────────

  it('renders main detail tabs with correct labels', () => {
    renderPage();
    expect(screen.getByRole('tab', { name: /Skill Insights/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Candidates API/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Matched Candidates/i })).toBeInTheDocument();
  });

  it('renders Skill Match Overview values on default Skill Insights tab', () => {
    renderPage();
    const card = screen.getByText(/Skill Match Overview/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Match Score', '86%');
    expectMetricValue(card, 'Priority Skill', 'React JS');
    expectMetricValue(card, 'Submission Readiness', 'High');
  });

  it('renders all required skill stack tags', () => {
    renderPage();
    expect(screen.queryAllByText(/^React JS$/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/^JavaScript$/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/^REST API$/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/^Ant Design$/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/^Frontend Architecture$/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/^Performance Optimization$/).length).toBeGreaterThan(0);
  });

  it('renders Candidate Pipeline Snapshot with Ready and Strong Match counts', () => {
    renderPage();
    const card = screen.getByText(/Candidate Pipeline Snapshot/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Ready', '12');
    expectMetricValue(card, 'Strong Match', '4');
  });

  /**
   * Edge case: mirrors the same "-" fallback as Source Candidate Control.
   */
  it('renders Review as "0" in Candidate Pipeline Snapshot', () => {
    renderPage();
    const card = screen.getByText(/Candidate Pipeline Snapshot/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Review', '0');
  });

  it('renders all Candidate Fit Signals items', () => {
    renderPage();
    expect(screen.getByText(/Candidate Fit Signals/i)).toBeInTheDocument();
    expect(screen.getByText(/Strong frontend implementation experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Good understanding of reusable component structure/i)).toBeInTheDocument();
    expect(screen.getByText(/Comfortable with dashboard and table-heavy UI/i)).toBeInTheDocument();
    expect(screen.getByText(/Good exposure to validated forms and routing/i)).toBeInTheDocument();
  });

  it('renders Recruiter Notes card with expected note content', () => {
    renderPage();
    expect(screen.queryAllByText(/Recruiter Notes/i).length).toBeGreaterThan(0);
    expect(document.body.textContent).toContain(
      'Prioritize candidates with React + Ant Design dashboard experience.'
    );
    expect(document.body.textContent).toContain(
      'Check API integration exposure before client submission.'
    );
  });

  it('renders Client Snapshot with contact person, email and phone', () => {
    renderPage();
    const card = screen.getByText(/Client Snapshot/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Contact Person', 'Jayaprakash A');
    expect(within(card).getByText(/jayaprakash123@gmail.com/i)).toBeInTheDocument();
    expect(within(card).getByText(/\+91 \(999\) 469 - 4028/i)).toBeInTheDocument();
  });

  it('renders Submission Notes with Target, Pipeline and Unit fields', () => {
    renderPage();
    const card = screen.getByText(/Submission Notes/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expect(within(card).getByText(/^Target$/)).toBeInTheDocument();
    expect(within(card).getByText(/^Pipeline$/)).toBeInTheDocument();
    expectMetricValue(card, 'Unit', 'Realtek');
  });

  /**
   * Edge case: job.pipeline || '-' — the field must render something
   * whether the mock has a real value or falls back to a dash.
   */
  it('renders a value (or dash fallback) for Pipeline in Submission Notes', () => {
    renderPage();
    const card = screen.getByText(/Submission Notes/i).closest('.ant-card');
    const pipelineLabel = within(card).getByText(/^Pipeline$/);
    const fieldWrapper = pipelineLabel.closest('.ant-space');
    expect(fieldWrapper).toBeTruthy();
    expect(fieldWrapper.textContent.length).toBeGreaterThan('Pipeline'.length);
  });

  /**
   * Edge case: job.targetSub?.total — optional chain must not crash
   * when the fallback job is used (unknown jobId).
   */
  it('renders Target field in Submission Notes without crashing for fallback job', () => {
    renderPage('99999');
    const card = screen.getByText(/Submission Notes/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expect(within(card).getByText(/^Target$/)).toBeInTheDocument();
  });

  it('renders all four Requirement Brief description lines', () => {
    renderPage();
    expect(screen.getByText(/Requirement Brief/i)).toBeInTheDocument();
    expect(screen.getByText(/build clean, scalable and reusable frontend modules/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard layouts, list views, form validation/i)).toBeInTheDocument();
    expect(screen.getByText(/Ant Design, React hooks, routing, table actions/i)).toBeInTheDocument();
    expect(screen.getByText(/recruitment, CRM, ATS, LMS or dashboard-based products/i)).toBeInTheDocument();
  });

  // ── 5. Skill Activity timeline ───────────────────────────────

  it('renders Skill Activity tab and both date group headings', () => {
    renderPage();
    expect(screen.getByText(/Skill Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Mar 23, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Mar 20, 2026/i)).toBeInTheDocument();
  });

  it('renders all four activity status tags', () => {
    renderPage();
    expect(screen.queryAllByText(/Skill Reviewed/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Strong Match/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Shortlisted/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Needs Review/i).length).toBeGreaterThan(0);
  });

  it('renders descriptive text for all four timeline items', () => {
    renderPage();
    expect(screen.getByText(/Primary skills reviewed and mapped against frontend dashboard requirement/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidate profile marked as strong match for React and Ant Design implementation/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidate moved to shortlist after skill and experience validation/i)).toBeInTheDocument();
    expect(screen.getByText(/Resume needs one more review for API integration and dashboard experience/i)).toBeInTheDocument();
  });

  it('renders all four timeline timestamps', () => {
    renderPage();
    expect(screen.getByText(/07:39 PM/i)).toBeInTheDocument();
    expect(screen.getByText(/06:20 PM/i)).toBeInTheDocument();
    expect(screen.getByText(/04:17 PM/i)).toBeInTheDocument();
    expect(screen.getByText(/02:45 PM/i)).toBeInTheDocument();
  });

  // ── 6. Recruiter Notes activity sub-tab ──────────────────────

  it('renders Recruiter Notes content after clicking the notes sub-tab', async () => {
    renderPage();
    const user = userEvent.setup();
    const notesTabs = screen.queryAllByRole('tab', { name: /Recruiter Notes/i });
    expect(notesTabs.length).toBeGreaterThan(0);
    await user.click(notesTabs[0]);
    expect(document.body.textContent).toContain(
      'Prioritize candidates with React + Ant Design dashboard experience.'
    );
    expect(document.body.textContent).toContain(
      'Check API integration exposure before client submission.'
    );
  });

  // ── 7. Matched Candidates tab ────────────────────────────────

  it('renders correct aggregate values in Matched Candidate Summary', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));

    const card = screen.getByText(/Matched Candidate Summary/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Total Matches', '3');
    expectMetricValue(card, 'Excellent Match', '1');
    expectMetricValue(card, 'Good Match', '1');
    expectMetricValue(card, 'Needs Review', '1');
  });

  it('renders Skill Coverage tags and Submission Focus text', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));

    const skillCoverage = screen.getByText(/Skill Coverage/i).closest('.ant-card');
    expect(skillCoverage).toBeTruthy();
    ['React JS', 'Frontend Architecture', 'JavaScript', 'REST API'].forEach((skill) => {
      expect(within(skillCoverage).queryAllByText(skill).length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/Prioritize excellent and good match profiles first/i)).toBeInTheDocument();
    expect(screen.getByText(/Review missing API\/dashboard exposure before submission/i)).toBeInTheDocument();
  });

  it('renders all three matched candidate names', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(screen.getByText(/Jayaprakash A/i)).toBeInTheDocument();
    expect(screen.getByText(/Kiran Kumar/i)).toBeInTheDocument();
    expect(screen.getByText(/Sano S/i)).toBeInTheDocument();
  });

  it('renders work authorization, submission status and submitted dates for all candidates', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));

    expect(screen.queryAllByText(/H1B/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/GC EAD/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/L2 EAD/i).length).toBeGreaterThan(0);

    expect(screen.queryAllByText(/Ready to Submit/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Skill Review/i).length).toBeGreaterThan(0);

    expect(screen.queryAllByText(/Mar 23, 2026/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Mar 20, 2026/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Mar 18, 2026/i).length).toBeGreaterThan(0);
  });

  // ── 8. Candidates API tab ────────────────────────────────────

  it('renders Candidates API tab content after clicking the tab', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Candidates API/i }));
    expect(document.body.textContent).toContain('candidates');
  });

  // ── 9. Tab switching / state transitions ─────────────────────

  it('returns to Skill Insights content after switching away and back', async () => {
    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(screen.getByText(/Matched Candidate Summary/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Skill Insights/i }));
    expect(screen.getByText(/Skill Match Overview/i)).toBeInTheDocument();
    expect(screen.queryByText(/Matched Candidate Summary/i)).not.toBeInTheDocument();
  });

  it('hides Skill Insights sections while on Candidates API tab', async () => {
    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: /Candidates API/i }));
    expect(screen.queryByText(/Skill Match Overview/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Skill Insights/i }));
    expect(screen.getByText(/Skill Match Overview/i)).toBeInTheDocument();
  });

  it('hides Skill Insights sections while on Matched Candidates tab', async () => {
    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(screen.queryByText(/Skill Match Overview/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Candidate Fit Signals/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Requirement Brief/i)).not.toBeInTheDocument();
  });

});