/**
 * Home Page
 *
 * Displays all available meal categories from TheMealDB.
 * Each category is clickable and navigates to the category's recipe list.
 *
 * Uses:
 * - useFetch hook to load categories from API
 * - Spinner component for loading state
 * - ErrorMessage component for error handling
 */

import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getCategoriesUrl } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Category } from '../types';
import './Home.css';

/**
 * API response wrapper for categories
 */
interface CategoriesResponse {
  categories: Category[];
}

function Home() {
  /**
   * Fetch all categories using the useFetch hook
   *
   * The hook handles loading, error, and data states automatically.
   */
  const { data, loading, error } = useFetch<CategoriesResponse>(getCategoriesUrl());

  // Show loading spinner while fetching
  if (loading) {
    return <Spinner message="Loading categories..." />;
  }

  // Show error message if fetch failed
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Show message if no categories found (shouldn't happen with TheMealDB)
  if (!data || !data.categories || data.categories.length === 0) {
    return (
      <div className="home-page">
        <h1>No categories found</h1>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Discover Delicious Recipes</h1>
        <p>Browse our collection of recipes by category</p>
      </header>

      <div className="categories-grid">
        {data.categories.map((category) => (
          <Link
            key={category.idCategory}
            to={`/category/${category.strCategory}`}
            className="category-card"
          >
            <div className="category-image-wrapper">
              <img
                src={category.strCategoryThumb}
                alt={category.strCategory}
                className="category-image"
                loading="lazy"
              />
            </div>
            <div className="category-content">
              <h2 className="category-title">{category.strCategory}</h2>
              <p className="category-description">
                {category.strCategoryDescription.substring(0, 100)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
