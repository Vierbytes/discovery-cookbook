/**
 * RecipeCard Component
 *
 * A reusable card component for displaying recipe preview information.
 * Used in category listings, search results, and favorites page.
 *
 * Shows:
 * - Recipe thumbnail image
 * - Recipe name
 * - Clickable link to recipe detail page
 */

import { Link } from 'react-router-dom';
import type { Recipe } from '../types';
import './RecipeCard.css';

interface RecipeCardProps {
  recipe: Recipe;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${recipe.idMeal}`} className="recipe-card">
      <div className="recipe-card-image-wrapper">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="recipe-card-image"
          loading="lazy"
        />
      </div>
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.strMeal}</h3>
      </div>
    </Link>
  );
}

export default RecipeCard;
