import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import GameGrid from '../components/GameGrid';
import { getGames } from '../services/api';
import { Sparkles, Gamepad2, Wand2, Trophy, ArrowRight } from 'lucide-react';

export default function HomePage({
  onSearch,
  onNavigateToDiscover,
  onNavigateToCreator,
  onViewDetails,
  onFavoriteToggle,
  onGenerateSimilar
}) {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGames()
      .then((res) => {
        // Pick top rated sample games for showcase
        setFeaturedGames(res ? res.slice(0, 8) : []);
      })
      .catch((err) => console.error("Error fetching featured games:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header */}
      <Hero
        onSearch={onSearch}
        onCreateGame={(prompt) => onNavigateToCreator(prompt)}
        onNavigateToDiscover={onNavigateToDiscover}
        onNavigateToCreator={() => onNavigateToCreator()}
      />

      {/* Featured Games Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" /> Featured Platform Games
            </h2>
            <p className="text-xs text-gray-400">Hand-curated sample dataset across genres & platforms</p>
          </div>

          <button
            onClick={onNavigateToDiscover}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Explore All Games <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <GameGrid
          games={featuredGames}
          loading={loading}
          onViewDetails={onViewDetails}
          onFavoriteToggle={onFavoriteToggle}
          onGenerateSimilar={onGenerateSimilar}
        />
      </div>

      {/* Creator Callout Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl border border-purple-500/40 p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-purple-950/60 via-[#0a0a1a] to-cyan-950/40">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
              <Wand2 className="w-4 h-4 text-purple-400" /> HTML5 Playable Game Generator
            </div>
            <h3 className="text-3xl font-black text-white gradient-text-cyan leading-tight">
              Turn Any Game Prompt into a Playable Browser Game
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Describe game mechanics, character types, and difficulty curves. GameGenie AI will immediately compile a playable HTML5 Canvas mini-game running inside your browser!
            </p>
          </div>

          <button
            onClick={() => onNavigateToCreator()}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-base transition-all shadow-xl shadow-cyan-500/30 hover:scale-105 whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5 fill-black" /> Launch AI Creator Studio
          </button>
        </div>
      </div>
    </div>
  );
}
