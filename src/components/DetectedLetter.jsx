import React from 'react';

function DetectedLetter({ letter, confidence, handDetected }) {
  return (
    <div className="brutal-panel brutal-pink p-6 flex flex-col items-center justify-center text-center min-h-[250px]">
      <h3 className="font-display font-black text-2xl uppercase border-b-4 border-black pb-2 mb-6 w-full text-left">
        detected letter
      </h3>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {!handDetected ? (
          <div className="opacity-70 rotate-[-5deg]">
            <div className="text-6xl mb-4">👋</div>
            <p className="font-bold uppercase tracking-widest text-xl">waiting...</p>
          </div>
        ) : letter ? (
          <div className="relative">
            <div className="font-display font-black text-[10rem] leading-none text-outline">
              {letter}
            </div>
            {/* Pop decoration */}
            <div className="absolute -top-4 -right-8 text-4xl animate-bounce">✨</div>
          </div>
        ) : (
          <div className="text-6xl font-display font-black text-outline">?</div>
        )}
      </div>
    </div>
  );
}

export default DetectedLetter;
