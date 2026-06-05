import { AUTH_URL, SUBMISSIONS_URL, fetchJsonWithAuth } from './dropdownApi';

const MODULE = 'submissions';

/**
 * Load select options for a field from the dropdown-values API.
 * Returns [{ label, value }, ...]
 */
export async function getFieldOptions(fieldKey, search = '') {
  const params = new URLSearchParams({ module: MODULE, field: fieldKey, value: search, limit: '100' });
  const json = await fetchJsonWithAuth(AUTH_URL, `/filter-dropdown-values?${params}`);
  const data = json?.data ?? json;
  return Array.isArray(data)
    ? data.map((d) => ({ label: String(d.label ?? d.value), value: d.value }))
    : [];
}

/**
 * Fetch form groups for the submissions module.
 * Returns groups sorted by order from /admin/form-groups?module=submissions
 */
export async function getSubmissionFormGroups() {
  const json = await fetchJsonWithAuth(AUTH_URL, '/admin/form-groups?module=submissions');
  const payload = json?.data;
  const groups = Array.isArray(payload) ? payload : Array.isArray(json) ? json : [];
  return [...groups].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Submit the form payload to the submissions service.
 */
export async function createSubmission(payload) {
  const json = await fetchJsonWithAuth(SUBMISSIONS_URL, '/submission/create-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return json;
}
