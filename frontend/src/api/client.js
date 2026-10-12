const API_URL = 'https://crm-cxro2oic.b4a.run/api';

export const getLeads = async () => {
  const response = await fetch(`${API_URL}/leads`);
  if (!response.ok) throw new Error('Failed to fetch leads');
  return response.json();
};

export const createLead = async (leadData) => {
  const response = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  });
  if (!response.ok) throw new Error('Failed to create lead');
  return response.json();
};

export const updateLeadStatus = async ({ id, status }) => {
  const response = await fetch(`${API_URL}/leads/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update status');
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const getLead = async (id) => {
  const response = await fetch(`${API_URL}/leads/${id}`);
  if (!response.ok) throw new Error('Failed to fetch lead');
  return response.json();
};

export const getNotes = async (leadId) => {
  const response = await fetch(`${API_URL}/notes/lead/${leadId}`);
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};

export const createNote = async (noteData) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  if (!response.ok) throw new Error('Failed to create note');
  return response.json();
};

export const deleteLead = async (id) => {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete lead');
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Registration failed');
  return data;
};