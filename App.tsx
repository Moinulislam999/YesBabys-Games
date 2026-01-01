
import React, { useState, useEffect, useCallback } from 'react';
import { Game, User, CATEGORIES, Category } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import GameGrid from './components/GameGrid';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import GamePlayer from './components/GamePlayer';

const STORAGE_KEY_GAMES = 'crazyplay_games';
const STORAGE_KEY_USER = 'crazyplay_user';
const STORAGE_KEY_HISTORY = 'crazyplay_history';

const INITIAL_GAMES: Game[] = [
  { id: '1', title: 'Moto X3M', category: 'Driving', image: 'https://picsum.photos/seed/moto/400/225', badge: '🔥 Hot', url: 'https://www.crazygames.com/game/moto-x3m', createdAt: Date.now() },
  { id: '2', title: 'Slope', category: 'Action', image: 'https://picsum.photos/seed/slope/400/225', badge: 'New', url: 'https://www.crazygames.com/game/slope', createdAt: Date.now() },
  { id: '3', title: 'Shell Shockers', category: 'Shooting', image: 'https://picsum.photos/seed/shell/400/225', badge: 'Multiplayer', url: 'https://www.crazygames.com/game/shell-shockers', createdAt: Date.now() },
  { id: '4', title: 'Subway Surfers', category: 'Adventure', image: 'https://picsum.photos/seed/subway/400/225', badge: 'Classic', url: 'https://www.crazygames.com/game/subway-surfers-world-tour-san-francisco', createdAt: Date.now() },
  { id: '5', title: 'Cookie Clicker', category: 'Clicker', image: 'https://picsum.photos/seed/cookie/400/225', badge: '🍪', url: 'https://www.crazygames.com/game/cookie-clicker', createdAt: Date.now() },
  { id: '6', title: 'Temple Run 2', category: 'Adventure', image: 'https://picsum.photos/seed/temple/400/225', badge: 'Fun', url: 'https://www.crazygames.com/game/temple-run-2', createdAt: Date.now() },
  { id: '7', title: 'Fireboy and Watergirl', category: 'Puzzle', image: 'https://picsum.photos/seed/fire/400/225', badge: 'Co-op', url: 'https://www.crazygames.com/game/fireboy-and-watergirl-the-forest-temple', createdAt: Date.now() },
  { id: '8', title: 'Drift Hunters', category: 'Car', image: 'https://picsum.photos/seed/drift/400/225', badge: '💨', url: 'https://www.crazygames.com/game/drift-hunters', createdAt: Date.now() },
];

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Home'>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  // Load Initial Data
  useEffect(() => {
    const savedGames = localStorage.getItem(STORAGE_KEY_GAMES);
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    } else {
      setGames(INITIAL_GAMES);
      localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(INITIAL_GAMES));
    }

    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save Games to "Firebase" (Local Storage simulation)
  const saveGames = (updatedGames: Game[]) => {
    setGames(updatedGames);
    localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(updatedGames));
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    setShowAuthModal(false);
    if (userData.isAdmin) {
      setIsAdminMode(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    setIsAdminMode(false);
  };

  const handlePlayGame = (game: Game) => {
    setActiveGame(game);
    if (user) {
      const updatedUser = {
        ...user,
        playedGames: Array.from(new Set([...(user.playedGames || []), game.id]))
      };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    }
  };

  const filteredGames = games.filter(g => {
    const matchesCategory = selectedCategory === 'Home' || g.category === selectedCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#0b0e11] text-white">
      {/* Sidebar - Persistent */}
      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <Navbar 
          user={user} 
          onLoginClick={() => setShowAuthModal(true)} 
          onLogout={handleLogout}
          onSearch={setSearchQuery}
          onAdminToggle={() => setIsAdminMode(!isAdminMode)}
        />

        <main className="flex-1 p-4 md:p-8">
          {isAdminMode && user?.isAdmin ? (
            <AdminPanel 
              games={games} 
              onUpdateGames={saveGames} 
              onClose={() => setIsAdminMode(false)} 
            />
          ) : activeGame ? (
            <GamePlayer game={activeGame} onBack={() => setActiveGame(null)} />
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'Home' ? 'All Games' : `${selectedCategory} Games`}
                </h2>
                <p className="text-gray-400 text-sm">
                  {filteredGames.length} Games Found
                </p>
              </div>

              <GameGrid games={filteredGames} onPlay={handlePlayGame} />
              
              {filteredGames.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <p className="text-xl">No games found in this category.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default App;
