
import React, { useState, useRef } from 'react';
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

  const gameFileRef = useRef<HTMLInputElement>(null);
  const catFileRef = useRef<HTMLInputElement>(null);

  const [gameData, setGameData] = useState({
    title: '',
    category: categories[0]?.name || '',
    image: '',
    badge: '',
    url: ''
  });

  const [catData, setCatData] = useState({
    name: '',
    icon: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'game' | 'cat') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadstart = () => setLoading(true);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'game') {
        setGameData({ ...gameData, image: base64String });
      } else {
        setCatData({ ...catData, icon: base64String });
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditCat = (cat: GameCategory) => {
    setEditingCategory(cat);
    setCatData({
      name: cat.name,
      icon: cat.icon
    });
    setActiveTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameData.image) { alert('Please upload a game image'); return; }
    setLoading(true);
    try {
      if (editingGame) {
        await updateDoc(doc(db, 'games', editingGame.id), { ...gameData, badge: gameData.badge || null });
        setEditingGame(null);
      } else {
        await addDoc(collection(db, 'games'), { ...gameData, createdAt: Date.now(), badge: gameData.badge || null });
      }
      setGameData({ title: '', category: categories[0]?.name || '', image: '', badge: '', url: '' });
      if (gameFileRef.current) gameFileRef.current.value = '';
    } catch (err) { alert('Database error'); }
    setLoading(false);
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catData.icon) { alert('Please upload a category icon'); return; }
    setLoading(true);
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), { ...catData });
        setEditingCategory(null);
      } else {
        await addDoc(collection(db, 'categories'), { ...catData });
      }
      setCatData({ name: '', icon: '' });
      if (catFileRef.current) catFileRef.current.value = '';
    } catch (err) { alert('Database error'); }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn pb-32">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white">Management Studio</h1>
          <p className="text-gray-500 font-medium">Create and manage your game library</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-[#16191e] rounded-2xl border border-gray-800">
          <button 
            onClick={() => setActiveTab('games')}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'games' ? 'bg-purple-600 text-white shadow-xl' : 'text-gray-400 hover:text-white'}`}
          >
            Games
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-purple-600 text-white shadow-xl' : 'text-gray-400 hover:text-white'}`}
          >
            Categories
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Sticky on desktop */}
        <div className="lg:col-span-4 h-fit lg:sticky lg:top-24">
          <div className="bg-[#1a1d23] p-8 rounded-[2rem] border border-gray-800 shadow-2xl">
            {activeTab === 'games' ? (
              <>
                <h2 className="text-2xl font-black mb-8 text-purple-400 flex items-center gap-3">
                  <div className="bg-purple-600/10 p-2 rounded-lg"><Icons.Plus /></div>
                  {editingGame ? 'Update Game' : 'Post New Game'}
                </h2>
                <form onSubmit={handleGameSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Game Title</label>
                    <input type="text" placeholder="e.g., Moto X3M Pool Party" value={gameData.title} onChange={e => setGameData({...gameData, title: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-2xl px-5 py-3.5 outline-none transition-all font-bold text-sm" required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Genre / Category</label>
                    <select value={gameData.category} onChange={e => setGameData({...gameData, category: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-2xl px-5 py-3.5 outline-none transition-all font-bold text-sm appearance-none cursor-pointer" required>
                      <option value="">Choose a genre...</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Media Upload</label>
                    <div className="flex flex-col gap-4">
                      <div 
                        onClick={() => gameFileRef.current?.click()}
                        className="group relative cursor-pointer aspect-video bg-[#0b0e11] border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden"
                      >
                        {gameData.image ? (
                          <img src={gameData.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-purple-400">
                            <Icons.Plus />
                            <span className="text-[10px] font-black uppercase tracking-widest">Select Image</span>
                          </div>
                        )}
                        <input type="file" ref={gameFileRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'game')} className="hidden" />
                      </div>
                      <input type="text" placeholder="Or paste image URL directly" value={gameData.image} onChange={e => setGameData({...gameData, image: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-2xl px-5 py-2 text-[10px] outline-none font-mono" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Play / Embed Link</label>
                    <input type="text" placeholder="Iframe or SWF URL" value={gameData.url} onChange={e => setGameData({...gameData, url: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-2xl px-5 py-3.5 outline-none transition-all font-bold text-sm" required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Special Badge</label>
                    <input type="text" placeholder="🔥, HOT, NEW, UPDATED" value={gameData.badge} onChange={e => setGameData({...gameData, badge: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-2xl px-5 py-3.5 outline-none transition-all font-bold text-sm" />
                  </div>
                  
                  <div className="pt-4 flex flex-col gap-3">
                    <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 transition-all transform active:scale-95">
                      {loading ? 'Processing...' : (editingGame ? 'Update Game' : 'Publish Game')}
                    </button>
                    {editingGame && (
                      <button type="button" onClick={() => { setEditingGame(null); setGameData({title: '', category: '', image: '', badge: '', url: ''}); }} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest">
                        Discard Changes
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black mb-8 text-purple-400 flex items-center gap-3">
                  <div className="bg-purple-600/10 p-2 rounded-lg"><Icons.Plus /></div>
                  {editingCategory ? 'Edit Category' : 'New Collection'}
                </h2>
                <form onSubmit={handleCatSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Name</label>
                    <input type="text" placeholder="e.g., Action, Sports..." value={catData.name} onChange={e => setCatData({...catData, name: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-2xl px-5 py-3.5 outline-none transition-all font-bold text-sm" required />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Collection Icon</label>
                    <div className="flex flex-col gap-4">
                      <div 
                        onClick={() => catFileRef.current?.click()}
                        className="group relative cursor-pointer w-24 h-24 bg-[#0b0e11] border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden mx-auto"
                      >
                        {catData.icon ? (
                          <img src={catData.icon} className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-gray-500 group-hover:text-purple-400">
                            <Icons.Plus />
                          </div>
                        )}
                        <input type="file" ref={catFileRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'cat')} className="hidden" />
                      </div>
                      <input type="text" placeholder="Or Icon URL" value={catData.icon} onChange={e => setCatData({...catData, icon: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-2xl px-5 py-2 text-[10px] outline-none font-mono" />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 transition-all transform active:scale-95">
                      {loading ? 'Processing...' : (editingCategory ? 'Update Genre' : 'Create Genre')}
                    </button>
                    {editingCategory && (
                      <button type="button" onClick={() => { setEditingCategory(null); setCatData({name: '', icon: ''}); }} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest">
                        Discard Changes
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Right List: Scrollable */}
        <div className="lg:col-span-8">
          <div className="bg-[#1a1d23] rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#16191e] border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-black uppercase tracking-widest text-[11px] text-gray-400">
                Current {activeTab === 'games' ? `Games Library (${games.length})` : `Categories (${categories.length})`}
              </h3>
            </div>
            
            <div className="max-h-[800px] overflow-y-auto custom-scrollbar">
              {activeTab === 'games' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {games.map(g => (
                    <div key={g.id} className="flex gap-4 p-4 bg-[#0b0e11] border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-all group">
                      <img src={g.image} className="w-20 h-20 rounded-xl object-cover shadow-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{g.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-gray-800 rounded-md text-[9px] font-black text-gray-500 uppercase">{g.category}</span>
                          {g.badge && <span className="text-[9px]">{g.badge}</span>}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleEditGame(g)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors">Edit</button>
                          <button onClick={() => { if(confirm('Delete?')) deleteDoc(doc(db, 'games', g.id)) }} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
                  {categories.map(c => (
                    <div key={c.id} className="flex flex-col items-center p-6 bg-[#0b0e11] border border-gray-800 rounded-3xl hover:border-purple-500/30 transition-all text-center relative group">
                      <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                        {c.icon ? <img src={c.icon} className="w-10 h-10 object-contain" /> : <div className="w-2 h-2 rounded-full bg-purple-500" />}
                      </div>
                      <h4 className="font-black text-sm text-white uppercase tracking-tight">{c.name}</h4>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        <button onClick={() => handleEditCat(c)} className="p-2 bg-blue-500 rounded-lg shadow-lg"><Icons.Edit /></button>
                        <button onClick={() => { if(confirm('Delete?')) deleteDoc(doc(db, 'categories', c.id)) }} className="p-2 bg-red-500 rounded-lg shadow-lg"><Icons.Delete /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
