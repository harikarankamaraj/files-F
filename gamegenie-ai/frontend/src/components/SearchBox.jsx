import React, { useState } from 'react';
import { Search, Sparkles, Wand2, X } from 'lucide-react';

export default function SearchBox({
  onSearch,
  onCreateGame,
  initialPrompt = "",
  placeholder = "Describe the game you want to play..."
}) {
  const [prompt, setPrompt] = useState(initialPrompt);

  const examplePrompts = [
    "A multiplayer FPS with futuristic weapons",
    "A relaxing farming game",
    "A difficult 2D puzzle game",
    "An open-world adventure game"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && onSearch) {
      onSearch(prompt.trim());
    }
  };

  const handleChipClick = (text) => {
    setPrompt(text);
    if (onSearch) onSearch(text);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-lg opacity-30 group-hover:opacity-60 transition duration-500"></div>

        <div className="relative flex items-center bg-[#0d1222]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl p-2 focus-within:border-cyan-400">
          <div className="pl-3 pr-2 text-cyan-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-white placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none px-2 py-3"
          />

          {prompt && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 pr-1">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-black stroke-[3]" /> Discover Games
            </button>

            {onCreateGame && (
              <button
                type="button"
                onClick={() => onCreateGame(prompt)}
                className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 font-bold text-sm transition-all whitespace-nowrap"
              >
                <Wand2 className="w-4 h-4 text-purple-400" /> Create Game
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Example Prompt Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-xs text-gray-400 font-semibold mr-1">Try examples:</span>
        {examplePrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(item)}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 transition-all shadow-sm"
          >
            ✨ "{item}"
          </button>
        ))}
      </div>
    </div>
  );
}
