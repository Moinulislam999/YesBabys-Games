
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
  const playIconFileRef = useRef<HTMLInputElement>(null);
  const catFileRef = useRef<HTMLInputElement>(null);

  const [gameData, setGameData] = useState({
    title: '',
    category: categories[0]?.name || '',
    image: '',
    playIcon: '',
    badge: '',
    url: ''
  });

  const [catData, setCatData] = useState({
    name: '',
    icon: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'image' | 'playIcon' | 'icon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadstart = () => setLoading(true);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === 'image') {
        setGameData(prev => ({ ...prev, image: base64String }));
      } else if (target === 'playIcon') {
        setGameData(prev => ({ ...prev, playIcon: base64String }));
      } else {
        setCatData(prev => ({ ...prev, icon: base64String }));
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
      playIcon: game.playIcon || '',
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
    if (!gameData.image) { alert('Please provide a game image (Upload or Link)'); return; }
    setLoading(true);
    try {
      const payload = {
        ...gameData,
        badge: gameData.badge || null,
        playIcon: gameData.playIcon || null
      };

      if (editingGame) {
        await updateDoc(doc(db, 'games', editingGame.id), payload);
        setEditingGame(null);
      } else {
        await addDoc(collection(db, 'games'), { ...payload, createdAt: Date.now() });
      }
      setGameData({ title: '', category: categories[0]?.name || '', image: '', playIcon: '', badge: '', url: '' });
      if (gameFileRef.current) gameFileRef.current.value = '';
      if (playIconFileRef.current) playIconFileRef.current.value = '';
    } catch (err) { alert('Database error'); }
    setLoading(false);
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catData.icon) { alert('Please provide a category icon (Upload or Link)'); return; }
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

  // Reusable component for Image Input (File + URL)
  const ImageInput = ({ 
    label, 
    value, 
    onChange, 
    onFileClick, 
    fileRef, 
    previewType = 'cover' 
  }: any) => (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="grid grid-cols-1 gap-3">
        {/* URL Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Paste Image URL..." 
            value={value.startsWith('data:') ? '' : value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all text-xs font-bold"
          />
        </div>

        {/* File Upload Area */}
        <div 
          onClick={onFileClick}
          className={`relative cursor-pointer bg-[#0b0e11] border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-2xl flex items-center justify-center overflow-hidden transition-all group ${previewType === 'sticker' ? 'aspect-square w-full' : 'aspect-video'}`}
        >
          {value ? (
            <img src={value} className={`w-full h-full ${previewType === 'sticker' ? 'object-contain p-4' : 'object-cover'}`} />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
              <Icons.Plus />
              <span className="text-[8px] font-black uppercase tracking-widest">Upload File</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-[10px] font-black uppercase text-white bg-purple-600 px-3 py-1 rounded-full">Change</span>
          </div>
          <input type="file" ref={fileRef} accept="image/*" onChange={(e) => handleFileUpload(e, label.includes('Sticker') ? 'playIcon' : (label.includes('Category') ? 'icon' : 'image'))} className="hidden" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn pb-32 px-4">
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
        {/* Left Column: Form */}
        <div className="lg:col-span-5 h-fit lg:sticky lg:top-24">
          <div className="bg-[#1a1d23] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl">
            {activeTab === 'games' ? (
              <form onSubmit={handleGameSubmit} className="space-y-6">
                <h2 className="text-2xl font-black text-purple-400 flex items-center gap-3">
                  <div className="bg-purple-600/10 p-2 rounded-lg"><Icons.Plus /></div>
                  {editingGame ? 'Update Game' : 'Post New Game'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Game Title</label>
                    <input type="text" placeholder="e.g., Moto X3M" value={gameData.title} onChange={e => setGameData({...gameData, title: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-all font-bold text-sm" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Genre</label>
                    <select value={gameData.category} onChange={e => setGameData({...gameData, category: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-all font-bold text-sm appearance-none cursor-pointer" required>
                      <option value="">Choose genre...</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageInput 
                    label="Main Game Cover" 
                    value={gameData.image} 
                    onChange={(val: string) => setGameData({...gameData, image: val})}
                    onFileClick={() => gameFileRef.current?.click()}
                    fileRef={gameFileRef}
                    previewType="cover"
                  />
                  <ImageInput 
                    label="Play Button Sticker" 
                    value={gameData.playIcon} 
                    onChange={(val: string) => setGameData({...gameData, playIcon: val})}
                    onFileClick={() => playIconFileRef.current?.click()}
                    fileRef={playIconFileRef}
                    previewType="sticker"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Play (Iframe/Game) URL</label>
                  <input type="text" placeholder="https://..." value={gameData.url} onChange={e => setGameData({...gameData, url: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-all font-bold text-sm" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Game Badge (Optional)</label>
                  <input type="text" placeholder="NEW, HOT, 3D" value={gameData.badge} onChange={e => setGameData({...gameData, badge: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-all font-bold text-sm" />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button type="submit" disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all transform active:scale-95">
                    {loading ? 'Wait...' : (editingGame ? 'Update' : 'Publish')}
                  </button>
                  {editingGame && (
                    <button type="button" onClick={() => { setEditingGame(null); setGameData({title: '', category: '', image: '', playIcon: '', badge: '', url: ''}); }} className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-2xl font-black uppercase text-xs">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleCatSubmit} className="space-y-6">
                <h2 className="text-2xl font-black text-purple-400 flex items-center gap-3">
                  <div className="bg-purple-600/10 p-2 rounded-lg"><Icons.Plus /></div>
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h2>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category Name</label>
                  <input type="text" placeholder="e.g., Action" value={catData.name} onChange={e => setCatData({...catData, name: e.target.value})} className="w-full bg-[#0b0e11] border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-all font-bold text-sm" required />
                </div>

                <ImageInput 
                  label="Category Icon/Logo" 
                  value={catData.icon} 
                  onChange={(val: string) => setCatData({...catData, icon: val})}
                  onFileClick={() => catFileRef.current?.click()}
                  fileRef={catFileRef}
                  previewType="sticker"
                />

                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all transform active:scale-95">
                  {loading ? 'Wait...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-7">
          <div className="bg-[#1a1d23] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#16191e] border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-black uppercase tracking-widest text-[11px] text-gray-400">
                Library Stats: {activeTab === 'games' ? games.length : categories.length} Total
              </h3>
            </div>
            
            <div className="max-h-[850px] overflow-y-auto p-6 scrollbar-hide">
              {activeTab === 'games' ? (
                <div className="space-y-3">
                  {games.map(g => (
                    <div key={g.id} className="flex items-center gap-4 p-4 bg-[#0b0e11] border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-all group">
                      <div className="relative flex-shrink-0">
                        <img src={g.image} className="w-16 h-12 rounded-lg object-cover" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md bg-white border border-black/10 flex items-center justify-center text-[10px] shadow-lg">
                           {g.playIcon ? <img src={g.playIcon} className="w-full h-full object-contain p-0.5" /> : '🎮'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{g.title}</h4>
                        <span className="text-[9px] font-black text-purple-500 uppercase tracking-tighter">{g.category}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditGame(g)} className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all"><Icons.Edit /></button>
                        <button onClick={() => { if(confirm('Permanently delete game?')) deleteDoc(doc(db, 'games', g.id)) }} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"><Icons.Delete /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {categories.map(c => (
                    <div key={c.id} className="flex flex-col items-center p-6 bg-[#0b0e11] border border-gray-800 rounded-3xl relative group">
                      <img src={c.icon} className="w-12 h-12 object-contain mb-3" />
                      <h4 className="font-black text-[10px] text-white uppercase tracking-widest">{c.name}</h4>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditCat(c)} className="p-1.5 bg-blue-500 rounded-md scale-75 hover:scale-100 transition-transform"><Icons.Edit /></button>
                        <button onClick={() => { if(confirm('Delete category?')) deleteDoc(doc(db, 'categories', c.id)) }} className="p-1.5 bg-red-500 rounded-md scale-75 hover:scale-100 transition-transform"><Icons.Delete /></button>
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
