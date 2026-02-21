import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add auth token to requests
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (email: string, username: string, password: string, fullName?: string) =>
    apiClient.post('/api/v1/auth/register', { email, username, password, full_name: fullName }),

  login: (email: string, password: string) =>
    apiClient.post('/api/v1/auth/login', { email, password }),

  getCurrentUser: () =>
    apiClient.get('/api/v1/auth/me'),
};

export const scanApi = {
  scanCode: (projectId: string, codeContent: string) =>
    apiClient.post('/api/v1/scans/code', {
      project_id: projectId,
      scan_type: 'code',
      code_content: codeContent,
    }),

  scanPrompt: (projectId: string, promptText: string) =>
    apiClient.post('/api/v1/scans/prompt', {
      project_id: projectId,
      scan_type: 'prompt',
      prompt_text: promptText,
    }),

  scanPII: (projectId: string, codeContent: string) =>
    apiClient.post('/api/v1/scans/pii', {
      project_id: projectId,
      scan_type: 'pii',
      code_content: codeContent,
    }),

  getScan: (scanId: string) =>
    apiClient.get(`/api/v1/scans/${scanId}`),

  listProjectScans: (projectId: string, skip = 0, limit = 10) =>
    apiClient.get(`/api/v1/scans/project/${projectId}?skip=${skip}&limit=${limit}`),

  scanWeb: (projectId: string, targetUrl: string, config: any = {}) =>
    apiClient.post('/api/v1/scans/web', {
      project_id: projectId,
      target_url: targetUrl,
      config: config,
    }),
};

export const projectApi = {
  createProject: (name: string, description?: string, repoUrl?: string) =>
    apiClient.post('/api/v1/projects/', { name, description, repo_url: repoUrl }),

  getProject: (projectId: string) =>
    apiClient.get(`/api/v1/projects/${projectId}`),

  updateProject: (projectId: string, name?: string, description?: string) =>
    apiClient.put(`/api/v1/projects/${projectId}`, { name, description }),

  listOrgProjects: (orgId: string) =>
    apiClient.get(`/api/v1/projects/org/${orgId}`),

  deleteProject: (projectId: string) =>
    apiClient.delete(`/api/v1/projects/${projectId}`),
};

export const organizationApi = {
  createOrganization: (name: string, slug: string, description?: string) =>
    apiClient.post('/api/v1/organizations/', { name, slug, description }),

  getOrganization: (orgId: string) =>
    apiClient.get(`/api/v1/organizations/${orgId}`),

  updateOrganization: (orgId: string, name?: string, description?: string) =>
    apiClient.put(`/api/v1/organizations/${orgId}`, { name, description }),

  listOrganizations: () =>
    apiClient.get('/api/v1/organizations/'),
};

export const alertApi = {
  listProjectAlerts: (projectId: string) =>
    apiClient.get(`/api/v1/alerts/project/${projectId}`),

  getAlert: (alertId: string) =>
    apiClient.get(`/api/v1/alerts/${alertId}`),

  updateAlert: (alertId: string, isRead?: boolean, isResolved?: boolean) =>
    apiClient.patch(`/api/v1/alerts/${alertId}`, { is_read: isRead, is_resolved: isResolved }),
};

export const subscriptionApi = {
  getSubscription: (orgId: string) =>
    apiClient.get(`/api/v1/subscriptions/org/${orgId}`),

  upgrade: (orgId: string, plan: string) =>
    apiClient.post('/api/v1/subscriptions/upgrade', { plan }, {
      params: { org_id: orgId }
    }),
};

export default apiClient;
