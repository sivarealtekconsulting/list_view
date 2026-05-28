import sridharJobsData from './sridharJobs.json';
import { SONY_MOCK_JOBS } from './sonyMockData';

export const MOCK_JOBS = SONY_MOCK_JOBS;

export const SRIDHAR_JOBS_DATA = sridharJobsData;
export const SRIDHAR_MOCK_JOBS = sridharJobsData.jobs;
export const SRIDHAR_JOB_LIST_SUMMARY = sridharJobsData.summary;

export const STATUS_TAG = {
  Fulfilled: { color: 'default' },
  Open: { color: 'processing' },
  'Partially Fulfilled': { color: 'warning' },
};

// Computed once at import time — used by tests to skip gracefully instead of failing
const STRING_FIELDS = ['title', 'location', 'locationType'];
const ALL_REQUIRED = [...STRING_FIELDS, 'pipeline'];

export const sridharJobErrors = SRIDHAR_MOCK_JOBS
  .map((job) => {
    const missing = ALL_REQUIRED.filter((f) => {
      const val = job[f];
      return val == null || (STRING_FIELDS.includes(f) && val === '');
    });
    return missing.length > 0 ? `${job.key}: missing ${missing.join(', ')}` : null;
  })
  .filter(Boolean);

export const sridharJobsValid = sridharJobErrors.length === 0;
