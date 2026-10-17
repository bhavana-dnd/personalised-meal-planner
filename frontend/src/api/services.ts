import api from './client'

// Auth
export const authApi = {
  login:    (username: string, password: string) => api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string) => api.post('/auth/register', { username, email, password }),
}

// Dashboard
export const dashboardApi = {
  get:     () => api.get('/dashboard'),
  targets: () => api.get('/dashboard/targets'),
}

// Meals
export const mealsApi = {
  logMeal:  (data: any)                    => api.post('/meals', data),
  today:    ()                             => api.get('/meals/today'),
  history:  (from: string, to: string)    => api.get(`/meals/history?from=${from}&to=${to}`),
}

// Foods
export const foodsApi = {
  search:  (q?: string) => api.get(`/foods${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  getById: (id: number) => api.get(`/foods/${id}`),
}

// Profile
export const profileApi = {
  get:    ()       => api.get('/profile'),
  update: (data: any) => api.put('/profile', data),
}

// Weight
export const weightApi = {
  log:     (data: any) => api.post('/weight', data),
  history: ()          => api.get('/weight'),
}

// Recommendations
export const recommendApi = {
  get: (limit = 10) => api.get(`/recommendations?limit=${limit}`),
}

// PM POSHAN
export const poshanApi = {
  menu: (state?: string) => api.get(`/poshan/menu${state ? `?state=${encodeURIComponent(state)}` : ''}`),
}

// Food Scan
export const scanApi = {
  scan:    (base64Image: string, mimeType = 'image/jpeg') => api.post('/scan', { base64Image, mimeType }),
  history: () => api.get('/scan/history'),
}
