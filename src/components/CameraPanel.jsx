import React from 'react';

function CameraPanel({ videoRef, canvasRef, isLoading, error, isRunning, startCamera, handDetected }) {
  return (
    <div className="brutal-panel brutal-green p-6 relative flex flex-col items-center justify-center min-h-[400px]">
      
      {!isRunning && !error && (
        <div className="text-center space-y-6 z-20">
          <div className="text-8xl">🤟</div>
          <h2 className="font-display font-black text-3xl uppercase tracking-wide">
            ready to detect
          </h2>
          <button 
            onClick={startCamera}
            className="brutal-btn brutal-btn-black bg-brutal-black text-brutal-yellow hover:bg-black w-full"
          >
            ▶ start camera
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center space-y-4 z-20">
          <div className="loader mx-auto"></div>
          <p className="font-bold text-xl uppercase tracking-widest animate-pulse">
            loading camera...
          </p>
        </div>
      )}

      {error && (
        <div className="brutal-panel bg-white p-6 border-red-500 text-center max-w-md z-20">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="font-display font-black text-red-600 text-2xl uppercase mb-2">camera error</h3>
          <p className="font-bold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="brutal-btn brutal-btn-yellow mt-6 w-full"
          >
            refresh page
          </button>
        </div>
      )}

      <div className={`camera-container w-full max-w-3xl mx-auto shadow-brutal ${(isRunning && !isLoading) ? 'block' : 'hidden'}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="hand-canvas"
        />
        
        {isRunning && !handDetected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
            <p className="bg-brutal-yellow brutal-border px-6 py-3 font-display font-black text-2xl uppercase rounded-full rotate-[-5deg]">
              show a hand sign
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CameraPanel;
