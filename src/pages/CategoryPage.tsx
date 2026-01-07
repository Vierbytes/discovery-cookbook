/**
 * Category Page
 *
 * Displays all recipes for a specific category.
 * Uses URL parameter to get the category name.
 *
 * Route: /category/:categoryName
 */

import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getRecipesByCategoryUrl } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Recipe } from '../types';
import './CategoryPage.css';

/**
 * API response wrapper for recipes by category
 */
interface RecipesByCategoryResponse {
  meals: Recipe[] | null;
}

function CategoryPage() {
  /**
   * Get category name from URL parameter
   */
  const { categoryName } = useParams<{ categoryName: string }>();

  /**
   * Fetch recipes for this category
   *
   * Only fetch if categoryName exists.
   */
  const { data, loading, error } = useFetch<RecipesByCategoryResponse>(
    categoryName ? getRecipesByCategoryUrl(categoryName) : null
  );

  // Show loading spinner
  if (loading) {
    return <Spinner message={`Loading ${categoryName} recipes...`} />;
  }

  // Show error message
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Handle no recipes found
  if (!data || !data.meals) {
    return (
      <div className="category-page">
        <div className="category-header">
          <Link to="/" className="back-link">← Back to Categories</Link>
          <h1>{categoryName}</h1>
        </div>
        <div className="no-results">
          <p>No recipes found in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <Link to="/" className="back-link">← Back to Categories</Link>
        <h1>{categoryName} Recipes</h1>
        <p className="recipe-count">{data.meals.length} recipes found</p>
      </div>

      <div className="recipes-grid">
        {data.meals.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
