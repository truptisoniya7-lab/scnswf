/// <reference types="vite/client" />
import axios from 'axios'

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.startsWith('192.168.'));

// On local dev, always default to the local backend on port 8000
const API_BASE = isLocalhost
  ? (import.meta.env.VITE_LOCAL_API_BASE_URL || 'http://localhost:8000/api/v1')
  : (import.meta.env.VITE_API_BASE_URL || 'https://scnswf.onrender.com/api/v1');


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
