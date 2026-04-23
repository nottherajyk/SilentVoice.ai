import React from 'react';

function CameraPanel({ videoRef, canvasRef, isLoading, error, isRunning, startCamera, handDetected }) {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#4a3827]">
      
      {isLoading && (
        <div className="text-center space-y-4 z-20 absolute inset-0 flex flex-col items-center justify-center bg-[#4a3827]">
          <div className="loader mx-auto"></div>
          <p className="font-serif italic text-[#fdfbf7]/80 text-xl tracking-widest animate-pulse">
            Connecting...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-[#4a3827]/90 p-8 border border-red-900 text-center max-w-md z-20 backdrop-blur-md shadow-2xl">
          <h3 className="font-serif italic text-red-300 text-2xl mb-4">Connection Lost</h3>
          <p className="font-light text-[#fdfbf7]/80 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-all border border-white/20 text-[#fdfbf7] tracking-widest text-sm uppercase"
          >
            Retry Connection
          </button>
        </div>
      )}

      <div className={`w-full h-full ${(isRunning && !isLoading) ? 'block' : 'hidden'}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1] filter contrast-125 saturate-50"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full transform scale-x-[-1]"
        />
        
        {isRunning && !handDetected && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#3b2c1f]/40 z-20 backdrop-blur-[1px] transition-all duration-700">
            <p className="text-[#fdfbf7] font-serif italic text-xl md:text-2xl tracking-widest drop-shadow-md">
              Awaiting Translation...
            </p>
          </div>
        )}
      </div>

      {!isRunning && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60">
           <button onClick={startCamera} className="px-8 py-3 bg-white/10 border border-white/30 text-[#fdfbf7] hover:bg-white/20 transition-all font-serif italic text-xl tracking-widest shadow-xl backdrop-blur-md">
             Start Translation
           </button>
        </div>
      )}
    </div>
  );
}

export default CameraPanel;
