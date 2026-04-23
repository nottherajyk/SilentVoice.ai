import React from 'react';

function Header({ isRunning, handDetected, fps }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-4 border-b-8 border-black">
      <div>
        <h1 className="font-display font-black text-5xl md:text-6xl uppercase tracking-tight leading-none text-outline mb-2">
          Silent Voice
        </h1>
        <p className="font-bold text-xl uppercase tracking-widest bg-black text-white inline-block px-2 py-1 transform -rotate-1">
          Real-time AI Translator
        </p>
      </div>

      <div className="hidden md:block">
        <div className="w-24 h-24 bg-brutal-pink rounded-full border-4 border-black shadow-brutal flex items-center justify-center text-4xl animate-bounce">
          {handDetected ? '✌️' : '🖐️'}
        </div>
      </div>
    </header>
  );
}

export default Header;
