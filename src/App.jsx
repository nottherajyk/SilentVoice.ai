import React, { useState, useCallback } from 'react';
import { useHandDetection } from './hooks/useHandDetection';
import Header from './components/Header';
import CameraPanel from './components/CameraPanel';
import DetectedLetter from './components/DetectedLetter';
import SentencePanel from './components/SentencePanel';
import ControlsPanel from './components/ControlsPanel';
import ConfidenceMeter from './components/ConfidenceMeter';
import StatusBar from './components/StatusBar';
import Footer from './components/Footer';

function App() {
  const [landmarkColor, setLandmarkColor] = useState('#00b4ff'); // Brutal Blue default

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
    <div className="min-h-screen bg-brutal-black text-brutal-black flex flex-col md:flex-row">
      {/* Left Sidebar (Yellow) */}
      <div className="md:w-24 lg:w-32 bg-brutal-yellow flex flex-row md:flex-col items-center justify-between py-6 px-4 md:px-0 md:min-h-screen border-b-4 md:border-b-0 md:border-r-4 border-brutal-black z-20">
        <button className="p-2 hover:scale-110 transition-transform">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <div className="flex-1 flex items-center justify-center md:justify-start w-full md:pt-16">
          <div className="hidden md:block font-display font-black text-4xl tracking-widest text-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            SILENT VOICE
          </div>
          <div className="block md:hidden font-display font-black text-2xl tracking-widest text-center">
            SILENT VOICE
          </div>
        </div>

        <div className="text-4xl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 relative overflow-y-auto">
        
        {/* Mobile Header (Hidden on md+) */}
        <div className="md:hidden mb-6">
          <Header isRunning={isRunning} handDetected={handDetected} fps={fps} />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Main Camera Area - Green Panel */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="hidden md:block">
              <Header isRunning={isRunning} handDetected={handDetected} fps={fps} />
            </div>

            <CameraPanel
              videoRef={videoRef}
              canvasRef={canvasRef}
              isLoading={isLoading}
              error={error}
              isRunning={isRunning}
              startCamera={startCamera}
              handDetected={handDetected}
            />
            
            <StatusBar
              isRunning={isRunning}
              handDetected={handDetected}
              fps={fps}
              detectedLetter={detectedLetter}
            />
          </div>

          {/* Right Side Tools */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <DetectedLetter
              letter={detectedLetter}
              confidence={confidence}
              handDetected={handDetected}
            />
            
            <ConfidenceMeter
              confidence={confidence}
              handDetected={handDetected}
            />

            <SentencePanel sentence={sentence} />
            
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
        </div>

        {/* Camera toggle */}
        {isRunning && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={stopCamera}
              className="brutal-btn brutal-btn-pink"
              id="stop-camera-btn"
            >
              stop camera
            </button>
          </div>
        )}

        <div className="mt-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
