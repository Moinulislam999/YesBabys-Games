
import React, { useState, useEffect } from 'react';
import { Game, User, GameCategory } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import GameGrid from './components/GameGrid';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import GamePlayer from './components/GamePlayer';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | 'Home'>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Listen for Games
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'games'), 
      (snapshot) => {
        const gamesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Game[];
        setGames(gamesList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
        setError(null);
        setIsInitializing(false);
      },
      (err) => {
        console.error("Firestore Games Error:", err);
        if (err.code === 'permission-denied') setError("Access Denied: Check Firestore Rules.");
      }
    );
    return () => unsub();
  }, []);

  // 2. Listen for Categories
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const cats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GameCategory[];
        setCategories(cats.sort((a, b) => a.name.localeCompare(b.name)));
      }
    );
    return () => unsub();
  }, []);

  // 3. Listen for Auth State
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ ...userDoc.data() as User, id: firebaseUser.uid });
          } else {
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: firebaseUser.displayName || 'Player',
              searchHistory: [],
              playedGames: [],
              isAdmin: firebaseUser.email === 'moinulbd.sk@gmail.com'
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (e) { console.error(e); }
      } else {
        setUser(null);
        setIsAdminMode(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handlePlayGame = async (game: Game) => {
    setActiveGame(game);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.id), { playedGames: arrayUnion(game.id) });
      } catch (e) { console.warn(e); }
    }
  };

  const filteredGames = games.filter(g => {
    const matchesCategory = selectedCategory === 'Home' || g.category === selectedCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#0b0e11] text-white">
      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
        categories={categories}
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar 
          user={user} 
          onLoginClick={() => setShowAuthModal(true)} 
          onLogout={handleLogout}
          onSearch={setSearchQuery}
          onAdminToggle={() => setIsAdminMode(!isAdminMode)}
        />

        <main className="flex-1 p-4 md:p-8">
          {isAdminMode && user?.isAdmin ? (
            <AdminPanel games={games} categories={categories} onClose={() => setIsAdminMode(false)} />
          ) : activeGame ? (
            <GamePlayer game={activeGame} onBack={() => setActiveGame(null)} />
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black mb-2">
                  {selectedCategory === 'Home' ? 'Discover Games' : `${selectedCategory} Games`}
                </h2>
                <p className="text-gray-400">Hand-picked premium web games for you</p>
              </div>
              <GameGrid games={filteredGames} onPlay={handlePlayGame} />
              {filteredGames.length === 0 && !isInitializing && (
                <div className="text-center py-20 text-gray-500">No games found.</div>
              )}
            </>
          )}
        </main>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default App;
