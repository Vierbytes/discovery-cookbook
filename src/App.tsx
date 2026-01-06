/**
 * App Component
 *
 * Main application component that sets up:
 * - React Router with all routes
 * - FavoritesContext provider for global state
 * - Navigation bar
 * - Page routing
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Home page - all categories */}
              <Route path="/" element={<Home />} />

              {/* Category page - recipes by category */}
              <Route path="/category/:categoryName" element={<CategoryPage />} />

              {/* Recipe detail page */}
              <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />

              {/* Favorites page */}
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* Search results page */}
              <Route path="/search" element={<SearchPage />} />

              {/* 404 fallback - redirect to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;
