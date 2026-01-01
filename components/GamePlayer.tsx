
import React from 'react';
import { Game } from '../types';
import { Icons } from '../constants';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  return (
    <div className="flex flex-col h-full animate-fadeIn pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 bg-[#1a1d23] hover:bg-purple-600 border border-gray-800 hover:border-purple-500 px-5 py-2.5 rounded-2xl transition-all font-bold text-sm shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Hub
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tight">{game.title}</h1>
            <span className="bg-purple-600/20 text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black border border-purple-500/20 uppercase tracking-widest">
              {game.category}
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Preview Area */}
      <div className="relative flex-1 bg-black rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] aspect-video min-h-[500px] group">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110" style={{ backgroundImage: `url(${game.image})` }} />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
          {/* Large Preview Image */}
          <div className="relative mb-8 transform group-hover:scale-105 transition-transform duration-700">
            <img 
              src={game.image} 
              className="w-80 md:w-[480px] aspect-video object-cover rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-white/10" 
              alt={game.title} 
            />
            {game.badge && (
              <div className="absolute -top-3 -right-3 bg-purple-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-black uppercase italic">
                {game.badge}
              </div>
            )}
          </div>

          <div className="max-w-xl">
            <h2 className="text-4xl font-black mb-3 text-white drop-shadow-2xl">Ready to Play?</h2>
            <p className="text-gray-400 text-lg mb-10 font-medium">
              Dive into <span className="text-purple-400 font-bold">{game.title}</span> and experience the best web gaming has to offer.
            </p>
          </div>

          {/* PLAY BUTTON - Updated to match the teal pill-shaped style with controller icon */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <a 
              href={game.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#4fd1c5] hover:bg-[#3dbbb0] text-[#0b0e11] px-8 py-3.5 rounded-full font-black text-2xl shadow-2xl transition-all transform hover:scale-110 active:scale-95 group/play"
            >
              <Icons.Controller />
              <span className="uppercase tracking-tight leading-none">PLAY</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-[#16191e] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Game Category</p>
          <p className="text-white font-bold text-lg">{game.category}</p>
        </div>
        <div className="bg-[#16191e] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
          <p className="text-green-400 font-bold text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Online
          </p>
        </div>
        <div className="bg-[#16191e] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Global Rating</p>
          <p className="text-yellow-400 font-bold text-lg flex items-center gap-1">
            4.9 <span className="text-gray-600 text-sm">/ 5.0</span>
          </p>
        </div>
        <div className="bg-[#16191e] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Popularity</p>
          <p className="text-white font-bold text-lg">9.2k Views</p>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;