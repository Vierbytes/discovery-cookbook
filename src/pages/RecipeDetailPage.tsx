/**
 * Recipe Detail Page
 *
 * Displays full details for a single recipe.
 * Includes add/remove favorites functionality.
 *
 * Route: /recipe/:recipeId
 */

import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaYoutube, FaGlobe } from 'react-icons/fa';
import { useFetch } from '../hooks/useFetch';
import { useFavorites } from '../contexts/FavoritesContext';
import { getRecipeByIdUrl, extractIngredients } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import type { RecipeDetail } from '../types';
import './RecipeDetailPage.css';

/**
 * API response wrapper for recipe detail
 */
interface RecipeDetailResponse {
  meals: RecipeDetail[] | null;
}

function RecipeDetailPage() {
  /**
   * Get recipe ID from URL parameter
   */
  const { recipeId } = useParams<{ recipeId: string }>();

  /**
   * Get favorites functions from context
   */
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  /**
   * Fetch recipe details
   */
  const { data, loading, error } = useFetch<RecipeDetailResponse>(
    recipeId ? getRecipeByIdUrl(recipeId) : null
  );

  // Show loading spinner
  if (loading) {
    return <Spinner message="Loading recipe..." />;
  }

  // Show error message
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Handle recipe not found
  if (!data || !data.meals || data.meals.length === 0) {
    return (
      <div className="recipe-detail-page">
        <div className="not-found">
          <h1>Recipe Not Found</h1>
          <p>The recipe you're looking for doesn't exist.</p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const recipe = data.meals[0];
  const ingredients = extractIngredients(recipe as unknown as Record<string, string | null>);
  const isRecipeFavorited = isFavorite(recipe.idMeal);

  /**
   * Toggle favorite status
   */
  const handleToggleFavorite = () => {
    if (isRecipeFavorited) {
      removeFavorite(recipe.idMeal);
    } else {
      addFavorite(recipe.idMeal);
    }
  };

  return (
    <div className="recipe-detail-page">
      <div className="recipe-detail-container">
        {/* Header with image */}
        <div className="recipe-header">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="recipe-hero-image"
          />
          <div className="recipe-header-content">
            <h1 className="recipe-title">{recipe.strMeal}</h1>
            <div className="recipe-meta">
              <span className="recipe-category">
                <FaGlobe className="meta-icon" />
                {recipe.strArea}
              </span>
              <span className="recipe-category-badge">{recipe.strCategory}</span>
            </div>
            <button
              className={`favorite-button ${isRecipeFavorited ? 'favorited' : ''}`}
              onClick={handleToggleFavorite}
            >
              {isRecipeFavorited ? (
                <>
                  <FaHeart /> Remove from Favorites
                </>
              ) : (
                <>
                  <FaRegHeart /> Add to Favorites
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="recipe-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {ingredients.map((item, index) => (
              <li key={index} className="ingredient-item">
                <span className="ingredient-measure">{item.measure}</span>
                <span className="ingredient-name">{item.ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="recipe-section">
          <h2>Instructions</h2>
          <div className="instructions">
            {recipe.strInstructions.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Video Link if available */}
        {recipe.strYoutube && (
          <div className="recipe-section">
            <h2>Video Tutorial</h2>
            <a
              href={recipe.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-link"
            >
              <FaYoutube className="youtube-icon" />
              Watch on YouTube
            </a>
          </div>
        )}

        {/* Back Link */}
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

export default RecipeDetailPage;
