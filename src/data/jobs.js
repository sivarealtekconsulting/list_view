import sridharDashboardData from './sridharDashboardData.json';
import { SONY_MOCK_JOBS } from './sonyMockData';
import { Ashick_Mock_Data } from './ashickMockData';

export const MOCK_JOBS = SONY_MOCK_JOBS;

export const SRIDHAR_JOBS_DATA = sridharDashboardData;
export const SRIDHAR_MOCK_JOBS = sridharDashboardData.jobs;
export const SRIDHAR_JOB_LIST_SUMMARY = sridharDashboardData.summary;
export const SRIDHAR_DASHBOARD_CARDS = sridharDashboardData.cards;
export const SRIDHAR_DASHBOARD_STATS = sridharDashboardData.stats;
export const SRIDHAR_DETAIL_DATA = sridharDashboardData.detail;
export const ASHICK_DETAILED_DATA = Ashick_Mock_Data;

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

// ── Full dashboard data validation ───────────────────────────────────────────
const _dashErrors = [];

// Summary
_requireNumber(_dashErrors, 'summary', 'myJobsCount', sridharDashboardData.summary?.myJobsCount);
_requireNumber(_dashErrors, 'summary', 'allJobsCount', sridharDashboardData.summary?.allJobsCount);

// Stats
(sridharDashboardData.stats || []).forEach((stat, i) => {
  const tag = stat.label || `stats[${i}]`;
  _requireString(_dashErrors, `stats[${i}]`, 'label', stat.label);
  _requireString(_dashErrors, tag,           'icon',  stat.icon);
  _requireNumber(_dashErrors, tag,           'value', stat.value);
});

// Calendar events — each must have color + message
const _calEvents = sridharDashboardData.cards?.calendar?.events || {};
Object.entries(_calEvents).forEach(([dateKey, events]) => {
  (events || []).forEach((ev, i) => {
    const tag = `calendar.events["${dateKey}"][${i}]`;
    _requireString(_dashErrors, tag, 'color',   ev?.color);
    _requireString(_dashErrors, tag, 'message', ev?.message);
  });
});

// Calendar legend
const _calLegend = sridharDashboardData.cards?.calendar?.legend || [];
_calLegend.forEach((item, i) => {
  _requireString(_dashErrors, `calendar.legend[${i}]`, 'label', item.label);
  _requireString(_dashErrors, `calendar.legend[${i}]`, 'color', item.color);
});

// Detail — summaryText
_requireString(_dashErrors, 'detail', 'summaryText', sridharDashboardData.detail?.summaryText);

// Detail — skills
if (!Array.isArray(sridharDashboardData.detail?.skills) || sridharDashboardData.detail.skills.length === 0) {
  _dashErrors.push('detail: missing skills array');
} else {
  sridharDashboardData.detail.skills.forEach((s, i) => {
    _requireString(_dashErrors, `detail.skills[${i}]`, 'value', s);
  });
}

// Detail — candidates
const _candidateFields = ['key', 'candidate', 'role', 'location', 'experience', 'status', 'date'];
(sridharDashboardData.detail?.candidates || []).forEach((c, i) => {
  const tag = c.candidate || `candidates[${i}]`;
  _candidateFields.forEach((f) => _requireString(_dashErrors, `detail.${tag}`, f, c[f]));
});

// Detail — activity
const _activityFields = ['key', 'event', 'owner', 'status', 'time'];
(sridharDashboardData.detail?.activity || []).forEach((a, i) => {
  _activityFields.forEach((f) => _requireString(_dashErrors, `detail.activity[${i}]`, f, a[f]));
});

// Cards — clientSubmission
const _cs = sridharDashboardData.cards?.clientSubmission;
_requireNumber(_dashErrors, 'cards.clientSubmission', 'total', _cs?.total);
(_cs?.rows || []).forEach((row, i) => {
  const tag = `cards.clientSubmission.rows[${i}]`;
  _requireString(_dashErrors, tag, 'label',    row.label);
  _requireNumber(_dashErrors, tag, 'value',    row.value);
  _requireString(_dashErrors, tag, 'barColor', row.barColor);
});

// Cards — onboarding
(sridharDashboardData.cards?.onboarding || []).forEach((item, i) => {
  const tag = `cards.onboarding[${i}]`;
  _requireString(_dashErrors, tag, 'label', item.label);
  _requireNumber(_dashErrors, tag, 'value', item.value);
  _requireString(_dashErrors, tag, 'sub',   item.sub);
  _requireString(_dashErrors, tag, 'color', item.color);
});

// Cards — stickyNotes (dot/date are optional and may be null)
const _stickyRequired = ['type', 'pill', 'heading', 'body', 'footerLeft', 'footerRight'];
(sridharDashboardData.cards?.stickyNotes || []).forEach((note, i) => {
  const tag = `cards.stickyNotes[${i}]`;
  _stickyRequired.forEach((f) => _requireString(_dashErrors, tag, f, note[f]));
});

// Cards — clientDetails
const _cd = sridharDashboardData.cards?.clientDetails;
_requireString(_dashErrors, 'cards.clientDetails', 'subtitle',   _cd?.subtitle);
_requireString(_dashErrors, 'cards.clientDetails', 'helperText', _cd?.helperText);
const _cdValueFields = ['clientName', 'clientReqId', 'contactPerson', 'endClient', 'clientLocation', 'accountManager'];
_cdValueFields.forEach((f) => _requireString(_dashErrors, 'cards.clientDetails.values', f, _cd?.values?.[f]));
_cdValueFields.forEach((f) => {
  if (!Array.isArray(_cd?.options?.[f]) || _cd.options[f].length === 0) {
    if (['clientName', 'contactPerson', 'accountManager'].includes(f)) {
      _dashErrors.push(`cards.clientDetails.options: missing ${f}`);
    }
  }
});

export const sridharDashboardErrors = _dashErrors;

// True only when both jobs AND all other dashboard sections are valid
export const sridharDashboardValid = sridharJobsValid && _dashErrors.length === 0;
