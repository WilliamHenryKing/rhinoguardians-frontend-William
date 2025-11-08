import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import { useAlertRanger } from '../context/AlertRangerContext'
import { AlertStatus, shouldShowAlertRanger } from '../types/alert'
import AlertConfirmModal from './AlertConfirmModal'

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (color, pulse = false) => {
  const pulseHtml = pulse
    ? '<div style="width: 30px; height: 30px; background-color: ' + color + '40; border-radius: 50%; position: absolute; top: -5px; left: -5px; animation: pulse 2s ease-out infinite;"></div>'
    : ''

  return L.divIcon({
    className: 'custom-marker',
    html: pulseHtml + '<div style="width: 20px; height: 20px; background-color: ' + color + '; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative; z-index: 10;"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

const rhinoIcon = createCustomIcon('#22c55e')
const threatIcon = createCustomIcon('#ef4444')
const unknownIcon = createCustomIcon('#3b82f6')
const alertActiveIcon = createCustomIcon('#ef4444', true)
const alertAcknowledgedIcon = createCustomIcon('#f59e0b')
const alertResolvedIcon = createCustomIcon('#22c55e')

// Ranger icon
const rangerIcon = L.divIcon({
  className: 'custom-ranger-marker',
  html: '<div style="width: 24px; height: 24px; background-color: #3b82f6; border: 3px solid white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 12px; font-weight: bold;">R</span></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function MapController({ center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 10)
    }
  }, [center, zoom, map])

  return null
}

// Detection Marker Popup with Alert Button
function DetectionPopup({ detection, onAlertRanger, onViewAlert }) {
  const { hasActiveAlert, getAlertsForDetection } = useAlertRanger()
  const showAlertButton = shouldShowAlertRanger(detection)
  const hasAlert = hasActiveAlert(detection.id)
  const alerts = getAlertsForDetection(detection.id)

  return (
    <div className="p-2 min-w-[200px]">
      {/* Detection info */}
      {detection.image_path && (
        <img
          src={detection.image_path}
          alt={detection.class_name}
          className="w-full h-24 object-cover rounded mb-2"
        />
      )}

      <h3 className="font-bold text-sm mb-1">{detection.class_name}</h3>
      <p className="text-xs text-slate-600 mb-1">
        Confidence: {(detection.confidence * 100).toFixed(1)}%
      </p>
      <p className="text-xs text-slate-600 mb-2">
        {new Date(detection.timestamp).toLocaleString()}
      </p>

      {/* Alert status */}
      {alerts.length > 0 && (
        <div className="mb-2 pb-2 border-b border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Alert Status:</p>
          {alerts.map(alert => (
            <p key={alert.id} className="text-xs font-semibold text-orange-600 capitalize">
              {alert.status.replace(/_/g, ' ')}
            </p>
          ))}
        </div>
      )}

      {/* Alert button */}
      {showAlertButton && (
        hasAlert ? (
          <button
            onClick={() => onViewAlert(detection)}
            className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors"
          >
            View Alert
          </button>
        ) : (
          <button
            onClick={() => onAlertRanger(detection)}
            className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
          >
            Alert Ranger
          </button>
        )
      )}
    </div>
  )
}

export default function Map({ detections = [], center = [-23.8859, 31.5205], zoom = 10, onMarkerClick, onAlertCreated }) {
  const { getAlertsForDetection, rangerPositions, activeAlerts, createAlertFromDetection } = useAlertRanger()
  const [selectedDetection, setSelectedDetection] = useState(null)
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)

  const getMarkerIcon = (detection) => {
    const className = detection.class_name?.toLowerCase() || ''
    const alerts = getAlertsForDetection(detection.id)

    // Check if this detection has an active alert
    if (alerts.length > 0) {
      const activeAlert = alerts[0]
      if (activeAlert.status === AlertStatus.RESOLVED) {
        return alertResolvedIcon
      } else if (activeAlert.status === AlertStatus.ACKNOWLEDGED || activeAlert.status === AlertStatus.IN_PROGRESS) {
        return alertAcknowledgedIcon
      } else if (activeAlert.status === AlertStatus.SENT || activeAlert.status === AlertStatus.CREATED) {
        return alertActiveIcon
      }
    }

    // Default detection icons
    if (className.includes('rhino')) return rhinoIcon
    if (className.includes('human') || className.includes('vehicle') || className.includes('poacher')) return threatIcon
    return unknownIcon
  }

  const handleAlertRanger = (detection) => {
    setSelectedDetection(detection)
    setIsAlertModalOpen(true)
  }

  const handleViewAlert = (detection) => {
    if (onAlertCreated) {
      onAlertCreated(detection.id)
    }
  }

  const handleConfirmAlert = async (overrides) => {
    if (!selectedDetection) return

    try {
      const newAlert = await createAlertFromDetection(selectedDetection, overrides)
      setIsAlertModalOpen(false)

      if (onAlertCreated) {
        onAlertCreated(newAlert)
      }
    } catch (error) {
      throw error
    }
  }

  // Build ranger-to-alert lines
  const rangerLines = []
  if (rangerPositions.length > 0) {
    activeAlerts.forEach(alert => {
      if (alert.status === AlertStatus.IN_PROGRESS && alert.rangerAssigned) {
        const ranger = rangerPositions.find(r => r.id === alert.rangerAssigned)
        if (ranger) {
          rangerLines.push({
            from: [ranger.lat, ranger.lng],
            to: [alert.location.lat, alert.location.lng],
            alertId: alert.id
          })
        }
      }
    })
  }

  return (
    <>
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

          {/* Detection markers */}
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
                <DetectionPopup
                  detection={detection}
                  onAlertRanger={handleAlertRanger}
                  onViewAlert={handleViewAlert}
                />
              </Popup>
            </Marker>
          ))}

          {/* Ranger position markers */}
          {rangerPositions.map((ranger) => (
            <Marker
              key={ranger.id}
              position={[ranger.lat, ranger.lng]}
              icon={rangerIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm mb-1">Ranger {ranger.name || ranger.id}</h3>
                  <p className="text-xs text-slate-600">
                    Last update: {ranger.lastUpdate ? new Date(ranger.lastUpdate).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Lines from rangers to alerts */}
          {rangerLines.map((line, idx) => (
            <Polyline
              key={idx}
              positions={[line.from, line.to]}
              color="#3b82f6"
              weight={2}
              dashArray="5, 10"
            />
          ))}
        </MapContainer>
      </motion.div>

      {/* Alert Confirm Modal */}
      <AlertConfirmModal
        detection={selectedDetection}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onConfirm={handleConfirmAlert}
      />

      {/* Add pulse animation to head */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.4;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
