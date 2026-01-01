
export interface Game {
  id: string;
  title: string;
  category: string; // Refers to Category.name
  image: string;
  playIcon?: string; // Specific sticker/icon for the play button
  badge?: string; // e.g., "New", "🔥", "Updated"
  url: string;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  searchHistory: string[];
  playedGames: string[]; // IDs of played games
  isAdmin: boolean;
}

export interface GameCategory {
  id: string;
  name: string;
  icon: string; // URL to the logo/icon
}
