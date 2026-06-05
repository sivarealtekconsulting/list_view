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
    // MSP ID as shown in the component
    expect(screen.getByText(/TCS - MSP ID 99999999/i)).toBeInTheDocument();
    expect(document.body.textContent).toContain('Client rate:');
    expect(document.body.textContent).toContain('/hr');
  });

  it('renders the first job title from GNANESH_MOCK_JOBS on load', () => {
    renderPage();
    expect(document.body.textContent).toContain('Full Stack Developer (3 Years Experience)');
  });

  it('renders correct job fields for jobId=1 from mock data', () => {
    renderPage('1');
    // VEN-001 data from gnaneshDashboardData.json
    expect(document.body.textContent).toContain('VEN-001');
    expect(document.body.textContent).toContain('Chennai');
    expect(document.body.textContent).toContain('3 years');
    expect(document.body.textContent).toContain('Full-time');
    expect(document.body.textContent).toContain('Hybrid');
    expect(document.body.textContent).toContain('$60');
  });

  it('renders correct job fields for jobId=2 from mock data', () => {
    renderPage('2');
    // VEN-002 data from gnaneshDashboardData.json
    expect(document.body.textContent).toContain('VEN-002');
    expect(document.body.textContent).toContain('Java Developer (Python Experience)');
    expect(document.body.textContent).toContain('Hyderabad');
    expect(document.body.textContent).toContain('5 years');
    expect(document.body.textContent).toContain('Remote');
    expect(document.body.textContent).toContain('$72');
  });

  it('renders correct job fields for jobId=5 from mock data', () => {
    renderPage('5');
    // VEN-005 data from gnaneshDashboardData.json
    expect(document.body.textContent).toContain('VEN-005');
    expect(document.body.textContent).toContain('Cloud DevOps Specialist');
    expect(document.body.textContent).toContain('Mumbai');
    expect(document.body.textContent).toContain('7 years');
    expect(document.body.textContent).toContain('$95');
  });

  // ── 2. Fallback for unknown jobId ────────────────────────────

  it('falls back to the first mock job when jobId does not match any record', () => {
    renderPage('99999');
    expect(document.body).toBeInTheDocument();
    expect(screen.getByText(/Gnanesh Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/TCS - MSP ID 99999999/i)).toBeInTheDocument();
    expect(screen.getByText(/Source Candidate Control/i)).toBeInTheDocument();
    // Should fall back to VEN-001
    expect(document.body.textContent).toContain('Full Stack Developer (3 Years Experience)');
  });

  // ── 3. Source Candidate Control ──────────────────────────────

  it('renders Source Candidate Control section and action buttons', () => {
    renderPage();
    expect(screen.getByText(/Source Candidate Control/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Find Candidates/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View Profiles/i })
    ).toBeInTheDocument();
  });

  it('renders correct Ready and Strong Match counts in Source Candidate Control', () => {
    renderPage();
    const card = screen.getByText(/Source Candidate Control/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Ready', '10');
    expectMetricValue(card, 'Strong Match', '2');
  });

  it('renders Review as "0" in Source Candidate Control', () => {
    renderPage();
    const card = screen.getByText(/Source Candidate Control/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Review', '0');
  });

  it('renders created-on timestamp in Source Candidate Control', () => {
    renderPage();
    const card = screen.getByText(/Source Candidate Control/i).closest('.ant-card');
    expect(card.textContent).toContain('Created on Nov 04, 2025 | 07:00PM');
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
    // Values as defined in gnanesh-detailed-view.jsx
    expectMetricValue(card, 'Match Score', '80%');
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
    // Correct tag as per skillStack in gnanesh-detailed-view.jsx
    expect(screen.queryAllByText(/^Performance Tuning$/).length).toBeGreaterThan(0);
  });

  it('renders Candidate Pipeline Snapshot with correct counts', () => {
    renderPage();
    const card = screen.getByText(/Candidate Pipeline Snapshot/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Ready', '12');
    expectMetricValue(card, 'Strong Match', '4');
  });

  it('renders Review as "0" in Candidate Pipeline Snapshot', () => {
    renderPage();
    const card = screen.getByText(/Candidate Pipeline Snapshot/i).closest('.ant-card');
    expect(card).toBeTruthy();
    expectMetricValue(card, 'Review', '0');
  });

  it('renders all Candidate Fit Signals items', () => {
    renderPage();
    expect(screen.getByText(/Candidate Fit Signals/i)).toBeInTheDocument();
    // Exact strings from goodFitSignals array in gnanesh-detailed-view.jsx
    expect(screen.getByText(/Basic frontend implementation experience/i)).toBeInTheDocument();
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
    // Email and phone as defined in gnanesh-detailed-view.jsx
    expect(within(card).getByText(/jayaprakash.changed@gmail.com/i)).toBeInTheDocument();
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
   * job.pipeline || '-' — must render something whether the mock
   * has a real value or falls back to a dash.
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
   * job.targetSub?.total — optional chain must not crash
   * when fallback job is used (unknown jobId).
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
    // GNANESH_CANDIDATE_ROWS has 3 entries: 1 Submitted, 1 Shortlisted, 1 Pipeline
    expectMetricValue(card, 'Total Matches', '3');
    expectMetricValue(card, 'Submitted', '1');
    expectMetricValue(card, 'Shortlisted', '1');
    expectMetricValue(card, 'Pipeline', '1');
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

  it('renders all three matched candidate names from GNANESH_CANDIDATE_ROWS', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(document.body.textContent).toContain('Arun Matheshwaran');
    expect(document.body.textContent).toContain('Meera Jamine');
    expect(document.body.textContent).toContain('Rohit Sharma');
  });

  it('renders correct roles for all three candidates', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(document.body.textContent).toContain('Business Analyst');
    expect(document.body.textContent).toContain('Product Consultant');
    expect(document.body.textContent).toContain('Customer Success Lead');
  });

  it('renders correct statuses for all three candidates', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(document.body.textContent).toContain('Submitted');
    expect(document.body.textContent).toContain('Shortlisted');
    expect(document.body.textContent).toContain('Pipeline');
  });

  it('renders correct submitted dates for all three candidates', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(document.body.textContent).toContain('21 May 2024');
    expect(document.body.textContent).toContain('20 May 2024');
    expect(document.body.textContent).toContain('18 May 2024');
  });

  it('renders correct locations for all three candidates', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(document.body.textContent).toContain('Dallas, TX');
    expect(document.body.textContent).toContain('Austin, TX');
    expect(document.body.textContent).toContain('Chicago, IL');
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

  // ── 10. Data contract — fails if mock data is changed ────────

  it('fails if GNANESH_MOCK_JOBS job titles are changed', () => {
    renderPage('1');
    expect(document.body.textContent).toContain('Full Stack Developer (3 Years Experience)');
    renderPage('3');
    expect(document.body.textContent).toContain('React UI Engineer');
    renderPage('7');
    expect(document.body.textContent).toContain('Business Systems Consultant');
  });

  it('fails if GNANESH_MOCK_JOBS location data is changed', () => {
    renderPage('1'); expect(document.body.textContent).toContain('Chennai');
    renderPage('2'); expect(document.body.textContent).toContain('Hyderabad');
    renderPage('3'); expect(document.body.textContent).toContain('Bengaluru');
    renderPage('4'); expect(document.body.textContent).toContain('Pune');
    renderPage('5'); expect(document.body.textContent).toContain('Mumbai');
    renderPage('6'); expect(document.body.textContent).toContain('Coimbatore');
    renderPage('7'); expect(document.body.textContent).toContain('Delhi');
  });

  it('fails if GNANESH_MOCK_JOBS client rates are changed', () => {
    renderPage('1'); expect(document.body.textContent).toContain('$60');
    renderPage('2'); expect(document.body.textContent).toContain('$72');
    renderPage('5'); expect(document.body.textContent).toContain('$95');
    renderPage('7'); expect(document.body.textContent).toContain('$105');
  });

  it('fails if GNANESH_CANDIDATE_ROWS names are changed', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(document.body.textContent).toContain('Arun Matheshwaran');
    expect(document.body.textContent).toContain('Meera Jamine');
    expect(document.body.textContent).toContain('Rohit Sharma');
  });

  it('fails if GNANESH_CANDIDATE_ROWS statuses are changed', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(document.body.textContent).toContain('Submitted');
    expect(document.body.textContent).toContain('Shortlisted');
    expect(document.body.textContent).toContain('Pipeline');
  });

  it('fails if GNANESH_CANDIDATE_ROWS dates are changed', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Matched Candidates/i }));
    expect(document.body.textContent).toContain('21 May 2024');
    expect(document.body.textContent).toContain('20 May 2024');
    expect(document.body.textContent).toContain('18 May 2024');
  });

});