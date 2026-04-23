import React from 'react';

function SentencePanel({ sentence }) {
  const handleCopy = () => {
    if (sentence) {
      navigator.clipboard.writeText(sentence);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end border-b border-white/20 pb-2 mb-4">
        <h3 className="font-serif italic text-xl tracking-widest text-[#fdfbf7]">
          Translated Text
        </h3>
        {sentence && (
          <button 
            onClick={handleCopy}
            className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            Copy
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-sm p-4 min-h-[100px] flex-1">
        <p className="font-serif text-xl md:text-2xl break-words text-[#fdfbf7] leading-relaxed drop-shadow-sm">
          {sentence ? (
            <>
              {sentence}
              <span className="cursor-blink ml-1"></span>
            </>
          ) : (
            <span className="text-white/40 italic font-light">Begin signing...<span className="cursor-blink ml-1 opacity-50"></span></span>
          )}
        </p>
      </div>
    </div>
  );
}

export default SentencePanel;
