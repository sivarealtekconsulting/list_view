import gnaneshDashboardData from './gnaneshDashboardData.json';
import gnaneshDetailData from './gnaneshDetailData.json';
import sridharDashboardData from './sridharDashboardData.json';
import pugalDashboard from './pug-data.json'
import { SONY_MOCK_JOBS } from './sonyMockData';


export const MOCK_JOBS = SONY_MOCK_JOBS;

export const SRIDHAR_JOBS_DATA = sridharDashboardData;
export const SRIDHAR_MOCK_JOBS = sridharDashboardData.jobs;
export const SRIDHAR_JOB_LIST_SUMMARY = sridharDashboardData.summary;
export const SRIDHAR_DASHBOARD_CARDS = sridharDashboardData.cards;
export const SRIDHAR_DASHBOARD_STATS = sridharDashboardData.stats;
export const SRIDHAR_DETAIL_DATA = sridharDashboardData.detail;

// export const PUG_DASHBOARD_STATS = pugalDashboard.stats;

export const PUG_DASHBOARD_JOBS_DATA = pugalDashboard;
export const PUG_DASHBOARD_MOCK_JOBS = pugalDashboard.jobs;
export const PUG_DASHBOARD_JOB_LIST_SUMMARY = pugalDashboard.summary;
export const PUG_DASHBOARD_DASHBOARD_CARDS = pugalDashboard.cards;
export const PUG_DASHBOARD_STATS = pugalDashboard.stats;
export const PUG_DASHBOARD_DETAIL_DATA = pugalDashboard.detail;


export const GNANESH_JOBS_DATA = gnaneshDashboardData;
export const GNANESH_MOCK_JOBS = gnaneshDashboardData.jobs || [];
export const GNANESH_JOB_LIST_SUMMARY = gnaneshDashboardData.summary || {
  myJobsCount: 0,
  allJobsCount: 0,
};
export const GNANESH_DASHBOARD_CARDS = gnaneshDashboardData.cards || [];
export const GNANESH_DASHBOARD_STATS = gnaneshDashboardData.stats || [];
export const GNANESH_DETAIL_DATA = gnaneshDashboardData.detail || {};

export const GNANESH_CANDIDATE_ROWS =
  gnaneshDetailData.candidates ||
  gnaneshDetailData.candidateRows ||
  gnaneshDetailData.matchedCandidates ||
  [];


export const STATUS_TAG = {
  Fulfilled: { color: 'default' },
  Open: { color: 'processing' },
  'Partially Fulfilled': { color: 'warning' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const _requireString = (errors, tag, field, value) => {
  if (value == null || value === '') errors.push(`${tag}: missing ${field}`);
};
const _requireNumber = (errors, tag, field, value) => {
  if (value == null || typeof value !== 'number') errors.push(`${tag}: missing ${field}`);
};

// ── Job-level validation ──────────────────────────────────────────────────────
const JOB_STRING_FIELDS = [
  'key', 'title', 'location', 'locationType', 'experience',
  'employmentType', 'status', 'createdAt', 'createdAgo', 'client',
];
const JOB_NUMBER_FIELDS = ['id', 'clientRate', 'pipeline', 'extraAssignees'];

export const sridharJobErrors = SRIDHAR_MOCK_JOBS
  .map((job) => {
    const errs = [];
    const tag = job.key || `job[?]`;
    JOB_STRING_FIELDS.forEach((f) => _requireString(errs, tag, f, job[f]));
    JOB_NUMBER_FIELDS.forEach((f) => _requireNumber(errs, tag, f, job[f]));

    if (!job.targetSub || job.targetSub.filled == null) errs.push(`${tag}: missing targetSub.filled`);
    if (!job.targetSub || job.targetSub.total  == null) errs.push(`${tag}: missing targetSub.total`);

    if (job.hasBookmark == null) errs.push(`${tag}: missing hasBookmark`);
    if (job.hasLinkedIn == null) errs.push(`${tag}: missing hasLinkedIn`);

    if (!Array.isArray(job.assignees) || job.assignees.length === 0) {
      errs.push(`${tag}: missing assignees`);
    } else {
      job.assignees.forEach((a, ai) => {
        _requireString(errs, `${tag}.assignees[${ai}]`, 'initials', a.initials);
        _requireString(errs, `${tag}.assignees[${ai}]`, 'color',    a.color);
      });
    }

    return errs.length > 0 ? errs.join('\n') : null;
  })
  .filter(Boolean);

export const sridharJobsValid = sridharJobErrors.length === 0;
export {
  PUGAZH_MOCK_JOBS,
  PUGAZH_STATUS_TAG,
  ONBOARDING_STATS,
  JOB_STATS,
  CLIENT_SUBMISSION_STATS,
  CALENDAR_EVENTS,
  CALENDAR_LEGEND,
  STICKY_NOTES,
  FORM_OPTIONS,
  MOCK_CANDIDATES,
  MOCK_CLIENTS,
} from './pugazhJobs';