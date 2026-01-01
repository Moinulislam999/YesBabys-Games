
import React from 'react';
import { Game } from '../types';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition-all font-bold text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Hub
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">{game.title}</h1>
            <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20 uppercase">
              {game.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl relative aspect-video min-h-[500px]">
        {/* In a real app, this would be an iframe of the game source */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[#1a1d23] to-black">
          <img src={game.image} className="w-64 h-36 object-cover rounded-2xl shadow-2xl mb-8 border-4 border-purple-600/20" alt="" />
          <h2 className="text-3xl font-black mb-2">Ready to Play?</h2>
          <p className="text-gray-400 max-w-md mb-8">
            You are about to play <span className="text-white font-bold">{game.title}</span>. Enjoy your gaming session on CrazyPlay!
          </p>
          <div className="space-x-4">
             <a 
              href={game.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-purple-900/30 transition-all transform hover:scale-105 active:scale-95 inline-block"
            >
              Play Fullscreen
            </a>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 text-gray-500 text-sm font-bold uppercase tracking-widest">
            <div>
              <p className="mb-1">Category</p>
              <p className="text-white">{game.category}</p>
            </div>
            <div>
              <p className="mb-1">Rating</p>
              <p className="text-white">4.8 / 5</p>
            </div>
            <div>
              <p className="mb-1">Players</p>
              <p className="text-white">12.5k +</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
