/**
 * Navbar Component
 *
 * Main navigation bar for the application.
 * Includes:
 * - App logo/title
 * - Navigation links (Home, Favorites)
 * - Search bar
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaSearch, FaUtensils } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';
import './Navbar.css';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  /**
   * Handle search form submission
   *
   * Navigate to search page with query parameter.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to search page with query
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);

      // Clear search input
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <FaUtensils className="navbar-brand-icon" />
          <span className="navbar-brand-text">Recipe Cookbook</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="navbar-search-button" aria-label="Search">
            <FaSearch />
          </button>
        </form>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/favorites" className="navbar-link favorites-link">
            <FaHeart className="navbar-link-icon" />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="favorites-badge">{favorites.length}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
