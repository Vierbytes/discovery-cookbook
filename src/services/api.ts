/**
 * API Service for TheMealDB
 *
 * This file contains helper functions for constructing API URLs
 * for TheMealDB API endpoints.
 *
 * Base URL: https://www.themealdb.com/api/json/v1/1/
 * API is free and doesn't require an API key.
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Get URL for listing all meal categories
 *
 * Returns categories with id, name, thumbnail, and description.
 */
export const getCategoriesUrl = (): string => {
  return `${BASE_URL}/categories.php`;
};

/**
 * Get URL for filtering recipes by category
 *
 * @param categoryName - The category to filter by (e.g., "Seafood", "Beef")
 * Returns simplified recipe list with id, name, and thumbnail.
 */
export const getRecipesByCategoryUrl = (categoryName: string): string => {
  return `${BASE_URL}/filter.php?c=${encodeURIComponent(categoryName)}`;
};

/**
 * Get URL for looking up a recipe by ID
 *
 * @param recipeId - The recipe ID to look up
 * Returns full recipe details including ingredients, instructions, etc.
 */
export const getRecipeByIdUrl = (recipeId: string): string => {
  return `${BASE_URL}/lookup.php?i=${encodeURIComponent(recipeId)}`;
};

/**
 * Get URL for searching recipes by name
 *
 * @param query - The search term
 * Returns recipes matching the search term with full details.
 */
export const searchRecipesUrl = (query: string): string => {
  return `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
};

/**
 * Helper function to extract ingredients from recipe detail
 *
 * TheMealDB returns ingredients and measures in separate fields
 * (strIngredient1, strIngredient2, ... strMeasure1, strMeasure2, ...)
 * This function combines them into a clean array.
 *
 * @param recipe - The recipe detail object
 * @returns Array of {ingredient, measure} objects
 */
export const extractIngredients = (
  recipe: Record<string, string | null>
): { ingredient: string; measure: string }[] => {
  const ingredients: { ingredient: string; measure: string }[] = [];

  // There are up to 20 ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    // Only include if ingredient is not empty
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  return ingredients;
};
