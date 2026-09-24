/**
 * JanNirikshan Civilian API Service
 * Secure communication layer with DRISHTI AI Backend REST API (Localhost:8000).
 * Never exposes database credentials, full Aadhaar tokens, or sensitive authority internals.
 */

const API_BASE_URL =
  import.meta.env.VITE_DRISHTI_API_URL ||
  import.meta.env.VITE_API_URL ||
  '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('civilian_token') || sessionStorage.getItem('civilian_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function registerCivilian(payload) {
  const res = await fetch(`${API_BASE_URL}/civilian/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Registration failed.');
  }
  return data;
}

export async function loginCivilian(username, password) {
  const res = await fetch(`${API_BASE_URL}/civilian/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Login failed.');
  }
  return data;
}

export async function getMyProfile() {
  const res = await fetch(`${API_BASE_URL}/civilian/auth/me`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to fetch profile.');
  }
  return data.user;
}

export async function updateCivilianProfile(profileData) {
  const res = await fetch(`${API_BASE_URL}/civilian/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to update profile.');
  }
  return data;
}

export async function forgotPassword(identifier) {
  const res = await fetch(`${API_BASE_URL}/civilian/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to process request.');
  }
  return data;
}

export async function getNearbyProjects({ lat, lng, radius_km = 25, search = '', sector = '' }) {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    radius_km: radius_km.toString(),
  });
  if (search) params.append('search', search);
  if (sector && sector !== 'ALL') params.append('sector', sector);

  const requestUrl = `${API_BASE_URL}/civilian/projects/nearby?${params.toString()}`;
  console.log('[JanNirikshan] DRISHTI API URL:', requestUrl);

  const res = await fetch(requestUrl);
  const data = await res.json();
  console.log('[JanNirikshan] DRISHTI API response:', data);

  if (!res.ok) {
    throw new Error(data.detail || 'Failed to fetch nearby projects.');
  }
  return data;
}

export async function getProjectDetail(projectId, lat = null, lng = null) {
  const params = new URLSearchParams();
  if (lat !== null && lng !== null) {
    params.append('lat', lat.toString());
    params.append('lng', lng.toString());
  }
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE_URL}/civilian/projects/${projectId}${queryStr}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Project not found.');
  }
  return data.project;
}

export async function submitCivilianFeedback(feedbackPayload) {
  const res = await fetch(`${API_BASE_URL}/civilian/feedback`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(feedbackPayload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to submit feedback.');
  }
  return data;
}

export async function getMyFeedback() {
  const res = await fetch(`${API_BASE_URL}/civilian/my-feedback`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to fetch feedback history.');
  }
  return data.feedback || [];
}

export async function submitCivilianIssue(issuePayload) {
  const res = await fetch(`${API_BASE_URL}/civilian/issues`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(issuePayload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to report issue.');
  }
  return data;
}

export async function getMyIssues() {
  const res = await fetch(`${API_BASE_URL}/civilian/my-issues`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to fetch reported issues.');
  }
  return data.issues || [];
}

