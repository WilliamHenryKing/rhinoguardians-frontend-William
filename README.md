# 🦏 RhinoGuardians Frontend

**React dashboard for RhinoGuardians - Interactive map & real-time alert visualization**

Built for **AI Genesis Hackathon 2025** (Nov 14-19) | Lead: William

---

## 📋 Overview

This is the frontend for RhinoGuardians. It provides:
- **Interactive Map** – Displays all detected rhinos and threats with GPS pins
- **Real-Time Alerts** – Instant notifications when poachers/threats are detected
- **Detection History** – Browse past detections with filters (date, class, location)
- **Analytics Dashboard** – Threat heatmaps, ranger response metrics
- **Responsive Design** – Works on desktop, tablet, mobile

---

## 🎨 Tech Stack

- **Framework:** React 18+
- **Styling:** CSS3, Responsive Design
- **Maps:** Leaflet.js / Mapbox GL
- **State Management:** React Hooks + Context API
- **HTTP Client:** Axios
- **Build Tool:** Vite

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone repo
git clone https://github.com/RhinoGuardians/rhinoguardians-frontend.git
cd rhinoguardians-frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Visit: http://localhost:5173
```

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # Global styles
│   ├── components/
│   │   ├── Map.jsx              # Leaflet map component
│   │   ├── DetectionCard.jsx    # Individual detection display
│   │   ├── AlertNotification.jsx # Toast alerts
│   │   ├── Header.jsx           # Navigation bar
│   │   └── Sidebar.jsx          # Filters & controls
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main dashboard view
│   │   ├── History.jsx          # Detection history
│   │   └── Analytics.jsx        # Stats & heatmaps
│   ├── api/
│   │   └── client.js            # Axios setup, API calls
│   ├── hooks/
│   │   ├── useDetections.js     # Fetch detections hook
│   │   └── useAlerts.js         # Real-time alerts hook
│   ├── utils/
│   │   ├── formatDate.js        # Date formatting
│   │   └── mapHelpers.js        # Map utilities
│   └── main.jsx                 # React entry point
├── public/                      # Static assets
├── package.json
├── vite.config.js
└── README.md                    # This file
```

---

## 🎯 Key Features

### 1. Interactive Map
```jsx
<Map 
  detections={detections}
  onMarkerClick={handleMarkerClick}
  center={[-23.8859, 31.5205]}  // Serengeti
  zoom={10}
/>
```
- Plots all detections as pins (green=rhino, red=threat)
- Click to view details
- Zoom/pan to explore reserve
- Real-time updates

### 2. Detection Display
```jsx
<DetectionCard 
  id={detection.id}
  class={detection.class_name}
  confidence={detection.confidence}
  location={[detection.gps_lat, detection.gps_lng]}
  timestamp={detection.timestamp}
  image={detection.image_path}
/>
```
- Shows thumbnail image
- Confidence score & class
- GPS coordinates
- Exact timestamp
- "Alert Ranger" button

### 3. Real-Time Alerts
```jsx
<AlertNotification 
  type="threat_detected"
  message="Potential poacher detected in Zone A!"
  severity="critical"
  autoClose={5000}
/>
```
- Toast notifications pop up instantly
- Color-coded by severity (info, warning, critical)
- Auto-dismiss after 5s or manual close

### 4. Filters & Search
- Filter by: Class (rhino/human/vehicle), Date range, Location zone
- Search by detection ID
- Show/hide certain threat levels

---

## 🔄 API Integration

The frontend connects to the **FastAPI backend** at `http://localhost:8000` (or deployed URL).

### Key Endpoints

```javascript
// Fetch detections
GET /detections/?limit=50&class_name=rhino

// Upload image for detection
POST /upload/ 
  - FormData with image + GPS coords

// Fetch alerts
GET /alerts/?limit=20
```

### Example API Call

```javascript
// In src/api/client.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const fetchDetections = async (filters = {}) => {
  const response = await axios.get(`${API_BASE}/detections/`, { params: filters });
  return response.data.detections;
};

export const uploadImage = async (file, gpsLat, gpsLng) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('gps_lat', gpsLat);
  formData.append('gps_lng', gpsLng);

  const response = await axios.post(`${API_BASE}/upload/`, formData);
  return response.data;
};
```

---

## 📱 Responsive Design

- **Desktop (1200px+):** Full dashboard with map + sidebar
- **Tablet (768px-1199px):** Stacked layout, map full width
- **Mobile (<768px):** Map takes priority, alerts in dropdown

---

## 🎨 Customization

### Colors
Edit `src/App.css`:
```css
:root {
  --color-primary: #2d8659;      /* Green */
  --color-alert: #ff6b6b;        /* Red */
  --color-info: #4dabf7;         /* Blue */
  --color-success: #51cf66;      /* Success green */
}
```

### Map Style
```javascript
// In src/components/Map.jsx
const tileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// Or use Mapbox: 'mapbox://styles/mapbox/satellite-v9'
```

---

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
# Creates optimized build in dist/
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://rhinoguardians-frontend

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific component
npm test -- Map.test.jsx

# Coverage report
npm test -- --coverage
```

---

## 🔗 Environment Variables

Create `.env.local`:
```env
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_ENVIRONMENT=development
```

In production (`.env.production`):
```env
VITE_API_URL=https://api.rhinoguardians.ai
VITE_MAPBOX_TOKEN=prod_mapbox_token
VITE_ENVIRONMENT=production
```

---

## 📊 Performance Tips

- **Lazy load** map component until needed
- **Memoize** expensive computations with `useMemo`
- **Debounce** filter changes to reduce API calls
- **Virtual scrolling** for long detection lists
- **Optimize images** before display

---

## 🐛 Common Issues

**Issue:** Map not displaying
- **Solution:** Check Leaflet CSS is imported: `import 'leaflet/dist/leaflet.css'`

**Issue:** Detections not updating
- **Solution:** Ensure backend is running and `VITE_API_URL` is correct

**Issue:** Mobile layout broken
- **Solution:** Check media queries in `App.css`, ensure viewport meta tag is set

---

## 🎬 Future Features

- [ ] Real-time WebSocket updates (instead of polling)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (threat prediction ML model)
- [ ] Ranger team management dashboard
- [ ] Integration with drone APIs
- [ ] Video stream support (instead of images)

---

## 📚 Resources

- [React Docs](https://react.dev/)
- [Leaflet Docs](https://leafletjs.com/)
- [Vite Docs](https://vitejs.dev/)
- [Axios Docs](https://axios-http.com/)

---

## 👤 Lead: William

Questions? Open an issue or ping the frontend team!

---

**Built with ❤️ for RhinoGuardians AI Genesis Hackathon 2025**
