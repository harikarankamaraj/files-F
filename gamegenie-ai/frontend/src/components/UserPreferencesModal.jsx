import React, { useState, useEffect } from 'react';
import { X, Save, Sliders, Check } from 'lucide-react';
import { getPreferences, savePreferences } from '../services/api';

export default function UserPreferencesModal({ isOpen, onClose, onSaved }) {
  const [favoriteGenres, setFavoriteGenres] = useState(["Action", "Shooter", "RPG"]);
  const [favoritePlatforms, setFavoritePlatforms] = useState(["PC", "PlayStation"]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [gameMode, setGameMode] = useState("Both");
  const [saving, setSaving] = useState(false);

  const genresList = [
    "Action", "Shooter", "RPG", "Strategy", "Puzzle",
    "Racing", "Sports", "Simulation", "Horror", "Adventure", "Platformer", "Indie", "Farming"
  ];

  const platformsList = ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile", "Browser"];

  useEffect(() => {
    if (isOpen) {
      getPreferences()
        .then((res) => {
          if (res) {
            if (res.favorite_genres) setFavoriteGenres(res.favorite_genres);
            if (res.favorite_platforms) setFavoritePlatforms(res.favorite_platforms);
            if (res.difficulty) setDifficulty(res.difficulty);
            if (res.game_mode) setGameMode(res.game_mode);
          }
        })
        .catch((err) => console.error("Error loading preferences:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleGenre = (genre) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const togglePlatform = (plat) => {
    if (favoritePlatforms.includes(plat)) {
      setFavoritePlatforms(favoritePlatforms.filter((p) => p !== plat));
    } else {
      setFavoritePlatforms([...favoritePlatforms, plat]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await savePreferences({
        favorite_genres: favoriteGenres,
        favorite_platforms: favoritePlatforms,
        difficulty,
        game_mode: gameMode,
      });
      if (onSaved) onSaved(updated);
      onClose();
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/15 shadow-2xl p-6 bg-[#0b0f19] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gamer Personalization Profile</h3>
              <p className="text-xs text-gray-400">Tune AI recommendation weights to match your personal playstyle</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Favorite Genres */}
        <div>
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Favorite Genres</label>
          <div className="flex flex-wrap gap-2">
            {genresList.map((g) => {
              const active = favoriteGenres.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/60 text-gray-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-cyan-400" />}
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorite Platforms */}
        <div>
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Favorite Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platformsList.map((p) => {
              const active = favoritePlatforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                    active
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/20'
                      : 'bg-slate-900/60 text-gray-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-purple-400" />}
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Difficulty & Game Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Preferred Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-cyan-500"
            >
              <option value="Easy">Easy / Casual</option>
              <option value="Medium">Medium / Normal</option>
              <option value="Hard">Hard / Challenging</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Preferred Mode</label>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-cyan-500"
            >
              <option value="Single Player">Single Player</option>
              <option value="Multiplayer">Multiplayer</option>
              <option value="Both">Both Modes</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-gray-300 text-xs font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
