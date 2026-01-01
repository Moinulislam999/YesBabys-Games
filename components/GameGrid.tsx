
import React from 'react';
import { Game } from '../types';

interface GameGridProps {
  games: Game[];
  onPlay: (game: Game) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onPlay }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
      {games.map((game) => (
        <div 
          key={game.id}
          onClick={() => onPlay(game)}
          className="group relative cursor-pointer aspect-[4/3] overflow-hidden rounded-2xl bg-[#1a1d23] border border-gray-800/50 transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/30"
        >
          {game.badge && (
            <div className="absolute top-2 left-2 z-20 bg-[#2e1a47] text-purple-200 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-purple-500/20 shadow-lg">
              {game.badge}
            </div>
          )}

          <img 
            src={game.image} 
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />

          <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 p-4">
            <div className="relative flex items-center gap-2 bg-gradient-to-b from-[#fff7ad] via-[#ffcc33] to-[#ffaa00] border-[3px] border-[#3d1a11] px-4 py-2 rounded-full shadow-[0_4px_0_#2a1010,0_10px_20px_rgba(0,0,0,0.6)] overflow-hidden scale-90 group-hover:scale-100 transition-transform">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
              
              {/* CUSTOM STICKER OR DEFAULT 🎮 IN GRID HOVER */}
              <div className="w-5 h-5 rounded-md overflow-hidden border border-[#3d1a11] relative z-10 bg-white/10 flex items-center justify-center">
                {game.playIcon ? (
                  <img src={game.playIcon} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm">🎮</span>
                )}
              </div>
              <span className="text-xl font-[900] tracking-tighter leading-none relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-[#ff3333] to-[#ff0099] drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]">
                PLAY
              </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-3 z-20 transition-all group-hover:opacity-0 group-hover:translate-y-2">
            <h3 className="text-sm font-bold text-white truncate drop-shadow-md">
              {game.title}
            </h3>
            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-[0.15em]">
              {game.category}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
