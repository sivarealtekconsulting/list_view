const BASE_URL = 'http://192.168.1.66/submissionsapi/v1';
const JOBS_URL = 'http://192.168.1.66/jobsapi/v1';
export const AUTH_URL = 'http://192.168.1.66/authapi/v1';
export const SUBMISSIONS_URL = BASE_URL;

const LOGIN_CREDENTIALS = {
  email: 'zinnext@realtekconsulting.net',
  user_pwd: 'Admin@123*',
};

// In-flight login promise — prevents multiple simultaneous login calls
let loginPromise = null;

export async function login() {
  if (loginPromise) return loginPromise;

  loginPromise = fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(LOGIN_CREDENTIALS),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      const json = await res.json();
      const token = json.data?.access_token ?? json.data?.token ?? json.access_token ?? json.token;
      if (!token) throw new Error('No token in login response');
      localStorage.setItem('authToken', token);
      // Also store expiry time (900 seconds)
      localStorage.setItem('authTokenExpiry', String(Date.now() + 900 * 1000));
      return token;
    })
    .finally(() => {
      loginPromise = null;
    });

  return loginPromise;
}

async function ensureToken() {
  const token = localStorage.getItem('authToken');
  const expiry = localStorage.getItem('authTokenExpiry');
  // If token exists and not expired (with 30s buffer), use it
  if (token && expiry && Date.now() < Number(expiry) - 30000) return token;
  // Otherwise clear and re-login
  localStorage.removeItem('authToken');
  localStorage.removeItem('authTokenExpiry');
  return login();
}

async function authHeaders() {
  const token = await ensureToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function fetchJsonWithAuth(baseUrl, path, options = {}) {
  const headers = await authHeaders();
  const requestOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  let res = await fetch(`${baseUrl}${path}`, requestOptions);

  // Token expired — re-login once and retry
  if (res.status === 401) {
    localStorage.removeItem('authToken');
    const freshHeaders = await authHeaders();
    res = await fetch(`${baseUrl}${path}`, {
      ...requestOptions,
      headers: {
        ...freshHeaders,
        ...options.headers,
      },
    });
  }

  if (!res.ok) {
    const error = new Error(`API ${res.status}: ${res.statusText}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function apiGetWithAuth(baseUrl, path) {
  const json = await fetchJsonWithAuth(baseUrl, path);
  return json.data ?? json;
}

async function apiGet(path) {
  return apiGetWithAuth(BASE_URL, path);
}

/**
 * Fetch available filter fields for a module.
 * Returns: [{ label, value, type }, ...]
 */
export async function getDropdownFields(module) {
  if (module === 'submissions') {
    try {
      const config = await getFieldConfig(module);

      console.log('FIELD CONFIG RESULT:', config);

      const fieldsArray =
        Array.isArray(config)
          ? config
          : Array.isArray(config?.fields)
            ? config.fields
            : Array.isArray(config?.fieldConfig)
              ? config.fieldConfig
              : Array.isArray(config?.data)
                ? config.data
                : [];

      const mappedFields = fieldsArray
        .map((field) => ({
          label:
            field.label ??
            field.fieldLabel ??
            field.displayName ??
            field.headerName ??
            field.name,
          value:
            field.value ??
            field.fieldName ??
            field.key ??
            field.name,
          type: field.type ?? 'text',
        }))
        .filter((field) => field.label && field.value);

      if (mappedFields.length) {
        return mappedFields;
      }
    } catch (error) {
      console.log('FIELD CONFIG FAILED:', error);
    }

    return [
      { label: 'Sub ID', value: 'submissionRefId' },
      { label: 'Candidate', value: 'candidateName' },
      { label: 'Job', value: 'jobTitle' },
      { label: 'Client', value: 'clientName' },
      { label: 'Bill Rate', value: 'proposedRate' },
      { label: 'Pay Rate', value: 'acceptedRate' },
      { label: 'Internal Status', value: 'internalStatus' },
      { label: 'Client Status', value: 'submissionStatus' },
      { label: 'Client Sub ID', value: 'reqId' },
      { label: 'Submitted By', value: 'submittedBy' },
    ];
  }

  return apiGet(`/filter-dropdown-fields?module=${encodeURIComponent(module)}`);
}
/**
 * Fetch distinct values for a specific field in a module.
 * Returns: [{ label, value }, ...]
 */
export async function getDropdownValues(module, field, search = '', limit = 50, offset = 0) {
  const params = new URLSearchParams({
    module,
    field,
    value: search,
    limit: String(limit),
    offset: String(offset),
  });
  return apiGet(`/filter-dropdown-values?${params}`);
}

export async function getDashboardOnboardingCount(
  payload,
  limit = 10,
  offset = 0
) {
  const headers = await authHeaders();
  const response = await fetch(
    `${SUBMISSIONS_URL}/dashboard-onboarding-count?offset=${offset}&limit=${limit}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }
  );

  const json = await response.json();
  return json.data ?? json;
}

export async function getJobs({
  jobStatus = 'active',
  jobRecruitmentStatus = 'unread',
  limit = 50,
  offset = 0,
  userId = 1,
  sortBy = 'id',
} = {}) {
  const headers = await authHeaders();

  const params = new URLSearchParams({
    jobStatus,
    jobRecruitmentStatus,
    limit: String(limit),
    offset: String(offset),
    userId: String(userId),
    sortBy,
  });

  const response = await fetch(
    `${JOBS_URL}/jobs?${params.toString()}`,
    { method: 'GET', headers }
  );

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data ?? json;
}

/**
 * Fetch submissions list with filters and pagination.
 *
 * Returns: { submissions, summary, pagination }
 * where submissions is an array of normalized submission objects.
 */
export async function getSubmissions({
  tenantId = '93c782a4aa626175e5d11afa',
  businessId = '83c782a4aa626175e5d11afa',
  businessUnitId = '63b57588fd768a839dbc0f63',
  userId = 12,
  sourceType = '',
  submissionViewType = 'candidates',
  offset = 0,
  limit = 10,
} = {}) {
  const headers = await authHeaders();

  const params = new URLSearchParams({
    tenantId,
    businessId,
    businessUnitId,
    userId: String(userId),
    sourceType,
    submissionViewType,
    offset: String(offset),
    limit: String(limit),
  });

  const response = await fetch(
    `${BASE_URL}/submissions?${params.toString()}`,
    { method: 'GET', headers }
  );

  if (!response.ok) {
    const error = new Error(`API ${response.status}: ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const json = await response.json();
  const payload = json.data ?? json;

  // IMPORTANT: this was the working logic
  const rawSubmissions = Array.isArray(payload.submissionList)
    ? payload.submissionList
    : Array.isArray(payload)
      ? payload
      : [];

  const submissions = rawSubmissions.map((item) => ({
    key: item._id ?? item.submissionReferenceId ?? item.reqId,

    submissionId: item._id ?? '',
    submissionRefId: item.submissionReferenceId ?? '',
    reqId: item.reqId ?? '',

    candidateName: item.candidateName ?? '',
    email: item.Email ?? item.email ?? '',
    experience: item.experience ? `${item.experience} years` : '',
    workAuthorisation: item.workAuthorisation ?? '',

    jobTitle: item.jobTitle ?? '',
    clientName: item.clientName ?? '',

    acceptedRate: item.candidateRate?.candidateAcceptedRate ?? 0,
    proposedRate: item.proposedRate?.candidateProposedRate ?? 0,
    margin: item.margin ?? 0,

    internalStatus: item.internalSubmissionStatus ?? '',
    submissionStatus: item.submissionStatus ?? '',

    submittedBy: item.submittedBy ?? '',
    submittedAt: item.submittedAt ?? '',
  }));

  return {
    submissions,
    summary: {
      totalSubmissionCount: payload.count?.totalSubmissionCount ?? submissions.length,
      totalInternalSubmissionCount: payload.count?.totalInternalSubmissionCount ?? 0,
      totalClientSubmissionCount: payload.count?.totalClientSubmissionCount ?? 0,
    },
    pagination: {
      limit: payload.pagination?.limit ?? limit,
      offset: payload.pagination?.offset ?? offset,
    },
  };
}