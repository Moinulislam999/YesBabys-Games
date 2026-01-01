
import React, { useState } from 'react';
import { Category, CATEGORIES } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  selectedCategory: Category | 'Home';
  onSelectCategory: (cat: Category | 'Home') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
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
          <h1 className="text-xl font-black tracking-tight text-white uppercase">YesBabys</h1>
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
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Categories</span>
          </div>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { onSelectCategory(cat); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#2a2e38] text-purple-400 border border-purple-500/30' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="font-medium">{cat}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
