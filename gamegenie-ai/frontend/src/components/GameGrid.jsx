import React from 'react';
import GameCard from './GameCard';
import { Gamepad2, SearchX } from 'lucide-react';

export default function GameGrid({
  games = [],
  loading = false,
  onViewDetails,
  onFavoriteToggle,
  onGenerateSimilar,
  emptyTitle = "No games found",
  emptySubtitle = "Try adjusting your description prompt or filter settings."
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="glass-card rounded-2xl h-[380px] p-4 flex flex-col justify-between animate-pulse">
            <div className="w-full h-44 bg-slate-800/80 rounded-xl mb-4"></div>
            <div className="space-y-2">
              <div className="h-5 bg-slate-800/80 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800/60 rounded w-1/2"></div>
              <div className="h-10 bg-slate-800/40 rounded w-full mt-2"></div>
            </div>
            <div className="flex gap-2 pt-4">
              <div className="h-9 bg-slate-800/80 rounded-xl flex-1"></div>
              <div className="h-9 bg-slate-800/80 rounded-xl flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 glass-panel rounded-2xl border border-white/10 text-center">
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
          <SearchX className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{emptyTitle}</h3>
        <p className="text-sm text-gray-400 max-w-md mb-6">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((item, idx) => {
        const gameId = item.game ? item.game.id : item.id;
        return (
          <GameCard
            key={gameId || idx}
            gameData={item}
            onViewDetails={onViewDetails}
            onFavoriteToggle={onFavoriteToggle}
            onGenerateSimilar={onGenerateSimilar}
          />
        );
      })}
    </div>
  );
}
