# FloodLens — AI Flood Intelligence & Emergency Response Platform
**Civic-Tech Hackathon Solution (PS-48)**

FloodLens is a complete, responsive, full-stack environmental awareness, multi-model flood prediction, and emergency SOS coordination system designed for residents, civic planners, and emergency disaster responders across India.

---

## 🌟 Key Architecture & Capabilities

1. **Interactive Geospatial Flood Map**
   - Built with Leaflet and OpenStreetMap.
   - City-level center focus with georeferenced historical flood markers.
   - Status indicators distinguishing verified incidents from unverified records.

2. **Rainfall Analytics & Charting**
   - Chart.js daily rainfall telemetry visualization in millimetres (mm).
   - High-water mark thresholds (Normal, Heavy $\ge 50$mm, Very Heavy $\ge 100$mm).
   - Preserves missing observation days without zero-filling.

3. **Innovation A: Flood Data Blind-Spot Detector**
   - Flags geographic reporting gaps, low station frequency, and data recency.
   - Distinguishes data completeness from flood risk.

4. **Innovation B: Evidence-Based Locality Explanation**
   - Deterministic contextual explanations synthesized from real meteorological and disaster logs.

5. **Innovation C: Rain-to-Impact Timeline**
   - Aligns daily rainfall bars with historical flood event triggers on a shared axis.

6. **AI Multi-Model Ensemble Risk Engine**
   - **Model A (XGBoost Environmental Saturation):** 7-day cumulative rainfall analysis.
   - **Model B (Temporal Pulse Sequence):** Peak single-day precipitation evaluation.
   - **Model C (Hydro-Topographic Proxy):** Historical frequency and basin susceptibility weighting.

7. **Emergency SOS System (Online & Offline Queuing)**
   - One-tap SOS transmission with unique incident IDs (`SOS-YYYY-XXXX`).
   - Automatically queues requests locally in `localStorage` / `IndexedDB` when offline.
   - Direct hotline references for NDRF (1078) and National Emergency (112).

8. **Role-Based Authentication & Admin Console**
   - JWT session management with bcrypt hashing.
   - Live dispatch queue for managing citizen SOS requests.
   - Verified alert broadcaster and security audit trail.

9. **Multilingual Interface (12 Indian Regional Languages)**
   - Supports English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Assamese, and Urdu (RTL).

---

## 🚀 Quickstart Guide (Windows PowerShell)

### 1. Start Backend Server
```powershell
cd "c:\Users\KISHAN\OneDrive\Desktop\AI(Hackathon)\server"
npm start
# Server listens on http://localhost:5000
```

### 2. Start Frontend Dev Client
```powershell
cd "c:\Users\KISHAN\OneDrive\Desktop\AI(Hackathon)\client"
npm run dev
# Vite runs on http://localhost:3000 (proxies /api to :5000)
```

---

## 🔐 Account Setup

No default accounts or passwords are included. Residents can register through the app. To create an initial administrator, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the server environment before its first start. Set a strong `JWT_SECRET` for deployments; production startup fails if it is missing.
