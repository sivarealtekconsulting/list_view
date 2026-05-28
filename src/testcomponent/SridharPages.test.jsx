/**
 * Shared data contract for the Sridhar dashboard/detail/list flow.
 *
 * This is the ONE test that fails when sridharJobs.json has missing/invalid
 * fields. All other test files skip automatically when data is invalid.
 *
 * Page rendering is tested in:
 * - SridharDashboardPage.test.jsx
 * - SridharDetailPage.test.jsx
 */

import { SRIDHAR_MOCK_JOBS, sridharJobErrors } from '../data/jobs';

describe('Sridhar jobs shared data contract', () => {
  it('SRIDHAR_MOCK_JOBS is a non-empty array', () => {
    expect(Array.isArray(SRIDHAR_MOCK_JOBS)).toBe(true);
    expect(SRIDHAR_MOCK_JOBS.length).toBeGreaterThan(0);
  });

  it('contains every required field with valid non-empty values', () => {
    if (sridharJobErrors.length > 0) {
      throw new Error(
        `Sridhar job data is missing required fields:\n${sridharJobErrors.join('\n')}`,
      );
    }
  });

  it('every job key and id are unique', () => {
    const keys = SRIDHAR_MOCK_JOBS.map((job) => job.key);
    const ids = SRIDHAR_MOCK_JOBS.map((job) => job.id);

    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
