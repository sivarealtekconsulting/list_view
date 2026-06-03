import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { login } from '../services/dropdownApi';
import GnaneshSubmissionsPage from '../pages/gnanesh-submissions';

// ─────────────────────────────────────────────────────────────
// Setup — login once before all tests
// ─────────────────────────────────────────────────────────────
beforeAll(async () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authTokenExpiry');
  await login();
});

afterEach(() => cleanup());

const renderPage = () =>
  render(
    <BrowserRouter>
      <GnaneshSubmissionsPage />
    </BrowserRouter>
  );

// ─────────────────────────────────────────────────────────────
// 1. Page Render
// ─────────────────────────────────────────────────────────────
describe('GnaneshSubmissionsPage – Page Render', () => {
  it('renders without crashing', () => {
    renderPage();
    expect(document.body).toBeInTheDocument();
  });

  it('renders breadcrumb with Home and Submissions', () => {
    renderPage();

    expect(screen.getAllByText(/^Home$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Submissions$/i).length).toBeGreaterThan(0);
  });

  it('renders submissions list view container', () => {
    renderPage();
    expect(screen.getByTestId('submissions-list-view')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// 2. Loading State
// ─────────────────────────────────────────────────────────────
describe('GnaneshSubmissionsPage – Loading State', () => {
  it('shows loading spinner while fetching', () => {
    renderPage();
    // Spinner should appear immediately before API resolves
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// 3. Tab Counts — from real API summary
// ─────────────────────────────────────────────────────────────
describe('GnaneshSubmissionsPage – Tab Counts', () => {
  it('renders All Submissions tab with count from API', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/All Submissions/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('renders Internal tab', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/^Internal$/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('renders Client Submissions tab', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Client Submissions/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('total submission count is greater than 0', async () => {
    renderPage();
    await waitFor(() => {
      // The badge count next to All Submissions tab should be > 0
      const badge = document.querySelector('.ant-badge-count');
      expect(badge).toBeTruthy();
      expect(parseInt(badge.textContent)).toBeGreaterThan(0);
    }, { timeout: 10000 });
  });
});

// ─────────────────────────────────────────────────────────────
// 4. Table Columns — column headers visible
// ─────────────────────────────────────────────────────────────
describe('GnaneshSubmissionsPage – Table Columns', () => {
  it('renders all expected column headers', async () => {
    renderPage();

    await waitFor(() => {
      const table = document.querySelector('.ant-table');
      expect(table).toBeInTheDocument();

      expect(table.textContent).toContain('Candidate Name');
      expect(table.textContent).toContain('Job Title');
      expect(table.textContent).toContain('Client');
      expect(table.textContent).toContain('Experience');
      expect(table.textContent).toContain('Work Auth');
      expect(table.textContent).toContain('Candidate Rate');
      expect(table.textContent).toContain('Proposed Rate');
      expect(table.textContent).toContain('Margin');
      expect(table.textContent).toContain('Internal Status');
      expect(table.textContent).toContain('Submission Status');
      expect(table.textContent).toContain('Submitted By');
      expect(table.textContent).toContain('Submitted At');
    }, { timeout: 10000 });
  });
});

// ─────────────────────────────────────────────────────────────
// 5. Real Data Renders — actual values from API
// ─────────────────────────────────────────────────────────────
describe('GnaneshSubmissionsPage – Real Data Renders', () => {
  it('renders candidate names from API', async () => {
    renderPage();
    await waitFor(() => {
      // First submission from real API is Suraj Manohar
      expect(document.body.textContent).toContain('Suraj Manohar');
    }, { timeout: 10000 });
  });

  it('renders job title from API', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('Full Stack Developer');
    }, { timeout: 10000 });
  });

  it('renders client name from API', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('TCS');
    }, { timeout: 10000 });
  });

  it('renders candidate rate in $/hr format', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('$54/hr');
    }, { timeout: 10000 });
  });

  it('renders proposed rate in $/hr format', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('$65/hr');
    }, { timeout: 10000 });
  });

  it('renders margin in $/hr format', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('$11/hr');
    }, { timeout: 10000 });
  });

  it('renders work authorisation from API', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('L2 EAD');
    }, { timeout: 10000 });
  });

  it('renders internal submission status from API', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('Under Evaluation');
    }, { timeout: 10000 });
  });

  it('renders submission status from API', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('Not Submitted');
    }, { timeout: 10000 });
  });

  it('renders submitted by from API', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('Admin Realtekh');
    }, { timeout: 10000 });
  });

  it('renders exactly 10 rows per page', async () => {
    renderPage();
    await waitFor(() => {
      const rows = document.querySelectorAll('.ant-table-row');
      expect(rows.length).toBe(10);
    }, { timeout: 10000 });
  });
});

// ─────────────────────────────────────────────────────────────
// 6. Toolbar
// ─────────────────────────────────────────────────────────────
describe('GnaneshSubmissionsPage – Toolbar', () => {
  it('renders View Summary button', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /View Summary/i })).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('renders Refresh button', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.querySelector('.anticon-reload')).toBeInTheDocument();
    }, { timeout: 10000 });
  });
});

// ─────────────────────────────────────────────────────────────
// 7. Pagination
// ─────────────────────────────────────────────────────────────
describe('GnaneshSubmissionsPage – Pagination', () => {
  it('renders pagination showing 1 - 10 of total', async () => {
    renderPage();
    await waitFor(() => {
      expect(document.body.textContent).toContain('Showing 1 - 10');
    }, { timeout: 10000 });
  });

  it('renders total count in pagination', async () => {
    renderPage();
    await waitFor(() => {
      // Total is 3005 from real API
      expect(document.body.textContent).toContain('3005');
    }, { timeout: 10000 });
  });
});