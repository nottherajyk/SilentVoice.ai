import React from 'react';

function DetectedLetter({ letter, confidence, handDetected }) {
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shadow-lg ${handDetected ? 'bg-green-400 shadow-green-400/50 animate-pulse' : 'bg-red-500/50'}`} />
          <span className="text-sm tracking-widest uppercase opacity-70 font-semibold">
            {handDetected ? 'Sign Detected' : 'Waiting for Sign'}
          </span>
        </div>
        <div className="text-xs tracking-widest uppercase opacity-50 ml-6">
          {handDetected ? `${Math.round(confidence * 100)}% Match Confidence` : 'Show a hand gesture to the camera'}
        </div>
      </div>
      
      <div className="flex items-center justify-center min-w-[100px]">
        <div className="text-7xl md:text-8xl font-serif text-[#fdfbf7] drop-shadow-lg" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
          {handDetected ? (letter || '—') : '—'}
        </div>
      </div>
    </div>
  );
}

export default DetectedLetter;
