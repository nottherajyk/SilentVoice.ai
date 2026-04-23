import React from 'react';

function Footer() {
  return (
    <footer className="mt-12 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="brutal-panel bg-white p-6">
          <div className="text-4xl mb-4">☀️</div>
          <h4 className="font-display font-black uppercase text-xl mb-2">Good Lighting</h4>
          <p className="font-bold text-sm">Ensure your hand is well-lit and clearly visible against the background.</p>
        </div>

        <div className="brutal-panel bg-white p-6">
          <div className="text-4xl mb-4">📏</div>
          <h4 className="font-display font-black uppercase text-xl mb-2">Proper Distance</h4>
          <p className="font-bold text-sm">Keep your hand 1-2 feet from the camera for best detection.</p>
        </div>

        <div className="brutal-panel bg-white p-6">
          <div className="text-4xl mb-4">🖐️</div>
          <h4 className="font-display font-black uppercase text-xl mb-2">Clear Gestures</h4>
          <p className="font-bold text-sm">Form each ASL letter clearly and hold steady for 1-2 seconds.</p>
        </div>

      </div>

      <div className="text-center pb-8">
        <p className="font-bold uppercase text-sm">
          Powered by <a href="https://developers.google.com/mediapipe/solutions/vision/hand_landmarker" target="_blank" rel="noreferrer" className="underline hover:bg-black hover:text-white px-1">MediaPipe Hands</a>
        </p>
        <p className="font-bold uppercase text-xs mt-2 text-gray-500">
          Built with React + Vite + Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

export default Footer;
