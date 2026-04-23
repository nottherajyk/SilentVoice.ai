import React from 'react';

function SentencePanel({ sentence }) {
  const handleCopy = () => {
    if (sentence) {
      navigator.clipboard.writeText(sentence);
      // Could add a tiny toast here, but for now we keep it simple
    }
  };

  return (
    <div className="  p-6 flex flex-col">
      <div className="flex justify-between items-end border-b border-white/20 pb-2 mb-4">
        <h3 className="font-serif italic text-2xl tracking-widest text-[#fdfbf7]">
          translated text
        </h3>
        {sentence && (
          <button 
            onClick={handleCopy}
            className="font-bold text-sm uppercase underline hover:bg-black hover:text-white px-2 rounded transition-colors"
            title="Copy to clipboard"
          >
            Copy
          </button>
        )}
      </div>

      <div className="bg-white brutal-border rounded-2xl p-4 min-h-[120px] shadow-brutal">
        <p className="font-bold text-2xl break-words">
          {sentence ? (
            <>
              {sentence}
              <span className="cursor-blink ml-1"></span>
            </>
          ) : (
            <span className="text-gray-400 italic">Start signing...<span className="cursor-blink ml-1"></span></span>
          )}
        </p>
      </div>
    </div>
  );
}

export default SentencePanel;
