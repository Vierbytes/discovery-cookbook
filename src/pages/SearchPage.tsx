/**
 * Search Page
 *
 * Displays search results based on query parameter.
 * Route: /search?query=term
 */

import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useFetch } from '../hooks/useFetch';
import { searchRecipesUrl } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import type { RecipeDetail } from '../types';
import './SearchPage.css';

/**
 * API response wrapper for search results
 */
interface SearchResponse {
  meals: RecipeDetail[] | null;
}

function SearchPage() {
  /**
   * Get search query from URL parameters
   */
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  /**
   * Fetch search results
   */
  const { data, loading, error } = useFetch<SearchResponse>(
    query ? searchRecipesUrl(query) : null
  );

  // Show message if no query provided
  if (!query) {
    return (
      <div className="search-page">
        <div className="no-query">
          <FaSearch className="no-query-icon" />
          <h2>Enter a search term</h2>
          <p>Use the search bar above to find recipes</p>
        </div>
      </div>
    );
  }

  // Show loading spinner
  if (loading) {
    return <Spinner message={`Searching for "${query}"...`} />;
  }

  // Show error message
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Handle no results
  if (!data || !data.meals) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h1>Search Results for "{query}"</h1>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
        <div className="no-results">
          <FaSearch className="no-results-icon" />
          <h2>No recipes found</h2>
          <p>Try searching with different keywords</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Results for "{query}"</h1>
        <p className="results-count">{data.meals.length} recipes found</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>

      <div className="search-grid">
        {data.meals.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
