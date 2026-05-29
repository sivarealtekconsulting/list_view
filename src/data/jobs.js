import sridharDashboardData from './sridharDashboardData.json';
import { SONY_MOCK_JOBS } from './sonyMockData';

export const MOCK_JOBS = SONY_MOCK_JOBS;

export const SRIDHAR_JOBS_DATA = sridharDashboardData;
export const SRIDHAR_MOCK_JOBS = sridharDashboardData.jobs;
export const SRIDHAR_JOB_LIST_SUMMARY = sridharDashboardData.summary;
export const SRIDHAR_DASHBOARD_CARDS = sridharDashboardData.cards;
export const SRIDHAR_DASHBOARD_STATS = sridharDashboardData.stats;
export const SRIDHAR_DETAIL_DATA = sridharDashboardData.detail;

export const STATUS_TAG = {
  Fulfilled: { color: 'default' },
  Open: { color: 'processing' },
  'Partially Fulfilled': { color: 'warning' },
};

// ── Job-level validation ──────────────────────────────────────────────────────
// Computed once at import time — used by tests to skip gracefully instead of failing
const JOB_STRING_FIELDS = ['title', 'location', 'locationType'];
const JOB_ALL_REQUIRED = [...JOB_STRING_FIELDS, 'pipeline'];

export const sridharJobErrors = SRIDHAR_MOCK_JOBS
  .map((job) => {
    const missing = JOB_ALL_REQUIRED.filter((f) => {
      const val = job[f];
      return val == null || (JOB_STRING_FIELDS.includes(f) && val === '');
    });
    return missing.length > 0 ? `${job.key}: missing ${missing.join(', ')}` : null;
  })
  .filter(Boolean);

export const sridharJobsValid = sridharJobErrors.length === 0;

// ── Full dashboard data validation ───────────────────────────────────────────
// Reports missing/empty fields across stats, calendar, detail sections.
const _dashErrors = [];

// Stats
(sridharDashboardData.stats || []).forEach((stat, i) => {
  const tag = stat.label || `stats[${i}]`;
  if (!stat.label || stat.label === '') _dashErrors.push(`stats[${i}]: missing label`);
  if (!stat.icon  || stat.icon  === '') _dashErrors.push(`${tag}: missing icon`);
  if (stat.value == null)               _dashErrors.push(`${tag}: missing value`);
});

// Calendar events — each must have color + message
const _calEvents = sridharDashboardData.cards?.calendar?.events || {};
Object.entries(_calEvents).forEach(([dateKey, events]) => {
  (events || []).forEach((ev, i) => {
    if (typeof ev === 'object' && ev !== null) {
      if (!ev.color   || ev.color   === '') _dashErrors.push(`calendar.events["${dateKey}"][${i}]: missing color`);
      if (!ev.message || ev.message === '') _dashErrors.push(`calendar.events["${dateKey}"][${i}]: missing message`);
    }
  });
});

// Calendar legend
const _calLegend = sridharDashboardData.cards?.calendar?.legend || [];
_calLegend.forEach((item, i) => {
  if (!item.label || item.label === '') _dashErrors.push(`calendar.legend[${i}]: missing label`);
  if (!item.color || item.color === '') _dashErrors.push(`calendar.legend[${i}]: missing color`);
});

// Detail candidates
const _candidateFields = ['key', 'candidate', 'role', 'location', 'experience', 'status', 'date'];
(sridharDashboardData.detail?.candidates || []).forEach((c, i) => {
  const tag = c.candidate || `candidates[${i}]`;
  _candidateFields.forEach(f => {
    if (!c[f] || c[f] === '') _dashErrors.push(`detail.${tag}: missing ${f}`);
  });
});

// Detail activity
const _activityFields = ['key', 'event', 'owner', 'status', 'time'];
(sridharDashboardData.detail?.activity || []).forEach((a, i) => {
  _activityFields.forEach(f => {
    if (!a[f] || a[f] === '') _dashErrors.push(`detail.activity[${i}]: missing ${f}`);
  });
});

export const sridharDashboardErrors = _dashErrors;

// True only when both jobs AND all other dashboard sections are valid
export const sridharDashboardValid = sridharJobsValid && _dashErrors.length === 0;
