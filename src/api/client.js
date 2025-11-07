import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message)
    
    if (error.response) {
      // Server responded with error
      throw new Error('Server error: ' + error.response.status + ' ' + (error.response.data?.message || ''))
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Check if backend is running.')
    } else {
      // Error in request setup
      throw new Error('Request failed: ' + error.message)
    }
  }
)

/**
 * Fetch all detections with optional filters
 */
export const fetchDetections = async (filters = {}) => {
  try {
    const response = await api.get('/detections/', { params: filters })
    return response.data.detections || response.data
  } catch (error) {
    console.error('Failed to fetch detections:', error)
    throw error
  }
}

/**
 * Upload an image for detection
 */
export const uploadImage = async (file, gpsLat, gpsLng) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('gps_lat', gpsLat)
    formData.append('gps_lng', gpsLng)

    const response = await api.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    return response.data
  } catch (error) {
    console.error('Failed to upload image:', error)
    throw error
  }
}

/**
 * Fetch alerts
 */
export const fetchAlerts = async (limit = 20) => {
  try {
    const response = await api.get('/alerts/', { params: { limit } })
    return response.data.alerts || response.data
  } catch (error) {
    console.error('Failed to fetch alerts:', error)
    throw error
  }
}

/**
 * Fetch analytics data
 */
export const fetchAnalytics = async () => {
  try {
    const response = await api.get('/analytics/')
    return response.data
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    throw error
  }
}

export default api
