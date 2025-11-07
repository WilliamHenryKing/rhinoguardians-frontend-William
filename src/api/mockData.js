/**
 * Mock data for development and testing
 * Replace with real API calls when backend is ready
 */

const mockDetections = [
  {
    id: 1,
    class_name: 'Black Rhino',
    confidence: 0.95,
    gps_lat: -23.8859,
    gps_lng: 31.5205,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    image_path: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400'
  },
  {
    id: 2,
    class_name: 'Human',
    confidence: 0.87,
    gps_lat: -23.8899,
    gps_lng: 31.5255,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    image_path: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400'
  },
  {
    id: 3,
    class_name: 'White Rhino',
    confidence: 0.92,
    gps_lat: -23.8819,
    gps_lng: 31.5175,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    image_path: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400'
  },
  {
    id: 4,
    class_name: 'Vehicle',
    confidence: 0.78,
    gps_lat: -23.8939,
    gps_lng: 31.5295,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    image_path: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
  },
  {
    id: 5,
    class_name: 'Black Rhino',
    confidence: 0.89,
    gps_lat: -23.8779,
    gps_lng: 31.5135,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    image_path: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400'
  },
  {
    id: 6,
    class_name: 'Poacher',
    confidence: 0.91,
    gps_lat: -23.8969,
    gps_lng: 31.5325,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    image_path: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400'
  },
  {
    id: 7,
    class_name: 'White Rhino',
    confidence: 0.94,
    gps_lat: -23.8749,
    gps_lng: 31.5105,
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    image_path: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400'
  },
  {
    id: 8,
    class_name: 'Black Rhino',
    confidence: 0.96,
    gps_lat: -23.8829,
    gps_lng: 31.5185,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    image_path: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400'
  }
]

export const getMockDetections = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return [...mockDetections]
}

export const getMockAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    totalDetections: mockDetections.length,
    rhinoCount: mockDetections.filter(d => d.class_name.includes('Rhino')).length,
    threatCount: mockDetections.filter(d => 
      d.class_name.includes('Human') || 
      d.class_name.includes('Poacher') || 
      d.class_name.includes('Vehicle')
    ).length,
    avgConfidence: mockDetections.reduce((sum, d) => sum + d.confidence, 0) / mockDetections.length
  }
}
