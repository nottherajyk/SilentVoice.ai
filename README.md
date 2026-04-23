# SilentVoice.ai

SilentVoice.ai (SignText) is a real-time American Sign Language (ASL) detection and translation web application. Built with React, Vite, and MediaPipe, it leverages your webcam to capture hand gestures, track 3D skeletal landmarks, and translate static ASL signs into text instantly.

## 🚀 Features

- **Real-Time Translation**: Detects and translates static ASL alphabet signs (A-Z) with high accuracy.
- **Advanced 3D Geometry Mapping**: Uses custom normalization logic on 3D hand landmarks to differentiate between overlapping signs (e.g., distinguishing between M, N, S, T, and A closed fists).
- **Sentence Builder**: Automatically constructs sentences as you sign, complete with spaces, backspaces, and clear functions.
- **Customizable UI overlay**: Change the color of the tracking skeleton dynamically.
- **Neo-Brutalist Aesthetic**: A highly stylized, high-contrast Y2K bento-box user interface.
- **Client-Side Processing**: All machine learning and inference run entirely in your browser via MediaPipe WASM, ensuring absolute privacy.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v3 (Custom Neo-Brutalist configuration)
- **Machine Learning Engine**: [Google MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- **Fonts**: Archivo Black (Headers), Space Grotesk (Body)

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
   Navigate to `http://localhost:3000` (or the port specified in your terminal).

## 🤟 Usage Instructions

1. Allow camera permissions when prompted by your browser.
2. Stand in a well-lit area.
3. Keep your hand approximately 1-2 feet away from your webcam.
4. Form an ASL letter clearly and hold it steady for the AI to register it.
5. Use the control panel to add the detected letter to your translated sentence, add a space, or backspace.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

   Live at - https://silent-voice-ai.vercel.app/
