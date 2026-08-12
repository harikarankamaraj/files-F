import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import GameDetailsModal from './components/GameDetailsModal';
import UserPreferencesModal from './components/UserPreferencesModal';
import GameCanvas from './components/GameCanvas';

import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import CreatorPage from './pages/CreatorPage';
import MyGamesPage from './pages/MyGamesPage';
import DashboardPage from './pages/DashboardPage';

import { getFavorites, addFavorite, removeFavorite } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchPrompt, setSearchPrompt] = useState('');
  const [creatorPrompt, setCreatorPrompt] = useState('');
  
  // Modals state
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCanvasConfig, setActiveCanvasConfig] = useState(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  
  // Favorites counter state
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const updateFavoritesCount = () => {
    getFavorites()
      .then((res) => setFavoritesCount(res ? res.length : 0))
      .catch((err) => console.error("Error fetching favorites count:", err));
  };

  useEffect(() => {
    updateFavoritesCount();
  }, []);

  // Navigation & Search Handlers
  const handleSearch = (prompt) => {
    setSearchPrompt(prompt);
    setActiveTab('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCreator = (prompt = '') => {
    if (prompt) setCreatorPrompt(prompt);
    setActiveTab('creator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateSimilar = (game) => {
    const prompt = `Create a 2D game inspired by ${game.title} with ${game.genre} mechanics, ${game.theme} visuals, and increasing wave difficulty.`;
    setCreatorPrompt(prompt);
    setActiveTab('creator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded "${game.title}" into AI Creator Studio!`, 'info');
  };

  const handleFavoriteToggle = async (gameId, newStatus) => {
    try {
      if (newStatus) {
        await addFavorite(gameId);
        showToast("Added game to your Favorites!", "success");
      } else {
        await removeFavorite(gameId);
        showToast("Removed game from Favorites.", "info");
      }
      updateFavoritesCount();
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      showToast("Could not update favorite status.", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070913] text-gray-100 selection:bg-cyan-500 selection:text-black">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favoritesCount}
        onOpenPreferences={() => setPreferencesOpen(true)}
      />

      {/* Main Active Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onSearch={handleSearch}
            onNavigateToDiscover={() => setActiveTab('discover')}
            onNavigateToCreator={handleNavigateToCreator}
            onViewDetails={(game) => setSelectedGame(game)}
            onFavoriteToggle={handleFavoriteToggle}
            onGenerateSimilar={handleGenerateSimilar}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverPage
            initialPrompt={searchPrompt}
            onViewDetails={(game) => setSelectedGame(game)}
            onFavoriteToggle={handleFavoriteToggle}
            onGenerateSimilar={handleGenerateSimilar}
          />
        )}

        {activeTab === 'creator' && (
          <CreatorPage
            initialPrompt={creatorPrompt}
            onLaunchGame={(config) => setActiveCanvasConfig(config)}
            showToast={showToast}
          />
        )}

        {activeTab === 'mygames' && (
          <MyGamesPage
            onViewDetails={(game) => setSelectedGame(game)}
            onFavoriteToggle={handleFavoriteToggle}
            onGenerateSimilar={handleGenerateSimilar}
            onLaunchGame={(config) => setActiveCanvasConfig(config)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onSearch={handleSearch}
            onViewDetails={(game) => setSelectedGame(game)}
            onFavoriteToggle={handleFavoriteToggle}
            onGenerateSimilar={handleGenerateSimilar}
            onOpenPreferences={() => setPreferencesOpen(true)}
          />
        )}
      </main>

      {/* Modals & Overlay Canvas */}
      {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onFavoriteToggle={handleFavoriteToggle}
          onGenerateSimilar={handleGenerateSimilar}
        />
      )}

      {preferencesOpen && (
        <UserPreferencesModal
          isOpen={preferencesOpen}
          onClose={() => setPreferencesOpen(false)}
          onSaved={() => {
            showToast("Gamer Profile Preferences Saved!", "success");
          }}
        />
      )}

      {activeCanvasConfig && (
        <GameCanvas
          gameConfig={activeCanvasConfig}
          onClose={() => setActiveCanvasConfig(null)}
        />
      )}

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
