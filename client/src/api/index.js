import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API calls
export const getProjects = () => api.get('/projects');
export const getSkills = () => api.get('/skills');
export const getExperience = () => api.get('/experience');
export const getAchievements = () => api.get('/achievements');
export const sendMessage = (data) => api.post('/contact', data);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const verifyToken = () => api.post('/auth/verify');

// Admin CRUD
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

export const createExperience = (data) => api.post('/experience', data);
export const updateExperience = (id, data) => api.put(`/experience/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experience/${id}`);

export const createAchievement = (data) => api.post('/achievements', data);
export const updateAchievement = (id, data) => api.put(`/achievements/${id}`, data);
export const deleteAchievement = (id) => api.delete(`/achievements/${id}`);

// Leadership & Activities
export const getLeadership = () => api.get('/leadership');
export const createLeadership = (data) => api.post('/leadership', data);
export const updateLeadership = (id, data) => api.put(`/leadership/${id}`, data);
export const deleteLeadership = (id) => api.delete(`/leadership/${id}`);

export const getMessages = () => api.get('/contact');
export const markMessageRead = (id) => api.put(`/contact/${id}/read`);
export const deleteMessage = (id) => api.delete(`/contact/${id}`);

// Articles
export const getArticles = () => api.get('/articles');
export const getArticleBySlug = (slug) => api.get(`/articles/${slug}`);
export const getAllArticles = () => api.get('/articles/all');
export const createArticle = (data) => api.post('/articles', data);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// Gallery
export const getGalleryItems = () => api.get('/gallery');
export const createGalleryItem = (data) => api.post('/gallery', data);
export const updateGalleryItem = (id, data) => api.put(`/gallery/${id}`, data);
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`);

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

// Uploads
export const uploadFile = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Helper to format image URLs from the backend
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  // If it's a relative path from our backend, prepend the base URL (removing /api from it)
  const baseUrl = API_URL.replace('/api', '');
  return `${baseUrl}${url}`;
};

export default api;
