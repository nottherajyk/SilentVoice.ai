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
      <div className="relative w-full h-[80vh] md:h-screen flex flex-col justify-center items-center text-center p-6 md:p-16 border-b border-white/20">
        
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={heroBg} alt="Cinematic background" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#8a7056] via-[#8a7056]/30 to-[#8a7056]/50" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-widest text-[#fdfbf7] mb-6 drop-shadow-lg" style={{ textShadow: '0 4px 25px rgba(0,0,0,0.6)' }}>
            A Silent Voice
          </h1>
          <p className="text-xs md:text-sm tracking-[0.3em] font-semibold opacity-90 mb-8 drop-shadow-md uppercase text-[#fdfbf7]">
            2026 | Real-time Web App | AI Engine | Language: ASL
          </p>
          <div className="w-3/4 max-w-lg h-px bg-white/40 mb-10" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-4">
            <div className="max-w-xl text-[#fdfbf7] leading-relaxed font-light text-sm md:text-base drop-shadow-md text-center bg-black/20 p-8 backdrop-blur-md rounded-sm border border-white/10">
            
              <p className="text-sm">
                A student with hearing problems suffers from isolation and decides to change their world. 
                Years later, this AI-powered bridge between silence and spoken words translates American Sign Language 
                gestures into text instantly, allowing everyone to be heard without saying a word.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Down Animation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer opacity-80 hover:opacity-100 transition-opacity" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fdfbf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* MAIN APP GRID */}
      <div className="max-w-7xl mx-auto w-full p-6 md:p-12 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT SIDE (Takes 2 cols): Camera + Detected Letter */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="aspect-video w-full bg-[#3b2c1f]/80 overflow-hidden shadow-2xl relative border border-white/20 rounded-sm">
              <CameraPanel
                videoRef={videoRef}
                canvasRef={canvasRef}
                isLoading={isLoading}
                error={error}
                isRunning={isRunning}
                startCamera={startCamera}
                handDetected={handDetected}
              />
              {isRunning && (
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                  <span className="bg-red-500/80 text-white text-xs px-2 py-1 rounded-sm uppercase tracking-widest font-bold animate-pulse">Live</span>
                  <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-sm uppercase tracking-widest backdrop-blur-sm">{fps} FPS</span>
                </div>
              )}
              {!isRunning && !isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60">
                   <button onClick={startCamera} className="px-8 py-3 bg-white/10 border border-white/30 text-[#fdfbf7] hover:bg-white/20 transition-all font-serif italic text-xl tracking-widest shadow-xl backdrop-blur-md">
                     Start Translation
                   </button>
                </div>
              )}
            </div>

            {/* DETECTED LETTER STRIP */}
            <div className="w-full bg-black/20 border border-white/10 p-6 shadow-lg backdrop-blur-md rounded-sm">
               <DetectedLetter letter={detectedLetter} confidence={confidence} handDetected={handDetected} />
            </div>
          </div>

          {/* RIGHT SIDE TOOLS (Takes 1 col, stacked) */}
          <div className="flex flex-col gap-6">
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
            Stop Camera
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
