
import React, { useState } from 'react';
import { GameCategory } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  selectedCategory: string | 'Home';
  onSelectCategory: (cat: string | 'Home') => void;
  categories: GameCategory[];
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory, categories }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1a1d23] p-2 rounded-lg text-white"
      >
        <Icons.Menu />
      </button>

      <aside className={`
        fixed left-0 top-0 h-full bg-[#16191e] border-r border-gray-800 z-40
        w-64 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-purple-600 p-1.5 rounded-lg">
            <Icons.Home />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase italic">YesBabys</h1>
        </div>

        <nav className="px-3 py-2 space-y-1 overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide">
          <button
            onClick={() => { onSelectCategory('Home'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              selectedCategory === 'Home' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icons.Home />
            <span className="font-semibold">Home</span>
          </button>

          <div className="pt-4 pb-2 px-4">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Game Collections</span>
          </div>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.name); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                selectedCategory === cat.name 
                  ? 'bg-[#2a2e38] text-purple-400 border border-purple-500/30' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {cat.icon ? (
                <img src={cat.icon} alt="" className="w-5 h-5 object-contain" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:scale-150 transition-transform"></div>
              )}
              <span className="font-medium text-sm">{cat.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
