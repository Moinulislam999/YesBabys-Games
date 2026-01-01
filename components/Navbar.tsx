
import React from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onAdminToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout, onSearch, onAdminToggle }) => {
  return (
    <header className="h-20 bg-[#0b0e11]/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-8 border-b border-gray-800 flex items-center justify-between">
      <div className="flex-1 max-w-xl mx-auto md:mx-0">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-500 transition-colors">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search for games..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-[#1a1d23] border border-gray-700 text-white pl-12 pr-4 py-2.5 rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        {user ? (
          <div className="flex items-center gap-4">
            {user.isAdmin && (
              <button 
                onClick={onAdminToggle}
                className="hidden md:flex items-center gap-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full border border-purple-600/30 transition-all font-semibold"
              >
                Admin Panel
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white uppercase border-2 border-[#0b0e11] ring-2 ring-purple-600/30">
                {user.username[0]}
              </div>
              <div className="hidden lg:block text-sm">
                <p className="font-bold text-gray-100">{user.username}</p>
                <button onClick={onLogout} className="text-gray-500 hover:text-red-400 text-[10px] uppercase font-bold tracking-widest transition-colors">Logout</button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-purple-900/20"
          >
            <Icons.User />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
