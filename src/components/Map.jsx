import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: '<div style="width: 20px; height: 20px; background-color: ' + color + '; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

const rhinoIcon = createCustomIcon('#22c55e')
const threatIcon = createCustomIcon('#ef4444')
const unknownIcon = createCustomIcon('#3b82f6')

function MapController({ center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 10)
    }
  }, [center, zoom, map])

  return null
}

export default function Map({ detections = [], center = [-23.8859, 31.5205], zoom = 10, onMarkerClick }) {
  const getMarkerIcon = (detection) => {
    const className = detection.class_name?.toLowerCase() || ''
    if (className.includes('rhino')) return rhinoIcon
    if (className.includes('human') || className.includes('vehicle') || className.includes('poacher')) return threatIcon
    return unknownIcon
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
      >
        <MapController center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {detections.map((detection) => (
          <Marker
            key={detection.id}
            position={[detection.gps_lat, detection.gps_lng]}
            icon={getMarkerIcon(detection)}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(detection)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">{detection.class_name}</h3>
                <p className="text-xs text-slate-600 mb-1">
                  Confidence: {(detection.confidence * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-slate-600">
                  {new Date(detection.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  )
}
