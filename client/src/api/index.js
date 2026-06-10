import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — redirect to login if on admin page
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════
//   PUBLIC API
// ═══════════════════════════════════════

export const getProjects = () => api.get('/projects');
export const getSkills = () => api.get('/skills');
export const getExperience = () => api.get('/experience');
export const getAchievements = () => api.get('/achievements');
export const getLeadership = () => api.get('/leadership');
export const sendMessage = (data) => api.post('/contact', data);

// ═══════════════════════════════════════
//   AUTH
// ═══════════════════════════════════════

export const login = (credentials) => api.post('/auth/login', credentials);
export const verifyToken = () => api.post('/auth/verify');
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const verifyOTP = (data) => api.post('/auth/verify-otp', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const changePassword = (data) => api.post('/auth/change-password', data);

// ═══════════════════════════════════════
//   ADMIN CRUD — Projects
// ═══════════════════════════════════════

export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// ═══════════════════════════════════════
//   ADMIN CRUD — Skills
// ═══════════════════════════════════════

export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

// ═══════════════════════════════════════
//   ADMIN CRUD — Experience
// ═══════════════════════════════════════

export const createExperience = (data) => api.post('/experience', data);
export const updateExperience = (id, data) => api.put(`/experience/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experience/${id}`);

// ═══════════════════════════════════════
//   ADMIN CRUD — Achievements
// ═══════════════════════════════════════

export const createAchievement = (data) => api.post('/achievements', data);
export const updateAchievement = (id, data) => api.put(`/achievements/${id}`, data);
export const deleteAchievement = (id) => api.delete(`/achievements/${id}`);

// ═══════════════════════════════════════
//   ADMIN CRUD — Leadership
// ═══════════════════════════════════════

export const getMessages = () => api.get('/contact');
export const markMessageRead = (id) => api.put(`/contact/${id}/read`);
export const deleteMessage = (id) => api.delete(`/contact/${id}`);

export const createLeadership = (data) => api.post('/leadership', data);
export const updateLeadership = (id, data) => api.put(`/leadership/${id}`, data);
export const deleteLeadership = (id) => api.delete(`/leadership/${id}`);

// ═══════════════════════════════════════
//   ADMIN CRUD — Articles
// ═══════════════════════════════════════

export const getArticles = () => api.get('/articles');
export const getArticleBySlug = (slug) => api.get(`/articles/${slug}`);
export const getAllArticles = () => api.get('/articles/all');
export const createArticle = (data) => api.post('/articles', data);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// ═══════════════════════════════════════
//   ADMIN CRUD — Gallery
// ═══════════════════════════════════════

export const getGalleryItems = () => api.get('/gallery');
export const createGalleryItem = (data) => api.post('/gallery', data);
export const updateGalleryItem = (id, data) => api.put(`/gallery/${id}`, data);
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`);

// ═══════════════════════════════════════
//   Profile
// ═══════════════════════════════════════

export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

// ═══════════════════════════════════════
//   Uploads
// ═══════════════════════════════════════

export const uploadFile = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 60000,
});

// ═══════════════════════════════════════
//   Site Settings
// ═══════════════════════════════════════

export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

// ═══════════════════════════════════════
//   Analytics & Dashboard
// ═══════════════════════════════════════

export const getDashboardAnalytics = () => api.get('/analytics/dashboard');
export const getActivityLog = (page = 1) => api.get(`/analytics/activity?page=${page}`);
export const logActivity = (data) => api.post('/analytics/log', data);

// ═══════════════════════════════════════
//   Backup & Restore
// ═══════════════════════════════════════

export const exportBackup = () => api.get('/backup/export');
export const importBackup = (data) => api.post('/backup/import', data);

// ═══════════════════════════════════════
//   B2B Client Management
// ═══════════════════════════════════════

export const getClients = (params = {}) => api.get('/clients', { params });
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);
export const regenerateClientKey = (id) => api.post(`/clients/${id}/regenerate-key`);

// ═══════════════════════════════════════
//   Helpers
// ═══════════════════════════════════════

// Helper to format image URLs from the backend
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  // If it's a relative path from our backend, prepend the base URL (removing /api from it)
  const baseUrl = API_URL.replace('/api', '');
  return `${baseUrl}${url}`;
};

export default api;
