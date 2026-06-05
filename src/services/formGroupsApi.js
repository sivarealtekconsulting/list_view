import { AUTH_URL, fetchJsonWithAuth } from './dropdownApi';

const FORM_GROUPS_PATH = '/admin/form-groups';

/**
 * Fetch all available fields for a module from the field list API.
 * Returns: [{ label, value, type, group, isVisible }, ...]
 */
export async function getModuleFields(module) {
  const json = await fetchJsonWithAuth(AUTH_URL, `/filter-dropdown-fields?module=${encodeURIComponent(module)}`);
  const fields = json.data ?? json;
  return Array.isArray(fields) ? fields : [];
}

/**
 * Fetch form groups for a specific module.
 * Pass module = '' to fetch all groups (used by the "All" tab).
 */
export async function getFormGroups(module = '') {
  const path = module
    ? `${FORM_GROUPS_PATH}?module=${encodeURIComponent(module)}`
    : FORM_GROUPS_PATH;

  const json = await fetchJsonWithAuth(AUTH_URL, path);
  const payload = json?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(json)) return json;
  return [];
}

export async function createFormGroup(group) {
  const json = await fetchJsonWithAuth(AUTH_URL, FORM_GROUPS_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  });
  return json;
}

export async function updateFormGroup(id, group) {
  const json = await fetchJsonWithAuth(AUTH_URL, `${FORM_GROUPS_PATH}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  });
  return json;
}

export async function deleteFormGroup(id) {
  const json = await fetchJsonWithAuth(AUTH_URL, `${FORM_GROUPS_PATH}/${id}`, {
    method: 'DELETE',
  });
  return json;
}

export async function seedFormGroups() {
  const json = await fetchJsonWithAuth(AUTH_URL, `${FORM_GROUPS_PATH}/seed`, {
    method: 'POST',
  });
  return json;
}
