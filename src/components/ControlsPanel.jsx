import React from 'react';

function ControlsPanel({ onAddLetter, onSpace, onBackspace, onClear, detectedLetter, handDetected, landmarkColor, onColorChange }) {
  const colors = [
    { name: 'Blue', value: '#00b4ff' },
    { name: 'Pink', value: '#ff00a0' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Yellow', value: '#faff00' },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' }
  ];

  return (
    <div className="  p-6">
      <h3 className="font-serif italic text-2xl tracking-widest text-[#fdfbf7] border-b border-white/20 pb-2 mb-6">
        controls
      </h3>

      <div className="mb-6">
        <p className="font-bold uppercase text-sm mb-2">Line Color:</p>
        <div className="flex gap-2 flex-wrap">
          {colors.map(c => (
            <button
              key={c.value}
              onClick={() => onColorChange(c.value)}
              className={`w-8 h-8 rounded-full border-4 border-black shadow-brutal transition-transform ${landmarkColor === c.value ? 'scale-125' : 'hover:scale-110'}`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onAddLetter}
          disabled={!detectedLetter || !handDetected}
          className=" bg-white hover:bg-"
        >
          <span>add letter</span>
        </button>
        
        <button 
          onClick={onSpace}
          className=" bg-white hover:bg-"
        >
          <span>space</span>
        </button>
        
        <button 
          onClick={onBackspace}
          className=" bg-white hover:bg-"
        >
          <span>backspace</span>
        </button>
        
        <button 
          onClick={onClear}
          className=" bg-brutal-black text-white hover:text- hover:bg-black"
        >
          <span>clear all</span>
        </button>
      </div>
    </div>
  );
}

export default ControlsPanel;
