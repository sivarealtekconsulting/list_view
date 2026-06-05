import { AUTH_URL, fetchJsonWithAuth } from './dropdownApi';

const FIELD_CONFIG_PATH = '/admin/field-config';

const CUSTOMIZABLE_MODULES = [
  { key: 'job', apiModule: 'jobs' },
  { key: 'candidate', apiModule: 'candidates' },
  { key: 'submissions', apiModule: 'submissions' },
];

function firstArray(...values) {
  return values.find(Array.isArray) ?? [];
}

function firstValue(record, keys, fallback) {
  return keys.map((k) => record?.[k]).find((v) => v !== undefined && v !== null && v !== '') ?? fallback;
}

// ─── Roles ─────────────────────────────────────────────────────────────────
// GET /get-roles
// Response: { data: { zinnext_default: [...], custom_roles: [...] } }
// Each item: { id, role_id, role_name, role_description, role_type, user_count }
// role_type: 0 = Zinnext default, 1 = custom

function normalizeRole(record) {
  return {
    key: record.role_id ?? record.id,
    roleId: record.role_id ?? record.id,
    roleName: record.role_name ?? 'N/A',
    description: record.role_description ?? 'N/A',
    userCount: record.user_count ?? 0,
    roleType: record.role_type ?? 0,
    raw: record,
  };
}

export function getRoleId(role) {
  return role?.raw?.role_id ?? role?.roleId ?? role?.key;
}

export async function getAllRoles() {
  const json = await fetchJsonWithAuth(AUTH_URL, '/get-roles');
  const payload = json.data ?? json;
  const defaultRoles = firstArray(payload?.zinnext_default).map(normalizeRole);
  const customRoles = firstArray(payload?.custom_roles).map(normalizeRole);
  const all = [...defaultRoles, ...customRoles];
  return { roles: all, total: all.length };
}

// ─── Teams ─────────────────────────────────────────────────────────────────
// GET /get-teams?searchquery=&sortBy=&limit=N&offset=N
// Response: { data: { teams: [...], totalCount: N } }
// Each item: { teamId, teamName, teamMembers ([]string), reportingManager (string),
//              reportingManagerId (int), teamMembersIds ([]int), noOfTeamMembers, createdAt }

function normalizeTeam(record) {
  return {
    key: record.teamId,
    teamId: record.teamId,
    teamName: record.teamName ?? 'N/A',
    manager: record.reportingManager ?? 'N/A',
    managerId: record.reportingManagerId ?? 0,
    memberCount: record.noOfTeamMembers ?? 0,
    members: firstArray(record.teamMembers),
    memberIds: firstArray(record.teamMembersIds),
    raw: record,
  };
}

export function getTeamId(team) {
  return team?.raw?.teamId ?? team?.teamId ?? team?.key;
}

export async function getAllTeams({ offset = 0, limit = 10, sortBy = 'new', search = '' } = {}) {
  const params = new URLSearchParams({
    searchquery: search,
    sortBy,
    limit: String(limit),
    offset: String(offset),
  });
  const json = await fetchJsonWithAuth(AUTH_URL, `/get-teams?${params}`);
  const payload = json.data ?? json;
  const teams = firstArray(payload?.teams, payload, json?.teams);
  const total = payload?.totalCount ?? payload?.total ?? teams.length;
  return { teams: teams.map(normalizeTeam), total };
}

// PUT /team/edit?teamId=N
// Body: { team_name, team_manager (int userId), other_team_members ([]int), reporting_team_member ([]int) }
// IMPORTANT: UpdateUserTeam updates all four DB columns at once — always send current values
// to avoid zeroing out fields not being changed.
export async function updateTeam(team, { teamName, managerId, memberIds = [] }) {
  const teamId = getTeamId(team);
  return fetchJsonWithAuth(AUTH_URL, `/team/edit?teamId=${teamId}`, {
    method: 'PUT',
    body: JSON.stringify({
      team_name: teamName,
      team_manager: managerId,
      other_team_members: memberIds,
      reporting_team_member: [],
    }),
  });
}

// ─── Shared: Module Field Config ────────────────────────────────────────────
// Roles use roleId param; teams use teamId param on the same /admin/field-config endpoint.

function normalizeModuleField(field, index) {
  const fieldName = firstValue(field, ['label', 'Label', 'fieldName', 'field_name', 'name', 'fieldLabel', 'value'], `Field ${index + 1}`);
  const fieldKey = firstValue(field, ['field', 'Field', 'fieldKey', 'field_key', 'key', 'value', 'fieldName', 'name'], fieldName);
  const showValue = firstValue(field, ['isVisible', 'is_visible', 'visible', 'show', 'is_show', 'isShow', 'enabled'], true);
  const mandatoryValue = firstValue(field, ['ismandatory', 'isMandatory', 'is_mandatory', 'mandatory', 'required', 'req'], false);
  const orderValue = firstValue(field, ['order', 'Order', 'sortOrder', 'position'], index);

  return {
    ...field,
    fieldKey,
    fieldName,
    type: firstValue(field, ['type', 'Type'], 'text'),
    isVisible: typeof showValue === 'string'
      ? !['false', '0', 'hide', 'hidden', 'no'].includes(showValue.toLowerCase())
      : Boolean(showValue),
    ismandatory: typeof mandatoryValue === 'string'
      ? ['true', '1', 'yes', 'required'].includes(mandatoryValue.toLowerCase())
      : Boolean(mandatoryValue),
    order: typeof orderValue === 'number' ? orderValue : index,
  };
}

async function fetchFieldConfigModule(apiModule, idParam, idValue, configType = 'listView') {
  const params = new URLSearchParams({ module: apiModule, userId: '0', [idParam]: String(idValue), configType });
  const json = await fetchJsonWithAuth(AUTH_URL, `${FIELD_CONFIG_PATH}?${params}`);
  const payload = json.data ?? json;
  return firstArray(payload, payload?.visibleFields, json?.visibleFields);
}

export async function getRoleModuleFields(role, configType = 'listView') {
  const roleId = getRoleId(role);
  const entries = await Promise.all(
    CUSTOMIZABLE_MODULES.map(async ({ key, apiModule }) => {
      const fields = await fetchFieldConfigModule(apiModule, 'roleId', roleId, configType);
      return [key, fields.map((f, i) => ({ ...normalizeModuleField(f, i), module: key, apiModule, roleId }))];
    })
  );
  return Object.fromEntries(entries);
}

export async function getTeamModuleFields(team, configType = 'listView') {
  const teamId = getTeamId(team);
  const entries = await Promise.all(
    CUSTOMIZABLE_MODULES.map(async ({ key, apiModule }) => {
      const fields = await fetchFieldConfigModule(apiModule, 'teamId', teamId, configType);
      return [key, fields.map((f, i) => ({ ...normalizeModuleField(f, i), module: key, apiModule, teamId }))];
    })
  );
  return Object.fromEntries(entries);
}

function visibleFieldPayload(fields) {
  return fields.map((field, index) => ({
    label: field.fieldName,
    field: field.fieldKey,
    isVisible: field.isVisible,
    type: field.type ?? 'text',
    isEditable: field.isEditable ?? false,
    order: field.order ?? index,
    ismandatory: field.ismandatory ?? field.isMandatory ?? false,
  }));
}

export async function updateRoleModuleFieldConfig(role, module, fields, configType = 'listView') {
  const roleId = getRoleId(role);
  const apiModule = CUSTOMIZABLE_MODULES.find((m) => m.key === module)?.apiModule ?? module;
  return fetchJsonWithAuth(AUTH_URL, `${FIELD_CONFIG_PATH}/role`, {
    method: 'PUT',
    body: JSON.stringify({ module: apiModule, roleId, configType, visibleFields: visibleFieldPayload(fields) }),
  });
}

export async function updateTeamModuleFieldConfig(team, module, fields, configType = 'listView') {
  const teamId = getTeamId(team);
  const apiModule = CUSTOMIZABLE_MODULES.find((m) => m.key === module)?.apiModule ?? module;
  return fetchJsonWithAuth(AUTH_URL, `${FIELD_CONFIG_PATH}/team`, {
    method: 'PUT',
    body: JSON.stringify({ module: apiModule, teamId, configType, visibleFields: visibleFieldPayload(fields) }),
  });
}
