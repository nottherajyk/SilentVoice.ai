import React from 'react';

function StatusBar({ isRunning, handDetected, fps, detectedLetter }) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className={`brutal-pill ${isRunning ? 'bg-brutal-green' : 'bg-brutal-pink'}`}>
        <span className="w-3 h-3 rounded-full bg-black"></span>
        {isRunning ? 'camera on' : 'camera off'}
      </div>
      
      {isRunning && (
        <div className={`brutal-pill ${handDetected ? 'bg-brutal-blue' : 'bg-white'}`}>
          <span>hand:</span>
          <span className="font-black text-lg">{handDetected ? 'DETECTED' : 'NONE'}</span>
        </div>
      )}

      {isRunning && (
        <div className="brutal-pill bg-brutal-yellow">
          <span>fps:</span>
          <span className="font-black text-lg">{fps}</span>
        </div>
      )}

      {detectedLetter && (
        <div className="brutal-pill bg-white ml-auto hidden md:flex">
          <span>letter:</span>
          <span className="font-black text-lg">{detectedLetter}</span>
        </div>
      )}
    </div>
  );
}

export default StatusBar;
