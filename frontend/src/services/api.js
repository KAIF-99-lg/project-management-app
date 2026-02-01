import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password, role) => 
    api.post(`/auth/${role.toLowerCase()}/login`, { email, password }),
  
  signup: (name, email, password, role) => 
    api.post(`/auth/${role.toLowerCase()}/signup`, { name, email, password }),
};

export const tasksAPI = {
  getAllTasks: () => api.get('/tasks'),
  getUserTasks: () => api.get('/tasks/my-tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, updates) => api.put(`/tasks/${id}`, updates),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export const projectsAPI = {
  getAllProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, updates) => api.put(`/projects/${id}`, updates),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const teamsAPI = {
  getAllTeams: () => api.get('/teams'),
  getTeamById: (id) => api.get(`/teams/${id}`),
  getTeamMembers: (id) => api.get(`/teams/${id}/members`),
  createTeam: (teamData) => api.post('/teams', teamData),
  updateTeam: (id, updates) => api.put(`/teams/${id}`, updates),
  deleteTeam: (id) => api.delete(`/teams/${id}`),
  addMember: (teamId, userId, role = 'Member') => api.post(`/teams/${teamId}/members`, { userId, role }),
  removeMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
};

export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  getUserTeams: () => api.get('/users/me/teams'),
  getUserProjects: () => api.get('/users/me/projects'),
};

export default api;