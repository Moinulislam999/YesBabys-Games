
import React from 'react';
import { Game } from '../types';

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
            <h1 className="text-3xl font-black tracking-tight text-white">{game.title}</h1>
            <span className="bg-purple-600/20 text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black border border-purple-500/20 uppercase tracking-widest">
              {game.category}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-black rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] aspect-video min-h-[500px] group">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110" style={{ backgroundImage: `url(${game.image})` }} />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-black via-black/60 to-transparent">
          <div className="relative mb-12 transform group-hover:scale-[1.01] transition-transform duration-700 ease-out">
            <div className="relative">
              <img 
                src={game.image} 
                className="w-full max-w-[600px] aspect-video object-cover rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-white/10" 
                alt={game.title} 
              />
              
              {game.badge && (
                <div className="absolute top-6 left-6 bg-[#2e1a47] text-purple-200 text-[12px] font-black px-4 py-1.5 rounded-lg shadow-lg border border-purple-500/30 uppercase tracking-widest">
                  {game.badge}
                </div>
              )}

              {/* CENTERED PLAY BUTTON WITH CUSTOM STICKER/ICON OR DEFAULT 🎮 */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-40">
                <a 
                  href={game.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative group/btn flex items-center justify-center cursor-pointer transition-all transform hover:scale-110 active:scale-95"
                >
                  <div className="relative flex items-center gap-4 bg-gradient-to-b from-[#fff7ad] via-[#ffcc33] to-[#ffaa00] border-[4px] border-[#3d1a11] px-10 py-4 rounded-[2rem] shadow-[0_8px_0_#2a1010,0_15px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                    
                    {/* CUSTOM STICKER OR DEFAULT 🎮 ICON */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#3d1a11] shadow-inner relative z-10 bg-white/20 flex items-center justify-center">
                      {game.playIcon ? (
                        <img src={game.playIcon} className="w-full h-full object-contain" alt="Sticker" />
                      ) : (
                        <span className="text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">🎮</span>
                      )}
                    </div>
                    
                    <span className="text-4xl font-[900] tracking-tighter leading-none relative z-10 select-none text-transparent bg-clip-text bg-gradient-to-b from-[#ff3333] to-[#ff0099] drop-shadow-[0_3px_0_rgba(0,0,0,0.3)]">
                      PLAY
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-xl mt-8">
            <h2 className="text-4xl font-black mb-2 text-white drop-shadow-2xl">{game.title}</h2>
            <p className="text-gray-400 text-lg font-medium opacity-80 italic">
              Ready for the ultimate challenge?
            </p>
          </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-[#16191e] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">Category</p>
          <p className="text-white font-bold text-lg text-center">{game.category}</p>
        </div>
        <div className="bg-[#16191e] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">Server</p>
          <p className="text-green-400 font-bold text-lg flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            Stable
          </p>
        </div>
        <div className="bg-[#16191e] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">Rating</p>
          <p className="text-yellow-400 font-bold text-lg text-center flex items-center justify-center gap-1">
            4.9 <span className="text-gray-600 text-sm">★</span>
          </p>
        </div>
        <div className="bg-[#16191e] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">Traffic</p>
          <p className="text-white font-bold text-lg text-center">High</p>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
