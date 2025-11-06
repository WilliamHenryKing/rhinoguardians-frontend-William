import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { icon } from 'leaflet'
import { useTheme } from '../context/ThemeContext'
import 'leaflet/dist/leaflet.css'

const rhinoIcon = icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const threatIcon = icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Component to handle theme-based tile layer switching
function ThemeAwareTileLayer() {
  const { theme } = useTheme()
  const map = useMap()

  // Light mode tiles
  const lightTiles = {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  }

  // Dark mode tiles - Using CartoDB Dark Matter
  const darkTiles = {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }

  const tiles = theme === 'dark' ? darkTiles : lightTiles

  useEffect(() => {
    // Force map to refresh when theme changes
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [theme, map])

  return (
    <TileLayer
      key={theme} // Force re-render when theme changes
      url={tiles.url}
      attribution={tiles.attribution}
    />
  )
}

export default function Map({ detections = [], onMarkerClick }) {
  const center = [-23.8859, 31.5205] // Serengeti

  const getIcon = (className) => {
    return className === 'rhino' ? rhinoIcon : threatIcon
  }

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <ThemeAwareTileLayer />
      {detections.map((detection) => (
        <Marker
          key={detection.id}
          position={[detection.gps_lat, detection.gps_lng]}
          icon={getIcon(detection.class_name)}
          eventHandlers={{ click: () => onMarkerClick && onMarkerClick(detection) }}
        >
          <Popup>
            <div>
              <strong>{detection.class_name}</strong>
              <br />
              Confidence: {(detection.confidence * 100).toFixed(1)}%
              <br />
              {new Date(detection.timestamp).toLocaleString()}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
