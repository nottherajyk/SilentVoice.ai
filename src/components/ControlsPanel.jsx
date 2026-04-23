import React from 'react';

function ControlsPanel({ onAddLetter, onSpace, onBackspace, onClear, detectedLetter, handDetected, landmarkColor, onColorChange }) {
  const colors = [
    { name: 'Pink', value: '#e2b4bd' },
    { name: 'Brown', value: '#a38c73' },
    { name: 'Green', value: '#8a9973' },
    { name: 'Blue', value: '#82a4ab' },
    { name: 'White', value: '#fdfbf7' },
    { name: 'Dark', value: '#4a3827' }
  ];

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-serif italic text-xl tracking-widest text-[#fdfbf7] border-b border-white/20 pb-2 mb-4">
        Controls
      </h3>

      <div className="mb-6">
        <p className="font-light tracking-widest text-xs mb-3 text-white/80 uppercase">Landmark Color</p>
        <div className="flex gap-3 flex-wrap">
          {colors.map(c => (
            <button
              key={c.value}
              onClick={() => onColorChange(c.value)}
              className={`w-6 h-6 rounded-full border border-white/30 transition-all ${landmarkColor === c.value ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button 
          onClick={onAddLetter}
          disabled={!detectedLetter || !handDetected}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-[#fdfbf7] tracking-widest text-xs uppercase transition-all rounded-sm disabled:opacity-30"
        >
          Add Letter
        </button>
        
        <button 
          onClick={onSpace}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-[#fdfbf7] tracking-widest text-xs uppercase transition-all rounded-sm"
        >
          Space
        </button>
        
        <button 
          onClick={onBackspace}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-[#fdfbf7] tracking-widest text-xs uppercase transition-all rounded-sm"
        >
          Backspace
        </button>
        
        <button 
          onClick={onClear}
          className="px-3 py-2 bg-[#4a3827]/80 hover:bg-[#4a3827] border border-white/20 text-[#fdfbf7] tracking-widest text-xs uppercase transition-all rounded-sm"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

export default ControlsPanel;
