/**
 * Favorites Page
 *
 * Displays all recipes that the user has marked as favorites.
 * Shows empty state message when no favorites exist.
 *
 * Route: /favorites
 */

import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';
import { getRecipeByIdUrl } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Recipe } from '../types';
import './FavoritesPage.css';

function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch details for all favorite recipes
   *
   * This effect runs whenever the favorites array changes.
   * It fetches the full recipe data for each favorited ID.
   */
  useEffect(() => {
    // If no favorites, clear recipes and return
    if (favorites.length === 0) {
      setFavoriteRecipes([]);
      return;
    }

    /**
     * Fetch all favorite recipes
     *
     * I'm using Promise.all to fetch all recipes in parallel
     * for better performance.
     */
    const fetchFavoriteRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        // Create array of fetch promises
        const fetchPromises = favorites.map(async (recipeId) => {
          const response = await fetch(getRecipeByIdUrl(recipeId));
          if (!response.ok) {
            throw new Error(`Failed to fetch recipe ${recipeId}`);
          }
          const data = await response.json();
          return data.meals[0]; // Get first (and only) recipe from response
        });

        // Wait for all fetches to complete
        const recipes = await Promise.all(fetchPromises);

        // Filter out any null/undefined recipes and update state
        setFavoriteRecipes(recipes.filter(Boolean));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, [favorites]); // Re-run when favorites change

  // Show loading spinner
  if (loading) {
    return <Spinner message="Loading your favorites..." />;
  }

  // Show error message
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Show empty state if no favorites
  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="empty-favorites">
          <FaHeart className="empty-favorites-icon" />
          <h2>No Favorites Yet</h2>
          <p>Start exploring recipes and add your favorites to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>
          <FaHeart className="header-icon" />
          My Favorite Recipes
        </h1>
        <p className="favorites-count">{favorites.length} recipes saved</p>
      </div>

      <div className="favorites-grid">
        {favoriteRecipes.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
