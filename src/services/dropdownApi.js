const BASE_URL = 'http://192.168.1.66/submissionsapi/v1';
// const AUTH_URL = 'http://192.168.1.66/authapi/v1';
const JOBS_URL = 'http://192.168.1.66/jobsapi/v1';
export const AUTH_URL = 'http://192.168.1.66/authapi/v1';
export const SUBMISSIONS_URL = BASE_URL;

const LOGIN_CREDENTIALS = {
  email: 'zinnext@realtekconsulting.net',
  user_pwd: 'Admin@123*',
};

// In-flight login promise — prevents multiple simultaneous login calls
let loginPromise = null;

async function login() {
  if (loginPromise) return loginPromise;

  loginPromise = fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(LOGIN_CREDENTIALS),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      const json = await res.json();
      // Handle common token field names returned by auth APIs
      const token = json.token ?? json.access_token ?? json.data?.token ?? json.data?.access_token;
      if (!token) throw new Error('No token in login response');
      localStorage.setItem('authToken', token);
      return token;
    })
    .finally(() => {
      loginPromise = null;
    });

  return loginPromise;
}

async function ensureToken() {
  const token = localStorage.getItem('authToken');
  if (token) return token;
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
    `${SUBMISSION_URL}/dashboard-onboarding-count?offset=${offset}&limit=${limit}`,
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
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data ?? json;
}