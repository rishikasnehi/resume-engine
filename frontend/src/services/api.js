import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
})

// Request interceptor — attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth Endpoints ────────────────────────────────────────────────────────

export const authAPI = {
  /** POST /api/auth/register — register new user */
  register: (data) => api.post('/api/auth/register', data),

  /** POST /api/auth/login — login with email/password */
  login: (data) => api.post('/api/auth/login', data),

  /** GET /api/auth/verify-email?token=... — verify email */
  verifyEmail: (token) => api.get(`/api/auth/verify-email?token=${token}`),

  /** POST /api/auth/resend-verification — resend verification email */
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),

  /** POST /api/auth/upload-image — upload profile image (multipart) */
  uploadImage: (formData) =>
    api.post('/api/auth/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** GET /api/auth/profile — get current user profile */
  getProfile: () => api.get('/api/auth/profile'),
}

// ─── Resume Endpoints ──────────────────────────────────────────────────────

export const resumeAPI = {
  /** POST /api/resumes — create a new resume */
  create: (data) => api.post('/api/resumes', data),

  /** GET /api/resumes — get all resumes for current user */
  getAll: () => api.get('/api/resumes'),

  /** GET /api/resumes/:id — get a specific resume by ID */
  getById: (id) => api.get(`/api/resumes/${id}`),

  /** PUT /api/resumes/:id — update a resume */
  update: (id, data) => api.put(`/api/resumes/${id}`, data),

  /** DELETE /api/resumes/:id — delete a resume */
  delete: (id) => api.delete(`/api/resumes/${id}`),

  /** PUT /api/resumes/:id/upload-images — upload thumbnail + profile image */
  uploadImages: (id, formData) =>
    api.put(`/api/resumes/${id}/upload-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

// ─── Template Endpoints ────────────────────────────────────────────────────

export const templateAPI = {
  /** GET /api/template — get available templates based on subscription */
  getTemplates: () => api.get('/api/template'),
}

// ─── Payment Endpoints ─────────────────────────────────────────────────────

export const paymentAPI = {
  /** POST /api/payments/create-order — create Razorpay order */
  createOrder: (planType) => api.post('/api/payments/create-order', { planType }),

  /** POST /api/payments/verify — verify Razorpay payment */
  verifyPayment: (data) => api.post('/api/payments/verify', data),

  /** GET /api/payments/history — get payment history */
  getHistory: () => api.get('/api/payments/history'),

  /** GET /api/payments/order/:orderId — get order details */
  getOrderDetails: (orderId) => api.get(`/api/payments/order/${orderId}`),
}

// ─── Email Endpoints ───────────────────────────────────────────────────────

export const emailAPI = {
  /** POST /api/email/send-resume — send resume via email as PDF attachment */
  sendResume: (formData) =>
    api.post('/api/email/send-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export default api
