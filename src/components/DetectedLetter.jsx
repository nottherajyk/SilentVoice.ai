import React from 'react';

function DetectedLetter({ letter, confidence, handDetected }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 relative">
      <div className="absolute top-2 left-2 right-2 flex justify-between">
         <span className="text-[10px] tracking-widest uppercase opacity-50">Sign</span>
         <div className={`w-2 h-2 rounded-full ${handDetected ? 'bg-green-400' : 'bg-red-400/50'}`} />
      </div>
      
      <div className="text-5xl md:text-7xl font-serif text-[#fdfbf7] drop-shadow-md">
        {handDetected ? (letter || '—') : '—'}
      </div>
      
      <div className="absolute bottom-2 text-[10px] tracking-widest uppercase opacity-50">
        {handDetected ? `${Math.round(confidence * 100)}% match` : 'waiting...'}
      </div>
    </div>
  );
}

export default DetectedLetter;
