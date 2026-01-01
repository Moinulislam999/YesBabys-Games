
import React, { useState, useEffect } from 'react';
import { Game, User, Category } from './types';
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
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Home'>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Listen for Games from Firestore with robust Error Handling
  useEffect(() => {
    console.log("Starting games snapshot listener...");
    const unsub = onSnapshot(
      collection(db, 'games'), 
      (snapshot) => {
        const gamesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Game[];
        // Sort by creation date descending
        setGames(gamesList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
        setError(null);
        setIsInitializing(false);
      },
      (err) => {
        console.error("Firestore Snapshot Error:", err);
        setIsInitializing(false);
        if (err.code === 'permission-denied') {
          setError("Access Denied: Please ensure you have copied the 'firestore.rules' content and published it in your Firebase Console (Build > Firestore Database > Rules).");
        } else {
          setError(`Failed to load games: ${err.message}`);
        }
      }
    );
    return () => unsub();
  }, []);

  // 2. Listen for Auth State
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({ ...userData, id: firebaseUser.uid });
          } else {
            // Create profile if it doesn't exist
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Player',
              searchHistory: [],
              playedGames: [],
              isAdmin: firebaseUser.email === 'moinulbd.sk@gmail.com'
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (e: any) {
          console.error("Error fetching user profile:", e);
          // If profile fetch fails but user is authenticated, we can still show limited UI
          if (e.code === 'permission-denied') {
            console.warn("User profile exists but permission denied. Check your rules for /users/{userId}");
          }
        }
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
    setIsAdminMode(false);
  };

  const handlePlayGame = async (game: Game) => {
    setActiveGame(game);
    if (user) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          playedGames: arrayUnion(game.id)
        });
      } catch (e) {
        console.warn("Could not save history:", e);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (user && query.trim().length > 2) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          searchHistory: arrayUnion(query.trim())
        });
      } catch (e) {
        console.warn("Could not save search history:", e);
      }
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
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar 
          user={user} 
          onLoginClick={() => setShowAuthModal(true)} 
          onLogout={handleLogout}
          onSearch={handleSearch}
          onAdminToggle={() => setIsAdminMode(!isAdminMode)}
        />

        <main className="flex-1 p-4 md:p-8">
          {error && (
            <div className="mb-6 p-6 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-200 animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-bold">Database Connection Issue</h3>
              </div>
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
          )}

          {isInitializing && !error ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isAdminMode && user?.isAdmin ? (
            <AdminPanel games={games} onClose={() => setIsAdminMode(false)} />
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
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">No games found in this category.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

// Fix: Adding the missing default export for the App component.
export default App;
