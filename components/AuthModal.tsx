
import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Specific Admin Credentials
    if (email === '00' && password === '00') {
      onLogin({
        id: 'admin-id',
        email: 'admin@system.com',
        username: 'Admin',
        searchHistory: [],
        playedGames: [],
        isAdmin: true
      });
      return;
    }

    // Basic Validation
    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill in all fields');
      return;
    }

    // Mock User Creation
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      email,
      username: username || email.split('@')[0],
      searchHistory: [],
      playedGames: [],
      isAdmin: false
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#1a1d23] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">{isLogin ? 'Welcome Back' : 'Join CrazyPlay'}</h2>
            <p className="text-gray-400">Unlock your game history and favorites</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="CoolGamer123"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Email / ID</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all"
                placeholder="00 or your email"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-900/20 transform active:scale-95"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-white font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
