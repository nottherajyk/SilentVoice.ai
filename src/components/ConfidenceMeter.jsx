import React from 'react';

function ConfidenceMeter({ confidence, handDetected }) {
  const percentage = Math.round((confidence || 0) * 100);
  
  return (
    <div className="brutal-panel bg-white p-6">
      <div className="flex justify-between items-end border-b-4 border-black pb-2 mb-4">
        <h3 className="font-display font-black text-2xl uppercase">
          confidence
        </h3>
        <span className="font-display font-black text-3xl">
          {handDetected ? `${percentage}%` : '---'}
        </span>
      </div>

      <div className="brutal-progress mt-2">
        <div 
          className="brutal-progress-fill" 
          style={{ width: `${handDetected ? percentage : 0}%` }}
        />
      </div>
      
      {!handDetected && (
        <p className="mt-4 font-bold text-sm uppercase text-gray-500">
          waiting for hand...
        </p>
      )}
    </div>
  );
}

export default ConfidenceMeter;
