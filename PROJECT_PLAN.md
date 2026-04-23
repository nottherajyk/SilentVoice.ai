# 🤟 Sign Language to Text — Project Plan

## 1. Project Overview

| Field | Detail |
|-------|--------|
| **App Name** | Sign Language to Text (SLT) |
| **Goal** | Real-time ASL alphabet detection from webcam → live text output |
| **Core Features** | Webcam feed, hand tracking, gesture classification, sentence builder, confidence meter |
| **Tech Stack** | React 18 + Vite 8, Tailwind CSS v3, MediaPipe Hands (CDN), Rule-based ASL Classifier |

---

## 2. Functional Requirements

| # | Requirement | Priority | Status |
|---|-------------|----------|--------|
| F1 | Webcam access with permission handling | P0 | ✅ |
| F2 | Real-time hand landmark detection (21 points) | P0 | ✅ |
| F3 | ASL letter recognition (A–Z rule-based engine) | P0 | ✅ |
| F4 | Convert detected gesture to text character | P0 | ✅ |
| F5 | Sentence builder — append letters into words/sentences | P0 | ✅ |
| F6 | Controls: Add Letter, Space, Backspace, Clear | P0 | ✅ |
| F7 | Confidence score display (percentage + meter) | P0 | ✅ |
| F8 | Responsive UI (mobile + desktop) | P0 | ✅ |
| F9 | Loading state while camera initializes | P1 | ✅ |
| F10 | Error states (no cam, no hand, unsupported browser) | P1 | ✅ |
| F11 | Hand landmark overlay on video feed | P1 | ✅ |
| F12 | Smooth 30fps prediction loop | P1 | ✅ |

---

## 3. Architecture

### 3.1 Frontend Components

```
App
├── Header              — Title, subtitle, status badges (camera/hand/FPS)
├── CameraPanel         — Live webcam + canvas overlay + loading/error states
├── DetectedLetter      — Large animated letter + inline confidence bar
├── SentencePanel       — Built text output with cursor + copy + word count
├── ControlsPanel       — Add / Space / Backspace / Clear buttons
├── ConfidenceMeter     — Circular SVG gauge + progress bar + help text
├── StatusBar           — System status row (status/hand/FPS/letter)
└── Footer              — Tip cards + credits
```

### 3.2 ML Pipeline Flow

```
Webcam Frame
  → MediaPipe Hands CDN (21 landmarks × 3D)
  → Normalize landmarks (relative to wrist)
  → Rule-based ASL classifier (A–Z)
  → Letter + Confidence score
  → React state update → UI re-render
```

### 3.3 Data Flow

```
[Camera] → [MediaPipe CDN] → [Landmarks] → [Classifier] → [React State]
                                                              ↓
                                              [DetectedLetter] [Sentence]
```

---

## 4. File Structure

```
SLT/
├── PROJECT_PLAN.md
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css               — Global styles, Tailwind, glassmorphism, animations
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── CameraPanel.jsx
│   │   ├── DetectedLetter.jsx
│   │   ├── SentencePanel.jsx
│   │   ├── ControlsPanel.jsx
│   │   ├── ConfidenceMeter.jsx
│   │   ├── StatusBar.jsx
│   │   └── Footer.jsx
│   ├── hooks/
│   │   └── useHandDetection.js  — MediaPipe CDN loader + camera + classification
│   └── utils/
│       ├── handClassifier.js    — Rule-based A–Z ASL classifier
│       └── landmarkUtils.js     — Geometry helpers (distance, angle, curl)
```

---

## 5. Development Checklist

### Phase 1 — Scaffold
- [x] Initialize Vite + React project
- [x] Install Tailwind CSS v3
- [x] Install MediaPipe Hands (switched to CDN)
- [x] Create folder structure

### Phase 2 — Core ML
- [x] Implement webcam hook (`useHandDetection`)
- [x] Integrate MediaPipe Hands via CDN
- [x] Build ASL rule-based classifier (A–Z)
- [x] Landmark normalization utilities

### Phase 3 — UI Components
- [x] Header component
- [x] CameraPanel with overlay canvas
- [x] DetectedLetter display
- [x] SentencePanel with cursor
- [x] ControlsPanel buttons
- [x] ConfidenceMeter gauge
- [x] StatusBar
- [x] Footer

### Phase 4 — Integration
- [x] Wire ML pipeline to UI state
- [x] Prediction loop (FPS-tracked)
- [x] Sentence builder logic
- [x] Error handling states

### Phase 5 — Polish
- [x] Dark gradient background
- [x] Glassmorphism cards
- [x] Smooth animations & transitions
- [x] Mobile responsive layout
- [x] Loading states
- [x] Final QA

---

## 6. Bug Log

| # | Bug | Status | Fix |
|---|-----|--------|-----|
| 1 | `@mediapipe/hands` npm package has no default ESM export, crashes Vite | ✅ Fixed | Switched to CDN loading via `<script>` tags from jsdelivr |
| 2 | Vite scaffold used TypeScript template (`main.ts`) instead of React JSX | ✅ Fixed | Installed `@vitejs/plugin-react`, created `vite.config.js`, replaced `main.ts` with `main.jsx` |
| 3 | Root element ID mismatch (`app` vs `root`) | ✅ Fixed | Updated `index.html` to use `id="root"` |
| 4 | Overlapping classification conditions for M, T, S, N, Z signs | ✅ Fixed | Rewrote fist-family classifier with mutually-exclusive geometric rules based on thumb position/depth. |

---

## 7. Final QA Checklist

- [x] Camera panel renders with Start Camera button
- [x] Hand landmarks overlay canvas ready
- [x] ASL classifier covers A–Z letters
- [x] Sentence builder works (add/space/backspace/clear)
- [x] Confidence meter (circular gauge + bar) displays
- [x] Error states display correctly (no cam, no hand, unsupported)
- [x] UI is clean and premium (dark gradient + glassmorphism)
- [x] Mobile responsive (single column on narrow, 2-col on lg)
- [x] No console errors
- [x] Loading state shown during camera init
- [x] Keyboard shortcuts (Enter/Space/Backspace/Escape)
- [x] Copy to clipboard button on sentence
- [x] FPS counter in status bar

---

## 8. Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Requirements:**
- Node.js 18+
- A webcam
- Chrome, Firefox, or Edge (WebRTC + WebGL support)

**Usage:**
1. Click "Start Camera" to begin
2. Show ASL hand signs to the camera
3. Click "Add Letter" or press Enter to append the detected letter
4. Use Space / Backspace / Clear to build sentences
5. Click "Copy" to copy text to clipboard
