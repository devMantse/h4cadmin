import axios from 'axios'

export const API_URL = (import.meta as any).env.VITE_API_URL || 'https://h4cbackend-three.vercel.app'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function mediaSrc(url?: string) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return API_URL.replace(/\/$/, '') + url
}

export function handleError(e: any) {
  if (e?.response?.data?.message) {
    return Array.isArray(e.response.data.message)
      ? e.response.data.message.join(', ')
      : e.response.data.message
  }
  return e?.message || 'Unexpected error'
}
