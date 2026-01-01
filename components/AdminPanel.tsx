
import React, { useState } from 'react';
import { Game, GameCategory } from '../types';
import { Icons } from '../constants';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface AdminPanelProps {
  games: Game[];
  categories: GameCategory[];
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ games, categories, onClose }) => {
  const [activeTab, setActiveTab] = useState<'games' | 'categories'>('games');
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingCategory, setEditingCategory] = useState<GameCategory | null>(null);
  const [loading, setLoading] = useState(false);

  // Game Form State
  const [gameData, setGameData] = useState({
    title: '',
    category: categories[0]?.name || '',
    image: '',
    badge: '',
    url: ''
  });

  // Category Form State
  const [catData, setCatData] = useState({
    name: '',
    icon: ''
  });

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setGameData({
      title: game.title,
      category: game.category,
      image: game.image,
      badge: game.badge || '',
      url: game.url
    });
    setActiveTab('games');
  };

  const handleEditCat = (cat: GameCategory) => {
    setEditingCategory(cat);
    setCatData({
      name: cat.name,
      icon: cat.icon
    });
    setActiveTab('categories');
  };

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingGame) {
        await updateDoc(doc(db, 'games', editingGame.id), { ...gameData, badge: gameData.badge || null });
        setEditingGame(null);
      } else {
        await addDoc(collection(db, 'games'), { ...gameData, createdAt: Date.now(), badge: gameData.badge || null });
      }
      setGameData({ title: '', category: categories[0]?.name || '', image: '', badge: '', url: '' });
    } catch (err) { alert('Failed'); }
    setLoading(false);
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), { ...catData });
        setEditingCategory(null);
      } else {
        await addDoc(collection(db, 'categories'), { ...catData });
      }
      setCatData({ name: '', icon: '' });
    } catch (err) { alert('Failed'); }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setActiveTab('games')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'games' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'bg-gray-800 text-gray-400'}`}
            >
              Manage Games
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'categories' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'bg-gray-800 text-gray-400'}`}
            >
              Manage Categories
            </button>
          </div>
        </div>
        <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-1">
          {activeTab === 'games' ? (
            <div className="bg-[#1a1d23] p-6 rounded-2xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                <Icons.Plus /> {editingGame ? 'Edit Game' : 'Post New Game'}
              </h2>
              <form onSubmit={handleGameSubmit} className="space-y-4">
                <input type="text" placeholder="Title" value={gameData.title} onChange={e => setGameData({...gameData, title: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500" required />
                <select value={gameData.category} onChange={e => setGameData({...gameData, category: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500" required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input type="text" placeholder="Image URL" value={gameData.image} onChange={e => setGameData({...gameData, image: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500" required />
                <input type="text" placeholder="Game Play URL" value={gameData.url} onChange={e => setGameData({...gameData, url: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500" required />
                <input type="text" placeholder="Badge (e.g. 🔥, NEW)" value={gameData.badge} onChange={e => setGameData({...gameData, badge: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500" />
                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20">{loading ? 'Saving...' : 'Save Game'}</button>
                {editingGame && <button type="button" onClick={() => setEditingGame(null)} className="w-full bg-gray-800 py-3 rounded-xl font-bold mt-2">Cancel</button>}
              </form>
            </div>
          ) : (
            <div className="bg-[#1a1d23] p-6 rounded-2xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                <Icons.Plus /> {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <form onSubmit={handleCatSubmit} className="space-y-4">
                <input type="text" placeholder="Category Name" value={catData.name} onChange={e => setCatData({...catData, name: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500" required />
                <input type="text" placeholder="Icon URL (SVG/PNG Link)" value={catData.icon} onChange={e => setCatData({...catData, icon: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500" />
                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20">{loading ? 'Saving...' : 'Save Category'}</button>
                {editingCategory && <button type="button" onClick={() => setEditingCategory(null)} className="w-full bg-gray-800 py-3 rounded-xl font-bold mt-2">Cancel</button>}
              </form>
            </div>
          )}
        </div>

        {/* Right List */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1d23] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
            {activeTab === 'games' ? (
              <table className="w-full text-left">
                <thead className="bg-[#16191e] text-[10px] font-black uppercase text-gray-500 tracking-wider">
                  <tr><th className="p-4">Game</th><th className="p-4">Category</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {games.map(g => (
                    <tr key={g.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3"><img src={g.image} className="w-10 h-10 rounded object-cover" /> <span className="font-bold">{g.title}</span></td>
                      <td className="p-4"><span className="px-2 py-1 bg-gray-800 rounded text-[10px] uppercase font-bold text-gray-400">{g.category}</span></td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEditGame(g)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Icons.Edit /></button>
                        <button onClick={() => deleteDoc(doc(db, 'games', g.id))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Icons.Delete /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#16191e] text-[10px] font-black uppercase text-gray-500 tracking-wider">
                  <tr><th className="p-4">Category</th><th className="p-4">Logo</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {categories.map(c => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-gray-200">{c.name}</td>
                      <td className="p-4">
                        {c.icon ? <img src={c.icon} className="w-8 h-8 object-contain" /> : <span className="text-gray-600 text-[10px]">No Logo</span>}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEditCat(c)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Icons.Edit /></button>
                        <button onClick={() => deleteDoc(doc(db, 'categories', c.id))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Icons.Delete /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
