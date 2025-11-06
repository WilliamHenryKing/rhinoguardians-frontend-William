/**
 * Map helper utilities for RhinoGuardians
 * Includes functions for calculating distances, bounds, and map-related operations
 */

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees to convert
 * @returns {number} Radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180)
}

/**
 * Format GPS coordinates for display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (lat, lng, precision = 4) => {
  if (lat === undefined || lng === undefined) return 'N/A'
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`
}

/**
 * Calculate the center point of multiple coordinates
 * @param {Array} coordinates - Array of [lat, lng] pairs
 * @returns {Array} Center point [lat, lng]
 */
export const calculateCenter = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return [-23.8859, 31.5205] // Default: Serengeti
  }

  let totalLat = 0
  let totalLng = 0

  coordinates.forEach(([lat, lng]) => {
    totalLat += lat
    totalLng += lng
  })

  return [totalLat / coordinates.length, totalLng / coordinates.length]
}

/**
 * Calculate bounds for a set of coordinates
 * @param {Array} coordinates - Array of [lat, lng] pairs
 * @returns {Array} Bounds [[minLat, minLng], [maxLat, maxLng]]
 */
export const calculateBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null
  }

  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity

  coordinates.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
  })

  return [[minLat, minLng], [maxLat, maxLng]]
}

/**
 * Check if a coordinate is within bounds
 * @param {Array} coord - [lat, lng]
 * @param {Array} bounds - [[minLat, minLng], [maxLat, maxLng]]
 * @returns {boolean} True if within bounds
 */
export const isWithinBounds = (coord, bounds) => {
  if (!coord || !bounds) return false

  const [lat, lng] = coord
  const [[minLat, minLng], [maxLat, maxLng]] = bounds

  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
}

/**
 * Group detections by proximity (clustering)
 * @param {Array} detections - Array of detection objects with gps_lat and gps_lng
 * @param {number} maxDistance - Maximum distance in km to be considered in same cluster
 * @returns {Array} Array of clusters, each containing grouped detections
 */
export const clusterDetections = (detections, maxDistance = 0.5) => {
  if (!detections || detections.length === 0) return []

  const clusters = []
  const processed = new Set()

  detections.forEach((detection, idx) => {
    if (processed.has(idx)) return

    const cluster = [detection]
    processed.add(idx)

    // Find all nearby detections
    detections.forEach((other, otherIdx) => {
      if (processed.has(otherIdx)) return

      const distance = calculateDistance(
        detection.gps_lat,
        detection.gps_lng,
        other.gps_lat,
        other.gps_lng
      )

      if (distance <= maxDistance) {
        cluster.push(other)
        processed.add(otherIdx)
      }
    })

    clusters.push(cluster)
  })

  return clusters
}

/**
 * Get appropriate zoom level based on area coverage
 * @param {Array} bounds - [[minLat, minLng], [maxLat, maxLng]]
 * @returns {number} Zoom level (1-18)
 */
export const getZoomLevel = (bounds) => {
  if (!bounds) return 10

  const [[minLat, minLng], [maxLat, maxLng]] = bounds
  const latDiff = Math.abs(maxLat - minLat)
  const lngDiff = Math.abs(maxLng - minLng)
  const maxDiff = Math.max(latDiff, lngDiff)

  if (maxDiff > 10) return 5
  if (maxDiff > 5) return 7
  if (maxDiff > 2) return 9
  if (maxDiff > 1) return 10
  if (maxDiff > 0.5) return 11
  if (maxDiff > 0.1) return 13
  return 15
}

/**
 * Convert detection status to map marker color
 * @param {string} status - Detection status (confirmed, threat, investigating)
 * @returns {string} Color code
 */
export const getStatusColor = (status) => {
  const colors = {
    confirmed: '#51cf66',
    threat: '#ff6b6b',
    investigating: '#ffd43b',
    unknown: '#868e96'
  }
  return colors[status] || colors.unknown
}

/**
 * Get icon URL for marker based on class
 * @param {string} className - Detection class (rhino, human, vehicle)
 * @param {string} color - Color name (green, red, yellow, etc.)
 * @returns {string} Icon URL
 */
export const getMarkerIcon = (className, color = 'green') => {
  const baseUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-'
  const colorMap = {
    rhino: 'green',
    human: 'red',
    vehicle: 'orange',
    default: 'blue'
  }

  const markerColor = colorMap[className] || colorMap.default
  return `${baseUrl}${markerColor}.png`
}
