const BASE_URL = 'http://localhost:9009/v1';
const AUTH_URL = 'http://192.168.1.66/authapi/v1';

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

async function apiGet(path) {
  const headers = await authHeaders();
  let res = await fetch(`${BASE_URL}${path}`, { headers });

  // Token expired — re-login once and retry
  if (res.status === 401) {
    localStorage.removeItem('authToken');
    const freshHeaders = await authHeaders();
    res = await fetch(`${BASE_URL}${path}`, { headers: freshHeaders });
  }

  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const json = await res.json();
  return json.data ?? json;
}

async function apiPut(path, body) {
  const headers = await authHeaders();
  let res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    localStorage.removeItem('authToken');
    const freshHeaders = await authHeaders();
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: freshHeaders,
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function getAllJobs() {
  return apiGet('/jobs');
}

export async function getJobById(id) {
  return apiGet(`/jobs/${id}`);
}
export async function updateJobDescription(id, rawDescription) {
  return apiPut(`/jobs/${id}`, { rawDescription });
}

// export async function getJobDetailedView(){
//   const response = await fetch.get(`${BASE_URL}/job-detailedView`,
//     {
//       headers: {
//         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inppbm5leHRAcmVhbHRla2NvbnN1bHRpbmcubmV0Iiwicm9sZV9pZCI6NSwidXNlcklkIjoyLCJ0ZW5hbnRJZCI6IjkzYzc4MmE0YWE2MjYxNzVlNWQxMWFmYSIsImJ1c2luZXNzSWQiOiI2N2FjODBkNDBmZDU1OWM0NDM0NWJkMzAiLCJidXNpbmVzc1VuaXRJZCI6IjY3YWM4MTFmMGZkNTU5YzQ0MzQ1YmQzMSIsInByZWZlcnJlZF91c2VybmFtZSI6Inppbm5leHRAcmVhbHRla2NvbnN1bHRpbmcubmV0IiwibmFtZSI6ImFkbWluX3JlYWx0ZWtoIiwiZmFtaWx5TmFtZSI6ImFkbWluX3JlYWx0ZWtoIiwidXNlck5hbWUiOiJhZG1pbiByZWFsdGVraCIsInJlcG9ydGluZ0lkIjowLCJwZXJtaXNzaW9uVmVyc2lvbiI6MzEsImV4cCI6MTc4MDU1Nzc5OH0.7mXVeindrHB839WToiMgKx3yiZUwgH50q86KYQ1PxAw`, // if your API requires auth
//       },
//     }
//   );

//   return response.data;
// };


export async function getJobDetailedView(module) {
  const response = await fetch(`${BASE_URL}/detailedView?module=${module}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inppbm5leHRAcmVhbHRla2NvbnN1bHRpbmcubmV0Iiwicm9sZV9pZCI6NSwidXNlcklkIjoyLCJ0ZW5hbnRJZCI6IjkzYzc4MmE0YWE2MjYxNzVlNWQxMWFmYSIsImJ1c2luZXNzSWQiOiI2N2FjODBkNDBmZDU1OWM0NDM0NWJkMzAiLCJidXNpbmVzc1VuaXRJZCI6IjY3YWM4MTFmMGZkNTU5YzQ0MzQ1YmQzMSIsInByZWZlcnJlZF91c2VybmFtZSI6Inppbm5leHRAcmVhbHRla2NvbnN1bHRpbmcubmV0IiwibmFtZSI6ImFkbWluX3JlYWx0ZWtoIiwiZmFtaWx5TmFtZSI6ImFkbWluX3JlYWx0ZWtoIiwidXNlck5hbWUiOiJhZG1pbiByZWFsdGVraCIsInJlcG9ydGluZ0lkIjowLCJwZXJtaXNzaW9uVmVyc2lvbiI6MzEsImV4cCI6MTc4MDU1Nzc5OH0.7mXVeindrHB839WToiMgKx3yiZUwgH50q86KYQ1PxAw`, // preferably from localStorage/session
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}
