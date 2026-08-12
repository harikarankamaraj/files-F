import React, { useState, useEffect } from 'react';
import GameGrid from '../components/GameGrid';
import { getFavorites, getGames, getGeneratedGames } from '../services/api';
import { Heart, Sparkles, Wand2, Bookmark, Play } from 'lucide-react';

export default function MyGamesPage({
  onViewDetails,
  onFavoriteToggle,
  onGenerateSimilar,
  onLaunchGame
}) {
  const [activeTab, setActiveTab] = useState('favorites'); // favorites, recommended, generated
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [generatedGames, setGeneratedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFavorites(),
      getGames(),
      getGeneratedGames()
    ])
      .then(([favRes, gamesRes, genRes]) => {
        // Extract game models from favorites
        const favs = favRes ? favRes.map((f) => f.game).filter(Boolean) : [];
        setFavoriteGames(favs);
        setRecommendedGames(gamesRes ? gamesRes.slice(0, 6) : []);
        setGeneratedGames(genRes || []);
      })
      .catch((err) => console.error("Error loading library data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 mb-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> Gamer Library & Saved Games
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            My Games
          </h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'favorites'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Favorites ({favoriteGames.length})
          </button>
          <button
            onClick={() => setActiveTab('generated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'generated'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Generated Games ({generatedGames.length})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recommended'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Recommended For You
          </button>
        </div>
      </div>

      {/* Favorites Tab Content */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-400" /> Saved Favorite Games
          </h3>
          <GameGrid
            games={favoriteGames}
            loading={loading}
            onViewDetails={onViewDetails}
            onFavoriteToggle={(id, status) => {
              if (onFavoriteToggle) onFavoriteToggle(id, status);
              setFavoriteGames(favoriteGames.filter((g) => g.id !== id));
            }}
            onGenerateSimilar={onGenerateSimilar}
            emptyTitle="No favorite games saved yet"
            emptySubtitle="Click the heart icon on any game card to add it to your personal favorites library!"
          />
        </div>
      )}

      {/* Generated Games Tab Content */}
      {activeTab === 'generated' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" /> AI Playable Browser Games
          </h3>
          {generatedGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedGames.map((item) => (
                <div key={item.id} className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 mb-2 inline-block">
                      {item.game_type}
                    </span>
                    <h4 className="text-base font-extrabold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-300 italic line-clamp-2">"{item.prompt}"</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-cyan-300 font-semibold">HTML5 Engine</span>
                    <button
                      onClick={() => onLaunchGame && onLaunchGame(item.game_config)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" /> Play Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl glass-panel text-center text-gray-400 text-sm">
              No AI games generated yet. Visit the AI Game Creator to build your first game!
            </div>
          )}
        </div>
      )}

      {/* Recommended For You Tab Content */}
      {activeTab === 'recommended' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" /> Personalized Recommendations
          </h3>
          <GameGrid
            games={recommendedGames}
            loading={loading}
            onViewDetails={onViewDetails}
            onFavoriteToggle={onFavoriteToggle}
            onGenerateSimilar={onGenerateSimilar}
          />
        </div>
      )}
    </div>
  );
}
