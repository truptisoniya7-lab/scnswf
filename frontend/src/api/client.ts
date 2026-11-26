/// <reference types="vite/client" />
import axios from 'axios'

const DEFAULT_API_BASE =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? 'https://scnswf.onrender.com/api/v1'
    : 'http://localhost:8000/api/v1'

const API_BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor — attach JWT for admin routes
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      // Redirect to login if admin route
    }
    return Promise.reject(error)
  }
)

export default apiClient
