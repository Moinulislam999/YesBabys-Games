
export interface Game {
  id: string;
  title: string;
  category: string;
  image: string;
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

export type Category = 
  | 'Action' 
  | 'Adventure' 
  | 'Car' 
  | 'Casual' 
  | 'Clicker' 
  | 'Driving' 
  | 'Horror' 
  | 'Multiplayer' 
  | 'Puzzle' 
  | 'Sports' 
  | 'Shooting';

export const CATEGORIES: Category[] = [
  'Action', 'Adventure', 'Car', 'Casual', 'Clicker', 'Driving', 'Horror', 'Multiplayer', 'Puzzle', 'Sports', 'Shooting'
];
