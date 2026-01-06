/**
 * FavoritesContext
 *
 * Global state management for user's favorite recipes using React Context API.
 *
 * This context provides:
 * - List of favorited recipe IDs
 * - Functions to add/remove favorites
 * - Function to check if a recipe is favorited
 * - Automatic persistence to localStorage
 *
 * The context uses the useLocalStorage hook internally to ensure
 * favorites persist across browser sessions.
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Shape of the Favorites Context value
 */
interface FavoritesContextValue {
  favorites: string[]; // Array of recipe IDs
  addFavorite: (recipeId: string) => void;
  removeFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
}

/**
 * Create the context with undefined as default
 *
 * We use undefined because we want to throw an error if someone
 * tries to use the context outside of a provider.
 */
const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

/**
 * FavoritesProvider Component
 *
 * Wraps the application (or part of it) to provide favorites functionality.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  /**
   * Use useLocalStorage to persist favorites
   *
   * The hook automatically loads favorites from localStorage on mount
   * and saves them whenever they change.
   */
  const [favorites, setFavorites] = useLocalStorage<string[]>('recipe-favorites', []);

  /**
   * Add a recipe to favorites
   *
   * I'm checking if the recipe is already favorited to avoid duplicates.
   */
  const addFavorite = (recipeId: string) => {
    setFavorites(prevFavorites => {
      // Don't add if already in favorites
      if (prevFavorites.includes(recipeId)) {
        return prevFavorites;
      }
      // Add to end of array
      return [...prevFavorites, recipeId];
    });
  };

  /**
   * Remove a recipe from favorites
   *
   * Filters out the specified recipe ID from the array.
   */
  const removeFavorite = (recipeId: string) => {
    setFavorites(prevFavorites =>
      prevFavorites.filter(id => id !== recipeId)
    );
  };

  /**
   * Check if a recipe is in favorites
   *
   * Returns true if the recipe ID is in the favorites array.
   */
  const isFavorite = (recipeId: string): boolean => {
    return favorites.includes(recipeId);
  };

  /**
   * Context value object
   *
   * This is what consuming components will receive.
   */
  const value: FavoritesContextValue = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Custom hook to use the Favorites context
 *
 * This provides a clean API for components to access favorites.
 * It also throws an error if used outside of a FavoritesProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
}
