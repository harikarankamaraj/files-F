import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import FilterPanel from '../components/FilterPanel';
import AIUnderstanding from '../components/AIUnderstanding';
import GameGrid from '../components/GameGrid';
import LoadingState from '../components/LoadingState';
import { getRecommendations } from '../services/api';
import { Sparkles, SlidersHorizontal, Compass } from 'lucide-react';

export default function DiscoverPage({
  initialPrompt = "",
  onViewDetails,
  onFavoriteToggle,
  onGenerateSimilar
}) {
  const [prompt, setPrompt] = useState(initialPrompt || "A multiplayer shooting game with futuristic weapons");
  const [filters, setFilters] = useState({});
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);

  const executeDiscoverySearch = async (searchPrompt, appliedFilters = filters) => {
    if (!searchPrompt || !searchPrompt.trim()) return;

    setLoading(true);
    try {
      const res = await getRecommendations(searchPrompt.trim(), appliedFilters);
      setRecommendationResult(res);
    } catch (err) {
      console.error("Discovery Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeDiscoverySearch(prompt, filters);
  }, []);

  const handleSearchSubmit = (newPrompt) => {
    setPrompt(newPrompt);
    executeDiscoverySearch(newPrompt, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    executeDiscoverySearch(prompt, newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
    executeDiscoverySearch(prompt, {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40 mb-2">
            <Compass className="w-4 h-4 text-cyan-400" /> Natural Language AI Discovery
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            AI Game Recommendations
          </h1>
        </div>

        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 border border-white/10 text-xs font-bold transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          {showFilterDrawer ? "Hide Filter Drawer" : "Filter Options"}
        </button>
      </div>

      {/* Search Input Bar */}
      <SearchBox
        onSearch={handleSearchSubmit}
        initialPrompt={prompt}
        placeholder="Describe the game you want to discover (e.g. relaxing farming game, 2D puzzle with hard levels...)"
      />

      {/* Optional Filters Drawer */}
      <FilterPanel
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
      />

      {/* AI Processing / Results View */}
      {loading ? (
        <LoadingState message="GameGenie AI is analyzing your prompt and ranking database games..." />
      ) : recommendationResult ? (
        <div className="space-y-8 animate-fade-in">
          {/* AI Intent Extraction Card */}
          <AIUnderstanding
            understanding={recommendationResult.ai_understanding}
            prompt={recommendationResult.prompt}
          />

          {/* Results Grid Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Top Recommended Matches
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {recommendationResult.recommendations?.length || 0} Games Scored
              </span>
            </h3>
          </div>

          {/* Scored Recommendations Grid */}
          <GameGrid
            games={recommendationResult.recommendations || []}
            onViewDetails={onViewDetails}
            onFavoriteToggle={onFavoriteToggle}
            onGenerateSimilar={onGenerateSimilar}
            emptyTitle="No recommendations found matching your criteria"
            emptySubtitle="Try tweaking your natural language prompt or broadening your filter drawer settings."
          />
        </div>
      ) : null}
    </div>
  );
}
