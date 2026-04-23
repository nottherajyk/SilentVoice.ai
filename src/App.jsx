import React, { useState, useCallback } from 'react';
import { useHandDetection } from './hooks/useHandDetection';
import CameraPanel from './components/CameraPanel';
import DetectedLetter from './components/DetectedLetter';
import SentencePanel from './components/SentencePanel';
import ControlsPanel from './components/ControlsPanel';
import ConfidenceMeter from './components/ConfidenceMeter';
import heroBg from './assets/hero.png';

function App() {
  const [landmarkColor, setLandmarkColor] = useState('#e2b4bd'); // Pink default

  const {
    videoRef,
    canvasRef,
    detectedLetter,
    confidence,
    isLoading,
    error,
    handDetected,
    fps,
    isRunning,
    startCamera,
    stopCamera,
  } = useHandDetection(landmarkColor);

  const [sentence, setSentence] = useState('');

  const handleAddLetter = useCallback(() => {
    if (detectedLetter) {
      setSentence(prev => prev + detectedLetter);
    }
  }, [detectedLetter]);

  const handleSpace = useCallback(() => {
    setSentence(prev => prev + ' ');
  }, []);

  const handleBackspace = useCallback(() => {
    setSentence(prev => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setSentence('');
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && detectedLetter) {
        handleAddLetter();
      } else if (e.key === ' ' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        handleSpace();
      } else if (e.key === 'Backspace' && e.target.tagName !== 'INPUT') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detectedLetter, handleAddLetter, handleSpace, handleBackspace, handleClear]);

  return (
    <div className="min-h-screen bg-[#8a7056] text-[#fdfbf7] font-sans selection:bg-white/30 pb-20">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[60vh] md:h-[75vh] flex flex-col justify-end p-6 md:p-16 border-b border-white/20">
        
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={heroBg} alt="Cinematic background" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#8a7056] via-[#8a7056]/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-widest text-[#fdfbf7] mb-2" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            A Silent Voice
          </h1>
          <p className="text-xs md:text-sm tracking-[0.2em] font-semibold opacity-90 mb-6 drop-shadow-md uppercase">
            2026 | Real-time Web App | AI Engine | Language: ASL
          </p>
          <div className="w-full h-px bg-white/40 mb-8" />
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-36 md:w-32 md:h-48 bg-black/20 rounded-sm shrink-0 shadow-lg overflow-hidden flex items-center justify-center border border-white/30 backdrop-blur-md">
                 <DetectedLetter letter={detectedLetter} confidence={confidence} handDetected={handDetected} />
            </div>
            <div className="max-w-xl text-[#fdfbf7]/90 leading-relaxed font-light text-sm md:text-base drop-shadow-md">
              <p className="mb-2"><span className="opacity-70">Dir.</span> Silent Voice AI Team</p>
              <p className="mb-4"><span className="opacity-70">Cast:</span> MediaPipe Hand Tracking</p>
              <p>
                A person with a desire to communicate bridges the gap between silence and spoken words. 
                Using real-time AI computer vision, this browser-based tool translates American Sign Language 
                gestures into text instantly. Communicate freely without saying a word.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN APP GRID (The "Movie Stills") */}
      <div className="max-w-5xl mx-auto w-full p-6 md:p-16 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          
          {/* CAMERA (Takes 2 cols) */}
          <div className="md:col-span-2 aspect-video bg-[#3b2c1f]/80 overflow-hidden shadow-2xl relative border border-white/20">
            <CameraPanel
              videoRef={videoRef}
              canvasRef={canvasRef}
              isLoading={isLoading}
              error={error}
              isRunning={isRunning}
              startCamera={startCamera}
              handDetected={handDetected}
            />
          </div>

          {/* RIGHT SIDE TOOLS (Takes 1 col, stacked) */}
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="bg-[#a38c73]/30 border border-white/10 p-4 md:p-6 flex-1 shadow-lg backdrop-blur-md rounded-sm">
              <SentencePanel sentence={sentence} />
            </div>
            <div className="bg-[#a38c73]/30 border border-white/10 p-4 md:p-6 shadow-lg backdrop-blur-md rounded-sm">
              <ControlsPanel
                onAddLetter={handleAddLetter}
                onSpace={handleSpace}
                onBackspace={handleBackspace}
                onClear={handleClear}
                detectedLetter={detectedLetter}
                handDetected={handDetected}
                landmarkColor={landmarkColor}
                onColorChange={setLandmarkColor}
              />
            </div>
            <div className="bg-[#a38c73]/30 border border-white/10 p-4 md:p-6 shadow-lg backdrop-blur-md rounded-sm">
               <ConfidenceMeter confidence={confidence} handDetected={handDetected} />
            </div>
          </div>

        </div>

        {/* QUOTE */}
        <div className="mt-16 text-center max-w-3xl mx-auto px-4">
          <p className="text-xl md:text-2xl font-serif text-[#fdfbf7] leading-relaxed tracking-wide drop-shadow-md italic">
            "I wasn't trying to hurt you, but I must have because I made you feel so bad about yourself that you decided to go and do the unthinkable."
          </p>
        </div>
        
      </div>
      
      {/* Floating Camera toggle */}
      {isRunning && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={stopCamera}
            className="px-6 py-2 bg-[#4a3827]/80 text-[#fdfbf7] border border-white/20 hover:bg-[#4a3827] transition-all backdrop-blur-sm text-sm tracking-widest uppercase shadow-xl"
            id="stop-camera-btn"
          >
            Stop Engine
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
