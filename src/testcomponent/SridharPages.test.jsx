/**
 * Shared data contract for the Sridhar dashboard/detail/list flow.
 *
 * Page rendering is tested in:
 * - SridharDashboardPage.test.jsx
 * - SridharDetailPage.test.jsx
 */

import { MOCK_JOBS } from '../data/jobs';

describe('Sridhar jobs shared data contract', () => {
  it('MOCK_JOBS is a non-empty array', () => {
    expect(Array.isArray(MOCK_JOBS)).toBe(true);
    expect(MOCK_JOBS.length).toBeGreaterThan(0);
  });

  it('contains every field used by the list and detail screens', () => {
    MOCK_JOBS.forEach((job) => {
      expect(job).toEqual(expect.objectContaining({
        key: expect.any(String),
        id: expect.any(Number),
        title: expect.any(String),
        client: expect.any(String),
        location: expect.any(String),
        locationType: expect.any(String),
        experience: expect.any(String),
        employmentType: expect.any(String),
        clientRate: expect.any(Number),
        targetSub: expect.objectContaining({
          filled: expect.any(Number),
          total: expect.any(Number),
        }),
        pipeline: expect.any(Number),
        assignees: expect.any(Array),
        extraAssignees: expect.any(Number),
        status: expect.any(String),
        createdAt: expect.any(String),
        createdAgo: expect.any(String),
      }));
    });
  });

  it('every job key and id are unique', () => {
    const keys = MOCK_JOBS.map((job) => job.key);
    const ids = MOCK_JOBS.map((job) => job.id);

    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
