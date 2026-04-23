import React from 'react';

function ConfidenceMeter({ confidence, handDetected }) {
  const percentage = Math.round(confidence * 100);
  
  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-2">
        <h3 className="font-serif italic tracking-widest text-sm text-white/80 uppercase">
          AI Confidence
        </h3>
        <span className="font-serif italic text-[#fdfbf7]">
          {handDetected ? `${percentage}%` : '---'}
        </span>
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-sm overflow-hidden">
        <div 
          className="h-full bg-white/60 transition-all duration-300"
          style={{ width: handDetected ? `${percentage}%` : '0%' }}
        />
      </div>
      
      {!handDetected && (
        <p className="text-xs text-white/50 tracking-widest mt-2 uppercase">Waiting for hand sign...</p>
      )}
    </div>
  );
}

export default ConfidenceMeter;
