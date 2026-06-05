import { AUTH_URL, fetchJsonWithAuth } from './dropdownApi';

/**
 * Fetch all active modules from the modules collection.
 * Returns: [{ id, key, label, collectionName, order, isActive }, ...]
 */
export async function getModules() {
  const json = await fetchJsonWithAuth(AUTH_URL, '/admin/modules');
  const payload = json?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(json)) return json;
  return [];
}
