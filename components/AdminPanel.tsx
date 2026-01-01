
import React, { useState } from 'react';
import { Game, CATEGORIES, Category } from '../types';
import { Icons } from '../constants';

interface AdminPanelProps {
  games: Game[];
  onUpdateGames: (games: Game[]) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ games, onUpdateGames, onClose }) => {
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0] as Category,
    image: '',
    badge: '',
    url: ''
  });

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      category: game.category as Category,
      image: game.image,
      badge: game.badge || '',
      url: game.url
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      onUpdateGames(games.filter(g => g.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image || !formData.url) return;

    if (editingGame) {
      const updated = games.map(g => g.id === editingGame.id ? { 
        ...g, 
        ...formData, 
        badge: formData.badge || undefined 
      } : g);
      onUpdateGames(updated);
      setEditingGame(null);
    } else {
      const newGame: Game = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        category: formData.category,
        image: formData.image,
        badge: formData.badge || undefined,
        url: formData.url,
        createdAt: Date.now()
      };
      onUpdateGames([newGame, ...games]);
    }

    setFormData({ title: '', category: CATEGORIES[0], image: '', badge: '', url: '' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">Admin Management</h1>
        <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1d23] p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-400">
              <Icons.Plus />
              {editingGame ? 'Edit Game' : 'Post New Game'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 focus:border-purple-500 outline-none"
                  placeholder="Game Name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 focus:border-purple-500 outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 focus:border-purple-500 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Game URL (Source)</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 focus:border-purple-500 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Badge (Text/Emoji)</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full bg-[#0b0e11] border border-gray-700 rounded-xl px-4 py-2.5 focus:border-purple-500 outline-none"
                  placeholder="e.g., 🔥, New, Updated"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20"
                >
                  {editingGame ? 'Save Changes' : 'Post Game'}
                </button>
                {editingGame && (
                  <button
                    type="button"
                    onClick={() => setEditingGame(null)}
                    className="px-6 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1d23] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#16191e] text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Game</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Badge</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {games.map(game => (
                    <tr key={game.id} className="hover:bg-[#1f232b] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={game.image} className="w-12 h-8 object-cover rounded shadow" alt="" />
                          <span className="font-bold text-gray-200">{game.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-medium">{game.category}</td>
                      <td className="px-6 py-4">
                        {game.badge ? (
                          <span className="bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded text-[10px] border border-purple-500/30 font-bold">
                            {game.badge}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(game)}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Icons.Edit />
                          </button>
                          <button 
                            onClick={() => handleDelete(game.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Icons.Delete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
