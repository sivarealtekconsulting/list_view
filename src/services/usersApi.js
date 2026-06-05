import { AUTH_URL, SUBMISSIONS_URL, fetchJsonWithAuth } from './dropdownApi';

export async function uploadListViewActionIcon(file) {
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('icon', file);

  const res = await fetch(`${AUTH_URL}/admin/field-config/action-icon`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = new Error(`Upload failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  return json.data ?? json; // { iconPath, iconUrl }
}

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
  return keys.map((key) => record?.[key]).find((value) => value !== undefined && value !== null && value !== '') ?? fallback;
}

function normalizeTotal(payload, users) {
  return (
    payload?.total ??
    payload?.totalCount ??
    payload?.count ??
    payload?.recordsTotal ??
    payload?.meta?.total ??
    payload?.pagination?.total ??
    users.length
  );
}

export async function getAllUsers({ offset = 0, limit = 10, sortBy = 'new' } = {}) {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
    sortBy,
  });

  const json = await fetchJsonWithAuth(AUTH_URL, `/get-all-users?${params}`);
  const payload = json.data ?? json;
  const users = firstArray(
    payload,
    json.users,
    json.rows,
    json.items,
    json.records,
    payload?.users,
    payload?.data,
    payload?.rows,
    payload?.items,
    payload?.records,
    payload?.docs,
    payload?.result,
    payload?.results
  );

  return {
    users,
    total: normalizeTotal({ ...json, ...payload }, users),
  };
}

export function getUserId(user) {
  const value = firstValue(
    user?.raw ?? user,
    ['USER_ID', 'user_id', 'userId', 'id', '_id', 'uuid'],
    user?.key
  );
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : value;
}

export function getUserRoleId(user) {
  const value = firstValue(user?.raw ?? user, ['ROLE_ID', 'role_id', 'roleId', 'ROLEID'], 0);
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
}

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
    isVisible: typeof showValue === 'string' ? !['false', '0', 'hide', 'hidden', 'no'].includes(showValue.toLowerCase()) : Boolean(showValue),
    ismandatory: typeof mandatoryValue === 'string'
      ? ['true', '1', 'yes', 'required'].includes(mandatoryValue.toLowerCase())
      : Boolean(mandatoryValue),
    order: typeof orderValue === 'number' ? orderValue : index,
    isLink:        Boolean(field.isLink),
    linkTemplate:  field.linkTemplate  ?? '',
    linkType:      field.linkType      ?? 'internal',
    linkTarget:    field.linkTarget    ?? '_self',
    action:        field.action        ?? 'navigate',
    actionButtons: Array.isArray(field.actionButtons) ? field.actionButtons : [],
  };
}

async function getFieldConfigModule(apiModule, userId, roleId, configType = 'listView') {
  const params = new URLSearchParams({
    module: apiModule,
    userId: String(userId ?? ''),
    roleId: String(roleId ?? ''),
    configType,
  });
  const json = await fetchJsonWithAuth(AUTH_URL, `${FIELD_CONFIG_PATH}?${params}`);
  const payload = json.data ?? json;
  return firstArray(payload, payload?.visibleFields, json?.visibleFields);
}

async function getDropdownModuleFields(apiModule) {
  const json = await fetchJsonWithAuth(SUBMISSIONS_URL, `/filter-dropdown-fields?module=${encodeURIComponent(apiModule)}`);
  const payload = json.data ?? json;
  return firstArray(payload, payload?.fields, payload?.items, payload?.rows, json?.fields);
}

export async function getUserModuleFields(user, configType = 'listView') {
  const userId = getUserId(user);
  const roleId = getUserRoleId(user);
  const entries = await Promise.all(
    CUSTOMIZABLE_MODULES.map(async ({ key, apiModule }) => {
      let fields;
      let source = 'field-config';

      try {
        fields = await getFieldConfigModule(apiModule, userId, roleId, configType);
      } catch (err) {
        if (err.status !== 404) {
          // Non-404 error — try dropdown fallback before giving up
          try {
            source = 'dropdown-fields';
            fields = await getDropdownModuleFields(apiModule);
          } catch {
            fields = [];
          }
        } else {
          source = 'dropdown-fields';
          try {
            fields = await getDropdownModuleFields(apiModule);
          } catch {
            fields = [];
          }
        }
      }

      // When field config exists but is empty (user has no saved config),
      // fall back to the full dropdown fields so the popup is never blank.
      if ((fields?.length ?? 0) === 0) {
        source = 'dropdown-fields';
        try {
          fields = await getDropdownModuleFields(apiModule);
        } catch {
          fields = [];
        }
      }

      return [
        key,
        fields.map((field, index) => ({
          ...normalizeModuleField(field, index),
          module: key,
          apiModule,
          source,
          userId,
          roleId,
        })),
      ];
    })
  );

  return Object.fromEntries(entries);
}

function visibleFieldPayload(fields, configType) {
  const isListView = !configType || configType === 'listView';
  return fields.map((field, index) => {
    const base = {
      label: field.fieldName,
      field: field.fieldKey,
      isVisible: field.isVisible,
      type: field.type ?? 'text',
      order: field.order ?? index,
    };
    if (isListView) {
      base.isLink        = field.isLink        ?? false;
      base.linkTemplate  = field.linkTemplate  ?? '';
      base.linkType      = field.linkType      ?? 'internal';
      base.linkTarget    = field.linkTarget    ?? '_self';
      base.action        = field.action        ?? 'navigate';
      base.actionButtons = field.actionButtons ?? [];
    } else {
      base.isEditable = field.isEditable ?? false;
      base.ismandatory = field.ismandatory ?? field.isMandatory ?? false;
    }
    return base;
  });
}

export async function updateUserModuleFieldConfig(user, module, fields, configType = 'listView') {
  const userId = getUserId(user);
  const roleId = getUserRoleId(user);
  const apiModule = CUSTOMIZABLE_MODULES.find((item) => item.key === module)?.apiModule ?? module;

  return fetchJsonWithAuth(AUTH_URL, FIELD_CONFIG_PATH, {
    method: 'PUT',
    body: JSON.stringify({
      module: apiModule,
      userId,
      roleId,
      configType,
      visibleFields: visibleFieldPayload(fields, configType),
    }),
  });
}

export async function updateUserModuleFields(user, moduleFields, configType = 'listView') {
  return Promise.all(
    Object.entries(moduleFields).map(([module, fields]) => (
      updateUserModuleFieldConfig(user, module, fields, configType)
    ))
  );
}
