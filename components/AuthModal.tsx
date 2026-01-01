
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Log In
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up
        if (!username) throw new Error("Username is required");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          username: username,
          searchHistory: [],
          playedGames: [],
          isAdmin: user.email === 'moinulbd.sk@gmail.com'
        });
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#1a1d23] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-800 animate-fadeIn">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">{isLogin ? 'Welcome Back' : 'Join YesBabys Games'}</h2>
            <p className="text-gray-400">Sign in to save your game progress</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="GamerName"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-semibold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-900/20 transform active:scale-95"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
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
          
          <div className="mt-4 text-[10px] text-gray-600 text-center uppercase tracking-widest">
            Admin access: moinulbd.sk@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
