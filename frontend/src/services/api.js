import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  logout: () => api.post('/auth/logout'),
};

// Subscription API calls
export const subscriptionAPI = {
  create: (subscriptionData) => api.post('/subscriptions/', subscriptionData),
  getUserSubscriptions: () => api.get('/subscriptions/'),
  getSubscription: (id) => api.get(`/subscriptions/${id}`),
  deactivate: (id) => api.put(`/subscriptions/${id}/deactivate`),
  calculatePrice: (plan, mealTypes, deliveryDays) => 
    api.get('/subscriptions/calculate-price/', {
      params: {
        plan,
        meal_types: JSON.stringify(mealTypes),
        delivery_days: JSON.stringify(deliveryDays)
      }
    }),
  
  // Admin endpoints
  getAllSubscriptions: (skip = 0, limit = 100) => 
    api.get('/subscriptions/admin/all', { params: { skip, limit } }),
  getAnySubscription: (id) => api.get(`/subscriptions/admin/${id}`),
  adminDeactivate: (id) => api.put(`/subscriptions/admin/${id}/deactivate`),
};

// Testimonials API calls
export const testimonialAPI = {
  create: (testimonialData) => api.post('/testimonials/', testimonialData),
  getUserTestimonials: () => api.get('/testimonials/'),
  getTestimonial: (id) => api.get(`/testimonials/${id}`),
  
  // Admin endpoints
  getAllTestimonials: (skip = 0, limit = 100) => 
    api.get('/testimonials/admin/all', { params: { skip, limit } }),
  approve: (id) => api.put(`/testimonials/admin/${id}/approve`),
  reject: (id) => api.put(`/testimonials/admin/${id}/reject`),
};

// Meal Plans API calls
export const mealPlanAPI = {
  getAll: () => api.get('/meal-plans/'),
  getMealPlan: (id) => api.get(`/meal-plans/${id}`),
  
  // Admin endpoints
  create: (mealPlanData) => api.post('/meal-plans/', mealPlanData),
  update: (id, mealPlanData) => api.put(`/meal-plans/${id}`, mealPlanData),
  delete: (id) => api.delete(`/meal-plans/${id}`),
  deactivate: (id) => api.put(`/meal-plans/${id}/deactivate`),
};

export default api; 