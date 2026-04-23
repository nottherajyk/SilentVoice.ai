# A Silent Voice (SignSpeak)

**A Silent Voice** (formerly SignText) is a real-time American Sign Language (ASL) detection and translation web application. Built with React, Vite, and MediaPipe, it leverages your webcam to capture hand gestures, track 3D skeletal landmarks, and translate static ASL signs into text instantly. 

The application features a cinematic, elegant aesthetic inspired by the anime movie *A Silent Voice*, using glassmorphism, earthy tones, and a smooth, immersive scrolling experience.

## 🚀 Features

- **Real-Time Translation**: Detects and translates static ASL alphabet signs (A-Z) with high accuracy directly in your browser.
- **Advanced 3D Geometry Mapping**: Uses custom normalization logic on 3D hand landmarks to differentiate between overlapping signs (e.g., distinguishing between M, N, S, T, and A closed fists).
- **Sentence Builder**: Automatically constructs sentences as you sign, complete with spaces, backspaces, and clear functions.
- **Customizable UI overlay**: Change the color of the tracking skeleton dynamically to match your preference.
- **Cinematic Aesthetic**: A highly stylized, premium UI featuring glassmorphic panels, soft cinematic shadows, serif typography, and an immersive full-screen hero layout.
- **Client-Side Processing**: All machine learning and inference run entirely in your browser via MediaPipe WASM, ensuring absolute privacy. No data is sent to external servers.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v3 (Custom earthy, cinematic configuration)
- **Machine Learning Engine**: [Google MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) with TensorFlow.js backing.
- **Animations**: Native CSS smooth scrolling and CSS keyframes.

## 📦 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nottherajyk/SilentVoice.ai.git
   cd SilentVoice.ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port specified in your terminal by Vite).

## 🤟 Usage Instructions

1. Allow camera permissions when prompted by your browser.
2. Click the bouncing arrow to smoothly scroll down to the translation interface.
3. Click "Start Translation" and stand in a well-lit area.
4. Keep your hand approximately 1-2 feet away from your webcam.
5. Form an ASL letter clearly and hold it steady for the AI to register it.
6. Use the control panel to add the detected letter to your translated sentence, add a space, or backspace.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

   Live at - https://silent-voice-ai.vercel.app/
