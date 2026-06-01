/**
 * Shared data contract for the Sridhar dashboard/detail/list flow.
 *
 * This is the ONE place that fails when sridharDashboardData.json has
 * missing or empty fields.  All other test files use describe.skipIf()
 * so they stay green instead of cascading when data is broken.
 *
 * Page rendering is tested in:
 * - SridharDashboardPage.test.jsx
 * - SridharDetailPage.test.jsx
 */

import { SRIDHAR_MOCK_JOBS, sridharJobErrors, sridharDashboardErrors } from '../data/jobs';

describe('Sridhar jobs data contract', () => {
  it('SRIDHAR_MOCK_JOBS is a non-empty array', () => {
    expect(Array.isArray(SRIDHAR_MOCK_JOBS)).toBe(true);
    expect(SRIDHAR_MOCK_JOBS.length).toBeGreaterThan(0);
  });

  it('every job has required fields with valid non-empty values', () => {
    if (sridharJobErrors.length > 0) {
      throw new Error(
        `Sridhar job data is missing required fields:\n${sridharJobErrors.join('\n')}`,
      );
    }
  });

  it('every job key and id are unique', () => {
    const keys = SRIDHAR_MOCK_JOBS.map((job) => job.key);
    const ids  = SRIDHAR_MOCK_JOBS.map((job) => job.id);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Sridhar dashboard data contract', () => {
  it('all dashboard sections (stats, calendar, detail) have required fields', () => {
    if (sridharDashboardErrors.length > 0) {
      throw new Error(
        `Dashboard data is missing required fields:\n${sridharDashboardErrors.join('\n')}`,
      );
    }
  });
});
