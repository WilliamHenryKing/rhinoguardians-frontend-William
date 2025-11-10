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
    ? `<div class="absolute -left-[5px] -top-[5px] h-[30px] w-[30px] rounded-full animate-[pulse_2s_ease-out_infinite]" style="background-color: ${color}40;"></div>`
    : ''

  return L.divIcon({
    className: 'custom-marker',
    html:
      pulseHtml +
      '<div style="width: 20px; height: 20px; background-color: ' +
      color +
      '; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative; z-index: 10;"></div>',
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
  html:
    '<div style="width: 24px; height: 24px; background-color: #3b82f6; border: 3px solid white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 12px; font-weight: bold;">R</span></div>',
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
    <div className="map-popup">
      <div className="map-popup-content">
        {/* Detection info */}
        {detection.image_path && (
          <img
            src={detection.image_path}
            alt={detection.class_name}
            className="map-popup-image"
          />
        )}

        <h3 className="map-popup-title">{detection.class_name}</h3>
        <p className="map-popup-meta">
          Confidence: {(detection.confidence * 100).toFixed(1)}%
        </p>
        <p className="map-popup-meta">
          {new Date(detection.timestamp).toLocaleString()}
        </p>

        {/* Alert status */}
        {alerts.length > 0 && (
          <div className="map-popup-section">
            <p className="map-popup-label">Alert Status:</p>
            {alerts.map(alert => (
              <p key={alert.id} className="map-popup-alert">
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
              className="map-popup-button map-popup-button--success"
            >
              View Alert
            </button>
          ) : (
            <button
              onClick={() => onAlertRanger(detection)}
              className="map-popup-button map-popup-button--danger"
            >
              Alert Ranger
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default function Map({
  detections = [],
  center = [-23.8859, 31.5205],
  zoom = 10,
  onMarkerClick,
  onAlertCreated,
  className = '',
}) {
  const { getAlertsForDetection, rangerPositions, activeAlerts, createAlertFromDetection } = useAlertRanger()
  const [selectedDetection, setSelectedDetection] = useState(null)
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const mapRef = useRef(null)
  const canLocate = typeof navigator !== 'undefined' && Boolean(navigator.geolocation)

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

  const handleZoomIn = () => {
    mapRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapRef.current?.zoomOut()
  }

  const handleLocate = () => {
    if (!canLocate) return

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        mapRef.current?.flyTo([latitude, longitude], Math.max(mapRef.current?.getZoom() ?? 10, 14), {
          duration: 1.2,
        })
        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  const legendItems = [
    { label: 'Rhino', swatch: 'bg-rhino-500' },
    { label: 'Threat', swatch: 'bg-threat-500' },
    { label: 'Unknown', swatch: 'bg-blue-500' },
    { label: 'Alert', swatch: 'bg-red-500' },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={[
          'relative w-full min-h-[320px] rounded-xl border border-white/10 shadow-2xl overflow-hidden',
          'aspect-[4/5] sm:aspect-[16/9] md:aspect-[16/9] lg:aspect-[16/10] xl:aspect-auto',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-full w-full"
          zoomControl={true}
          whenCreated={(map) => {
            mapRef.current = map
          }}
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
                <div className="map-popup">
                  <div className="map-popup-content">
                    <h3 className="map-popup-title">Ranger {ranger.name || ranger.id}</h3>
                    <p className="map-popup-meta">
                      Last update: {ranger.lastUpdate ? new Date(ranger.lastUpdate).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
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

        <div className="pointer-events-none absolute left-4 top-4 z-[1000] max-w-full">
          <div className="flex flex-row flex-wrap gap-3 pointer-events-auto sm:flex-col md:flex-row lg:gap-4 xl:gap-4">
            <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-slate-900/80 backdrop-blur-sm text-slate-100 shadow-lg">
              <button
                type="button"
                onClick={handleZoomIn}
                className="px-3 py-2 text-sm font-semibold transition hover:bg-white/10"
                aria-label="Zoom in"
              >
                +
              </button>
              <div className="h-6 w-px bg-white/15" />
              <button
                type="button"
                onClick={handleZoomOut}
                className="px-3 py-2 text-sm font-semibold transition hover:bg-white/10"
                aria-label="Zoom out"
              >
                -
              </button>
            </div>

            <button
              type="button"
              onClick={handleLocate}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 shadow-lg backdrop-blur-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLocating || !canLocate}
              aria-label="Locate your position"
            >
              {isLocating ? 'Locating…' : 'Locate'}
            </button>

            <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 shadow-lg backdrop-blur-sm">
              {legendItems.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.swatch}`} />
                  <span className="font-medium">{item.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alert Confirm Modal */}
      <AlertConfirmModal
        detection={selectedDetection}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onConfirm={handleConfirmAlert}
      />
    </>
  )
}
