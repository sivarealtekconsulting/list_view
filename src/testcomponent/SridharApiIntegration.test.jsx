/**
 * SridharApiIntegration.test.jsx
 * --------------------------------
 * Real API integration tests — NO mocks, NO fake data.
 *
 * Flow:
 *   1. getJobs() / getHeaderFields() called against live server
 *   2. Auto-login happens via ensureToken() (credentials in dropdownApi.js)
 *   3. Real response scanned using strict live API field names
 *   4. Missing fields reported as a clear table — field name + count + sample IDs
 *
 * Strategies:
 *   RANDOM PAGE
 *     Fetches API_FETCH_LIMIT records, then picks a random contiguous slice.
 *     This tests a realistic "page" of real production data.
 *
 *   FIRST/MIDDLE/LAST
 *     Scans first 10 + middle 10 + last 10 records from the fetched batch.
 *     This catches boundary records and middle-page shape changes.
 *
 * On failure you will see:
 *
 *   API Field Coverage Report
 *   ────────────────────────────────────────────────────────────────────────
 *   Scanned : range [87–136] — 50 of 200 records
 *   Result  : ✗ 2 field(s) have gaps
 *   ────────────────────────────────────────────────────────────────────────
 *   FIELD                                            STATUS   MISSING
 *   ────────────────────────────────────────────────────────────────────────
 *   id / _id                  (job detail route)     ✓ OK
 *   title / jobTitle           (Jobs column)         ✓ OK
 *   clientRate / jobPayDetails (Client Rate column)  ✗ FAIL  8 / 50 (16.0%)
 *                                                    IDs: 5021, 5034, 5041 + 5 more
 *   status / jobStatus         (Status column)       ✗ FAIL  2 / 50 (4.0%)
 *                                                    IDs: 5028, 5099
 *
 * Note: Requires API server reachable at http://192.168.1.66.
 * If the server is not reachable, this file fails instead of silently passing.
 */

import { getJobs, getHeaderFields, AUTH_URL } from '../services/dropdownApi';
import {
  REQUIRED_LIVE_API_JOB_FIELDS,
  buildApiCoverageReport,
  buildHeaderFieldsReport,
  extractHeaderFieldsFromApiResponse,
  extractJobsFromApiResponse,
} from './listViewTestContracts';

// ── Config ────────────────────────────────────────────────────────────────────

const RANDOM_PAGE_SAMPLE_SIZE = 50;   // records to scan for a random API page
const FIRST_MIDDLE_LAST_SIZE  = 30;   // first 10 + middle 10 + last 10
const API_FETCH_LIMIT         = 200;  // records to pull from API before sampling
const HEADER_USER_ID    = 2;
const HEADER_ROLE_ID    = 5;
const HEADER_MODULE     = 'jobs';
const JOBS_API_URL = 'http://192.168.1.66/jobsapi/v1/jobs';
const HEADER_FIELDS_API_URL = `${AUTH_URL}/admin/field-config`;
const AUTH_LOGIN_API_URL = `${AUTH_URL}/login`;

// ── Network check ─────────────────────────────────────────────────────────────

// Checks once if the API server is reachable before running any test.
// If not reachable, fail loudly because this file is meant to test the real API.

let apiReachabilityError = null;

beforeAll(async () => {
  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', user_pwd: '' }),
    });
    await res.text();
    apiReachabilityError = null;
  } catch (error) {
    apiReachabilityError = error;
  }
}, 8000);

// ── Tests ─────────────────────────────────────────────────────────────────────

function assertApiReachable() {
  if (!apiReachabilityError) return;

  throw new Error(
    [
      'Real API integration test did not run.',
      'API server is not reachable at http://192.168.1.66.',
      `Reachability endpoint: POST ${AUTH_LOGIN_API_URL}`,
      'Run this test from the same network as the API, then run:',
      'npm test -- --run src/testcomponent/SridharApiIntegration.test.jsx',
      `Original error: ${apiReachabilityError.message}`,
    ].join('\n'),
  );
}

function buildUrl(url, params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  return `${url}?${searchParams.toString()}`;
}

function buildJobsEndpoint(params) {
  return buildUrl(JOBS_API_URL, {
    jobStatus: params.jobStatus ?? 'active',
    jobRecruitmentStatus: params.jobRecruitmentStatus ?? 'unread',
    limit: params.limit,
    offset: params.offset ?? 0,
    userId: params.userId ?? 1,
    sortBy: params.sortBy ?? 'id',
  });
}

function buildHeaderFieldsEndpoint() {
  return buildUrl(HEADER_FIELDS_API_URL, {
    userId: HEADER_USER_ID,
    roleId: HEADER_ROLE_ID,
    module: HEADER_MODULE,
  });
}

async function fetchJobsOrFail(params) {
  assertApiReachable();

  const endpoint = buildJobsEndpoint(params);
  console.log(`\nAPI endpoint under test:\n  GET ${endpoint}`);

  const response = await getJobs(params);
  const jobs = extractJobsFromApiResponse(response);

  if (jobs.length === 0) {
    throw new Error(
      [
        `API endpoint under test: GET ${endpoint}`,
        `getJobs() returned 0 records for params: ${JSON.stringify(params)}`,
        'Check credentials, API filters, and whether this job status has data.',
        `Raw response: ${JSON.stringify(response, null, 2)}`,
      ].join('\n'),
    );
  }

  return { endpoint, response, jobs };
}

function assertJobsCoverage(jobs, options, endpoint) {
  const { allPassed, report, scannedCount } = buildApiCoverageReport(
    jobs,
    REQUIRED_LIVE_API_JOB_FIELDS,
    options,
  );

  if (!allPassed) {
    throw new Error(
      [
        '',
        `  API endpoint under test: GET ${endpoint}`,
        report,
      ].join('\n'),
    );
  }

  return scannedCount;
}

describe('Sridhar API — real API integration', () => {

  it(
    'getJobs() active — random API page has all required fields',
    async () => {
      const { endpoint, jobs } = await fetchJobsOrFail({
        jobStatus: 'active',
        limit: API_FETCH_LIMIT,
        offset: 0,
      });

      const scannedCount = assertJobsCoverage(
        jobs,
        { sampleSize: RANDOM_PAGE_SAMPLE_SIZE, sampleStrategy: 'range' },
        endpoint,
      );

      console.log(
        `\nJobs API — fetched ${jobs.length} records, random-page scanned ${scannedCount}\nEndpoint: GET ${endpoint}`
      );

    },
    30000 // 30s — real network call needs more time
  );

  it(
    'getJobs() all — first 10 + middle 10 + last 10 have all required fields',
    async () => {
      const { endpoint, jobs } = await fetchJobsOrFail({
        jobStatus: 'all',
        limit: API_FETCH_LIMIT,
        offset: 0,
      });

      const scannedCount = assertJobsCoverage(
        jobs,
        { sampleSize: FIRST_MIDDLE_LAST_SIZE, sampleStrategy: 'firstMiddleLast' },
        endpoint,
      );

      console.log(
        `\nJobs API (all) — fetched ${jobs.length} records, first/middle/last scanned ${scannedCount}\nEndpoint: GET ${endpoint}`
      );
    },
    30000
  );

  it(
    'getJobs() active — first 10 + middle 10 + last 10 have all required fields',
    async () => {
      const { endpoint, jobs } = await fetchJobsOrFail({
        jobStatus: 'active',
        limit: API_FETCH_LIMIT,
        offset: 0,
      });

      const scannedCount = assertJobsCoverage(
        jobs,
        { sampleSize: FIRST_MIDDLE_LAST_SIZE, sampleStrategy: 'firstMiddleLast' },
        endpoint,
      );

      console.log(
        `\nJobs API (active) — fetched ${jobs.length} records, first/middle/last scanned ${scannedCount}\nEndpoint: GET ${endpoint}`
      );
    },
    30000
  );

  it(
    'getHeaderFields() — all required column keys present in API response',
    async () => {
      assertApiReachable();

      const endpoint = buildHeaderFieldsEndpoint();
      console.log(`\nAPI endpoint under test:\n  GET ${endpoint}`);

      const response = await getHeaderFields(HEADER_USER_ID, HEADER_ROLE_ID, HEADER_MODULE);

      const fields = extractHeaderFieldsFromApiResponse(response);

      if (fields.length === 0) {
        throw new Error(
          `API endpoint under test: GET ${endpoint}\n` +
          `getHeaderFields() returned 0 fields.\n` +
          `Raw response: ${JSON.stringify(response, null, 2)}`
        );
      }

      const { allPassed, report } = buildHeaderFieldsReport(fields);

      console.log(`\nHeader fields API — ${fields.length} fields returned\nEndpoint: GET ${endpoint}`);

      if (!allPassed) {
        throw new Error(
          [
            '',
            `  API endpoint under test: GET ${endpoint}`,
            report,
          ].join('\n'),
        );
      }
    },
    15000
  );

  it(
    'getJobs() raw response shape — logs actual structure for debugging',
    async () => {
      const { endpoint, jobs } = await fetchJobsOrFail({
        jobStatus: 'active',
        limit: 5,   // just 5 to inspect structure
        offset: 0,
      });

      // Always passes — just logs the actual field names of the first job
      // so you know exactly what the API returns
      if (jobs.length > 0) {
        const firstJobKeys = Object.keys(jobs[0]);
        console.log(`\nRaw response endpoint:\n  GET ${endpoint}`);
        console.log(`\nFirst job field names from API:\n  ${firstJobKeys.join('\n  ')}`);
        console.log(`\nFirst job sample:\n${JSON.stringify(jobs[0], null, 2)}`);
      } else {
        console.log('\nNo jobs returned from API');
      }

      // This test always passes — it's for inspection only
      expect(true).toBe(true);
    },
    15000
  );
});
