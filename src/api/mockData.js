/**
 * MOCK DATA FILE
 * This file provides mock data for development and testing purposes
 * since the backend API is not yet available.
 *
 * When the backend is ready, replace the imports of this file
 * with actual API calls from client.js
 */

// Sample detection data with various classes and locations
export const mockDetections = [
  {
    id: 'DET-001',
    class_name: 'rhino',
    confidence: 0.95,
    gps_lat: -23.8859,
    gps_lng: 31.5205,
    timestamp: '2025-11-06T08:30:00Z',
    image_path: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400',
    zone: 'Zone A',
    status: 'confirmed'
  },
  {
    id: 'DET-002',
    class_name: 'human',
    confidence: 0.88,
    gps_lat: -23.8900,
    gps_lng: 31.5300,
    timestamp: '2025-11-06T09:15:00Z',
    image_path: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
    zone: 'Zone A',
    status: 'threat'
  },
  {
    id: 'DET-003',
    class_name: 'rhino',
    confidence: 0.92,
    gps_lat: -23.8750,
    gps_lng: 31.5100,
    timestamp: '2025-11-06T09:45:00Z',
    image_path: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400',
    zone: 'Zone B',
    status: 'confirmed'
  },
  {
    id: 'DET-004',
    class_name: 'vehicle',
    confidence: 0.91,
    gps_lat: -23.8950,
    gps_lng: 31.5350,
    timestamp: '2025-11-06T10:00:00Z',
    image_path: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
    zone: 'Zone A',
    status: 'threat'
  },
  {
    id: 'DET-005',
    class_name: 'rhino',
    confidence: 0.97,
    gps_lat: -23.8650,
    gps_lng: 31.5000,
    timestamp: '2025-11-06T10:30:00Z',
    image_path: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=400',
    zone: 'Zone B',
    status: 'confirmed'
  },
  {
    id: 'DET-006',
    class_name: 'human',
    confidence: 0.85,
    gps_lat: -23.8800,
    gps_lng: 31.5250,
    timestamp: '2025-11-06T11:00:00Z',
    image_path: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    zone: 'Zone A',
    status: 'threat'
  },
  {
    id: 'DET-007',
    class_name: 'rhino',
    confidence: 0.94,
    gps_lat: -23.8700,
    gps_lng: 31.5150,
    timestamp: '2025-11-06T11:30:00Z',
    image_path: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400',
    zone: 'Zone B',
    status: 'confirmed'
  },
  {
    id: 'DET-008',
    class_name: 'human',
    confidence: 0.90,
    gps_lat: -23.8920,
    gps_lng: 31.5320,
    timestamp: '2025-11-06T12:00:00Z',
    image_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    zone: 'Zone C',
    status: 'threat'
  },
  {
    id: 'DET-009',
    class_name: 'rhino',
    confidence: 0.96,
    gps_lat: -23.8600,
    gps_lng: 31.4950,
    timestamp: '2025-11-06T12:30:00Z',
    image_path: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400',
    zone: 'Zone B',
    status: 'confirmed'
  },
  {
    id: 'DET-010',
    class_name: 'vehicle',
    confidence: 0.87,
    gps_lat: -23.8880,
    gps_lng: 31.5280,
    timestamp: '2025-11-06T13:00:00Z',
    image_path: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
    zone: 'Zone A',
    status: 'investigating'
  },
  {
    id: 'DET-011',
    class_name: 'rhino',
    confidence: 0.93,
    gps_lat: -23.8550,
    gps_lng: 31.4900,
    timestamp: '2025-11-06T13:30:00Z',
    image_path: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=400',
    zone: 'Zone C',
    status: 'confirmed'
  },
  {
    id: 'DET-012',
    class_name: 'human',
    confidence: 0.89,
    gps_lat: -23.8940,
    gps_lng: 31.5340,
    timestamp: '2025-11-06T14:00:00Z',
    image_path: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
    zone: 'Zone A',
    status: 'threat'
  }
]

// Sample alert data
export const mockAlerts = [
  {
    id: 'ALERT-001',
    type: 'critical',
    message: 'Potential poacher detected in Zone A!',
    detection_id: 'DET-002',
    timestamp: '2025-11-06T09:15:00Z',
    dismissed: false
  },
  {
    id: 'ALERT-002',
    type: 'warning',
    message: 'Unauthorized vehicle spotted in Zone A',
    detection_id: 'DET-004',
    timestamp: '2025-11-06T10:00:00Z',
    dismissed: false
  },
  {
    id: 'ALERT-003',
    type: 'info',
    message: 'New rhino detected in Zone B',
    detection_id: 'DET-005',
    timestamp: '2025-11-06T10:30:00Z',
    dismissed: false
  },
  {
    id: 'ALERT-004',
    type: 'critical',
    message: 'Suspicious human activity in Zone A',
    detection_id: 'DET-006',
    timestamp: '2025-11-06T11:00:00Z',
    dismissed: false
  }
]

// Mock analytics data
export const mockAnalytics = {
  totalDetections: 156,
  rhinoCount: 89,
  threatCount: 45,
  vehicleCount: 22,
  responseTime: 4.5, // minutes
  rangerEfficiency: 87, // percentage
  heatmapData: [
    { lat: -23.8859, lng: 31.5205, intensity: 0.8 },
    { lat: -23.8900, lng: 31.5300, intensity: 0.9 },
    { lat: -23.8750, lng: 31.5100, intensity: 0.6 },
    { lat: -23.8950, lng: 31.5350, intensity: 0.7 },
    { lat: -23.8650, lng: 31.5000, intensity: 0.5 },
    { lat: -23.8800, lng: 31.5250, intensity: 0.8 },
    { lat: -23.8700, lng: 31.5150, intensity: 0.4 },
    { lat: -23.8920, lng: 31.5320, intensity: 0.9 },
    { lat: -23.8600, lng: 31.4950, intensity: 0.3 },
    { lat: -23.8880, lng: 31.5280, intensity: 0.6 }
  ],
  detectionsByHour: [
    { hour: 0, count: 2 },
    { hour: 1, count: 1 },
    { hour: 2, count: 0 },
    { hour: 3, count: 1 },
    { hour: 4, count: 3 },
    { hour: 5, count: 5 },
    { hour: 6, count: 8 },
    { hour: 7, count: 12 },
    { hour: 8, count: 15 },
    { hour: 9, count: 18 },
    { hour: 10, count: 14 },
    { hour: 11, count: 16 },
    { hour: 12, count: 13 },
    { hour: 13, count: 11 },
    { hour: 14, count: 9 },
    { hour: 15, count: 7 },
    { hour: 16, count: 6 },
    { hour: 17, count: 4 },
    { hour: 18, count: 3 },
    { hour: 19, count: 2 },
    { hour: 20, count: 1 },
    { hour: 21, count: 1 },
    { hour: 22, count: 0 },
    { hour: 23, count: 1 }
  ]
}

// Mock function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions (to be replaced with real API calls later)
export const getMockDetections = async (filters = {}) => {
  await delay(300) // Simulate network delay

  let filtered = [...mockDetections]

  // Apply filters
  if (filters.class_name) {
    filtered = filtered.filter(d => d.class_name === filters.class_name)
  }

  if (filters.zone) {
    filtered = filtered.filter(d => d.zone === filters.zone)
  }

  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit)
  }

  return filtered
}

export const getMockAlerts = async (filters = {}) => {
  await delay(200)

  let filtered = [...mockAlerts]

  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit)
  }

  return filtered
}

export const getMockAnalytics = async () => {
  await delay(400)
  return mockAnalytics
}
