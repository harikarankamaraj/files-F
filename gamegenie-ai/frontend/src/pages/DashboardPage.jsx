import React, { useState, useEffect } from 'react';
import GameGrid from '../components/GameGrid';
import { getPreferences, getHistory, getFavorites, getGeneratedGames, getGames } from '../services/api';
import { LayoutDashboard, User, History, Gamepad2, Heart, Wand2, Search, Sliders, CheckCircle2 } from 'lucide-react';

export default function DashboardPage({
  onSearch,
  onViewDetails,
  onFavoriteToggle,
  onGenerateSimilar,
  onOpenPreferences
}) {
  const [profile, setProfile] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [personalizedGames, setPersonalizedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPreferences(),
      getHistory(),
      getFavorites(),
      getGeneratedGames(),
      getGames()
    ])
      .then(([prefRes, historyRes, favRes, genRes, gamesRes]) => {
        setProfile(prefRes);
        setSearchHistory(historyRes || []);
        setFavoritesCount(favRes ? favRes.length : 0);
        setGeneratedCount(genRes ? genRes.length : 0);
        setPersonalizedGames(gamesRes ? gamesRes.slice(0, 6) : []);
      })
      .catch((err) => console.error("Error loading dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Dashboard Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40 mb-2">
            <LayoutDashboard className="w-4 h-4 text-cyan-400" /> Gamer Intelligence Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            User Dashboard
          </h1>
        </div>

        <button
          onClick={onOpenPreferences}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all shadow-md shadow-purple-500/10"
        >
          <Sliders className="w-4 h-4 text-purple-400" /> Edit Preferences Profile
        </button>
      </div>

      {/* Activity Stats Widgets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{searchHistory.length}</div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Searches Run</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{favoritesCount}</div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Games Favorited</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{generatedCount}</div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Games Created</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">30+</div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Database Catalog</div>
          </div>
        </div>
      </div>

      {/* Profile & History Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Your Gaming Profile Widget */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <User className="w-5 h-5 text-purple-400" /> Your Gaming Profile
          </h3>

          {profile ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-gray-400 font-semibold block mb-1 uppercase">Favorite Genres</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.favorite_genres?.map((g, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-gray-400 font-semibold block mb-1 uppercase">Favorite Platforms</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.favorite_platforms?.map((p, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Difficulty</span>
                  <span className="text-sm font-bold text-amber-300">{profile.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Mode</span>
                  <span className="text-sm font-bold text-emerald-300">{profile.game_mode}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-xs">Loading profile settings...</div>
          )}
        </div>

        {/* Recent Searches Section */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <History className="w-5 h-5 text-cyan-400" /> Recent Search History
          </h3>

          {searchHistory.length > 0 ? (
            <div className="space-y-2">
              {searchHistory.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSearch && onSearch(item.query)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-cyan-300">"{item.query}"</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-xs italic py-4">No recent search prompts recorded yet.</div>
          )}
        </div>
      </div>

      {/* Personalized Recommendations Feed */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Recommended For Your Profile
        </h3>
        <GameGrid
          games={personalizedGames}
          loading={loading}
          onViewDetails={onViewDetails}
          onFavoriteToggle={onFavoriteToggle}
          onGenerateSimilar={onGenerateSimilar}
        />
      </div>
    </div>
  );
}
