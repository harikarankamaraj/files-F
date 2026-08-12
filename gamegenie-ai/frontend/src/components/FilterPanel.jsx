import React from 'react';
import { SlidersHorizontal, RotateCcw, X, Filter } from 'lucide-react';

export default function FilterPanel({ filters, onChange, onReset, isOpen, onClose }) {
  const genres = [
    "All", "Shooter", "Farming", "Puzzle", "RPG", "Adventure",
    "Action", "Racing", "Strategy", "Simulation", "Horror", "Platformer", "Indie"
  ];

  const platforms = [
    "All", "PC", "PlayStation", "Xbox", "Nintendo", "Mobile", "Browser"
  ];

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const handleSelect = (key, value) => {
    onChange({
      ...filters,
      [key]: value === "All" ? null : value
    });
  };

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'block' : 'hidden md:block'}`}>
      <div className="p-5 rounded-2xl glass-panel border border-white/10 mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Optional Filter Drawer
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="text-xs text-gray-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
            {onClose && (
              <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Genre</label>
            <select
              value={filters.genre || "All"}
              onChange={(e) => handleSelect("genre", e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
            >
              {genres.map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
              ))}
            </select>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Platform</label>
            <select
              value={filters.platform || "All"}
              onChange={(e) => handleSelect("platform", e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
            >
              {platforms.map((p) => (
                <option key={p} value={p} className="bg-slate-900 text-white">{p}</option>
              ))}
            </select>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Game Mode</label>
            <select
              value={filters.multiplayer === true ? "Multiplayer" : filters.multiplayer === false ? "Single Player" : "All"}
              onChange={(e) => {
                const val = e.target.value;
                onChange({
                  ...filters,
                  multiplayer: val === "Multiplayer" ? true : val === "Single Player" ? false : null
                });
              }}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="All" className="bg-slate-900 text-white">All Modes</option>
              <option value="Multiplayer" className="bg-slate-900 text-white">Multiplayer Only</option>
              <option value="Single Player" className="bg-slate-900 text-white">Single Player Only</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Difficulty</label>
            <select
              value={filters.difficulty || "All"}
              onChange={(e) => handleSelect("difficulty", e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
