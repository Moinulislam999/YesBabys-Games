
import React from 'react';
import { Game } from '../types';

interface GameGridProps {
  games: Game[];
  onPlay: (game: Game) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onPlay }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
      {games.map((game) => (
        <div 
          key={game.id}
          onClick={() => onPlay(game)}
          className="group relative cursor-pointer aspect-[4/3] overflow-hidden rounded-xl bg-[#1a1d23] border border-gray-800/50 transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/30"
        >
          {/* Badge */}
          {game.badge && (
            <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-purple-400 border border-purple-500/30 shadow-lg">
              {game.badge}
            </div>
          )}

          <img 
            src={game.image} 
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
            <h3 className="text-sm font-bold text-white truncate drop-shadow-lg">
              {game.title}
            </h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {game.category}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
