import { describe, it, expect, beforeAll } from 'vitest';
import { login, getSubmissions } from '../services/dropdownApi';

// ─────────────────────────────────────────────────────────────
// Setup — login once before all tests
// ─────────────────────────────────────────────────────────────
beforeAll(async () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authTokenExpiry');
  await login();
});

// ─────────────────────────────────────────────────────────────
// 1. Login & Auth
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Auth', () => {
  it('login returns a valid token', async () => {
    const token = localStorage.getItem('authToken');
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
  });
});

// ─────────────────────────────────────────────────────────────
// 2. API Response Structure
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Response Structure', () => {
  let result;

  beforeAll(async () => {
    result = await getSubmissions({ limit: 10, offset: 0 });
  });

  it('returns a result object', () => {
    expect(result).toBeTruthy();
    expect(typeof result).toBe('object');
  });

  it('returns a submissions array', () => {
    expect(Array.isArray(result.submissions)).toBe(true);
  });

  it('returns exactly 10 submissions per page', () => {
    expect(result.submissions.length).toBe(10);
  });

  it('returns a summary object', () => {
    expect(result.summary).toBeTruthy();
    expect(typeof result.summary).toBe('object');
  });

  it('returns totalSubmissionCount greater than 0', () => {
    expect(result.summary.totalSubmissionCount).toBeGreaterThan(0);
  });

  it('returns totalInternalSubmissionCount as a number', () => {
    expect(typeof result.summary.totalInternalSubmissionCount).toBe('number');
  });

  it('returns totalClientSubmissionCount as a number', () => {
    expect(typeof result.summary.totalClientSubmissionCount).toBe('number');
  });

  it('returns pagination object', () => {
    expect(result.pagination).toBeTruthy();
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.offset).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
// 3. Mandatory Fields — every submission must have these
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Mandatory Fields', () => {
  let submissions;

  beforeAll(async () => {
    const result = await getSubmissions({ limit: 10, offset: 0 });
    submissions = result.submissions;
  });

  it('every submission has a non-empty _id / key', () => {
    submissions.forEach((s, i) => {
      expect(s.key, `submission[${i}] missing key`).toBeTruthy();
    });
  });

  it('every submission has a non-empty candidateName', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.candidateName, `submission[${i}] candidateName wrong type`).toBe('string');
      expect(s.candidateName.length, `submission[${i}] candidateName is empty`).toBeGreaterThan(0);
    });
  });

  it('every submission has a non-empty jobTitle', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.jobTitle, `submission[${i}] jobTitle wrong type`).toBe('string');
      expect(s.jobTitle.length, `submission[${i}] jobTitle is empty`).toBeGreaterThan(0);
    });
  });

  it('every submission has a non-empty clientName', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.clientName, `submission[${i}] clientName wrong type`).toBe('string');
      expect(s.clientName.length, `submission[${i}] clientName is empty`).toBeGreaterThan(0);
    });
  });

  it('every submission has a submittedBy field', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.submittedBy, `submission[${i}] submittedBy wrong type`).toBe('string');
    });
  });

  it('every submission has a submittedAt field', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.submittedAt, `submission[${i}] submittedAt wrong type`).toBe('string');
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 4. Field Type Validation
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Field Types', () => {
  let submissions;

  beforeAll(async () => {
    const result = await getSubmissions({ limit: 10, offset: 0 });
    submissions = result.submissions;
  });

  it('acceptedRate is a number for all submissions', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.acceptedRate, `submission[${i}] acceptedRate wrong type`).toBe('number');
    });
  });

  it('proposedRate is a number for all submissions', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.proposedRate, `submission[${i}] proposedRate wrong type`).toBe('number');
    });
  });

  it('margin is a number for all submissions', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.margin, `submission[${i}] margin wrong type`).toBe('number');
    });
  });

  it('internalStatus is a string for all submissions', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.internalStatus, `submission[${i}] internalStatus wrong type`).toBe('string');
    });
  });

  it('submissionStatus is a string for all submissions', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.submissionStatus, `submission[${i}] submissionStatus wrong type`).toBe('string');
    });
  });

  it('workAuthorisation is a string for all submissions', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.workAuthorisation, `submission[${i}] workAuthorisation wrong type`).toBe('string');
    });
  });

  it('experience is a string for all submissions', () => {
    submissions.forEach((s, i) => {
      expect(typeof s.experience, `submission[${i}] experience wrong type`).toBe('string');
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 5. Pagination
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Pagination', () => {
  it('page 1 and page 2 return different records', async () => {
    const page1 = await getSubmissions({ limit: 10, offset: 0 });
    const page2 = await getSubmissions({ limit: 10, offset: 10 });

    const page1Ids = page1.submissions.map(s => s.key);
    const page2Ids = page2.submissions.map(s => s.key);

    // No overlap between pages
    const overlap = page1Ids.filter(id => page2Ids.includes(id));
    expect(overlap.length).toBe(0);
  });

  it('offset 0 returns first 10 records', async () => {
    const result = await getSubmissions({ limit: 10, offset: 0 });
    expect(result.submissions.length).toBe(10);
    expect(result.pagination.offset).toBe(0);
  });

  it('offset 10 returns next 10 records', async () => {
    const result = await getSubmissions({ limit: 10, offset: 10 });
    expect(result.submissions.length).toBe(10);
    expect(result.pagination.offset).toBe(10);
  });
});

// ─────────────────────────────────────────────────────────────
// 6. Data Integrity
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Data Integrity', () => {
  let submissions;

  beforeAll(async () => {
    const result = await getSubmissions({ limit: 10, offset: 0 });
    submissions = result.submissions;
  });

  it('no two submissions have the same key', () => {
    const keys = submissions.map(s => s.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('proposedRate is always greater than or equal to acceptedRate', () => {
    submissions.forEach((s, i) => {
      expect(
        s.proposedRate,
        `submission[${i}] proposedRate (${s.proposedRate}) < acceptedRate (${s.acceptedRate})`
      ).toBeGreaterThanOrEqual(s.acceptedRate);
    });
  });

  it('margin equals proposedRate minus acceptedRate', () => {
    submissions.forEach((s, i) => {
      const expected = s.proposedRate - s.acceptedRate;
      expect(
        s.margin,
        `submission[${i}] margin mismatch: expected ${expected}, got ${s.margin}`
      ).toBe(expected);
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 7. Query Params — correct params are sent to the API
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Query Params', () => {
  it('sends correct tenantId, businessId, businessUnitId and returns data', async () => {
    const result = await getSubmissions({
      tenantId: '93c782a4aa626175e5d11afa',
      businessId: '83c782a4aa626175e5d11afa',
      businessUnitId: '63b57588fd768a839dbc0f63',
      userId: 12,
      limit: 10,
      offset: 0,
    });
    expect(result.submissions.length).toBeGreaterThan(0);
  });

  it('submissionViewType=candidates returns submissions', async () => {
    const result = await getSubmissions({
      submissionViewType: 'candidates',
      limit: 10,
      offset: 0,
    });
    expect(Array.isArray(result.submissions)).toBe(true);
    expect(result.submissions.length).toBeGreaterThan(0);
  });

  it('different limit returns correct number of records', async () => {
    const result = await getSubmissions({ limit: 5, offset: 0 });
    expect(result.submissions.length).toBe(5);
  });
});

// ─────────────────────────────────────────────────────────────
// 8. Count Integrity
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Count Integrity', () => {
  let summary;

  beforeAll(async () => {
    const result = await getSubmissions({ limit: 10, offset: 0 });
    summary = result.summary;
  });

  it('filteredSubmissionCount equals totalSubmissionCount when no filter applied', async () => {
    // Hit raw API to check count fields directly
    const token = localStorage.getItem('authToken');
    const res = await fetch(
      'http://192.168.1.66/submissionsapi/v1/submissions?tenantId=93c782a4aa626175e5d11afa&businessId=83c782a4aa626175e5d11afa&businessUnitId=63b57588fd768a839dbc0f63&userId=12&sourceType=&submissionViewType=candidates&offset=0&limit=10',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    const json = await res.json();
    const count = json.data?.count ?? json.count;
    expect(count.filteredSubmissionCount).toBe(count.totalSubmissionCount);
  });

  it('totalSubmissionCount equals internal + client submission counts', () => {
    expect(summary.totalSubmissionCount).toBe(
      summary.totalInternalSubmissionCount + summary.totalClientSubmissionCount
    );
  });

  it('totalSubmissionCount is consistent across multiple calls', async () => {
    const result1 = await getSubmissions({ limit: 10, offset: 0 });
    const result2 = await getSubmissions({ limit: 10, offset: 0 });
    expect(result1.summary.totalSubmissionCount).toBe(result2.summary.totalSubmissionCount);
  });
});

// ─────────────────────────────────────────────────────────────
// 9. Token Expiry Handling
// ─────────────────────────────────────────────────────────────
describe('Submissions API – Token Handling', () => {
  it('clears expired token and re-fetches successfully', async () => {
    // Simulate expired token
    localStorage.setItem('authToken', 'expired-token-xyz');
    localStorage.setItem('authTokenExpiry', String(Date.now() - 1000));

    // Should auto re-login and succeed
    const result = await getSubmissions({ limit: 10, offset: 0 });
    expect(result.submissions.length).toBeGreaterThan(0);

    // Token should be refreshed
    const newToken = localStorage.getItem('authToken');
    expect(newToken).not.toBe('expired-token-xyz');
    expect(newToken).toBeTruthy();
  });
});