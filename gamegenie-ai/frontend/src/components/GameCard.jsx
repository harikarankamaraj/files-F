import React from 'react';
import { Star, Gamepad2, Monitor, Users, User, ExternalLink, Wand2, Eye } from 'lucide-react';
import MatchScore from './MatchScore';
import FavoriteButton from './FavoriteButton';

export default function GameCard({
  gameData,
  onViewDetails,
  onFavoriteToggle,
  onGenerateSimilar
}) {
  // Check if wrapper scored item or plain game
  const game = gameData.game || gameData;
  const matchScore = gameData.match_score;
  const matchExplanation = gameData.match_explanation;

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-white/10 relative">
      {/* Cover Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={game.image_url}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-black/60"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {matchScore !== undefined ? (
            <MatchScore score={matchScore} size="sm" />
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
              {game.genre}
            </span>
          )}

          <FavoriteButton
            isFavorite={game.is_favorite}
            onToggle={(newStatus) => onFavoriteToggle && onFavoriteToggle(game.id, newStatus)}
            size="sm"
          />
        </div>

        {/* Rating & Price Overlay at Bottom of Cover */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 text-xs font-semibold text-white">
          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{game.rating?.toFixed(1)}</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-emerald-300 font-bold">
            {game.price === 0 ? "Free to Play" : `$${game.price}`}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-extrabold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1">
            {game.title}
          </h3>

          {/* Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-300">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
              <Gamepad2 className="w-3 h-3 text-cyan-400" /> {game.genre}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
              <Monitor className="w-3 h-3 text-purple-400" /> {game.platform?.split(',')[0]}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
              {game.multiplayer ? (
                <>
                  <Users className="w-3 h-3 text-emerald-400" /> Multiplayer
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-amber-400" /> Single Player
                </>
              )}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-300/90 line-clamp-2 mb-4 leading-relaxed">
            {game.description}
          </p>

          {/* Why We Recommend This Callout */}
          {matchExplanation && (
            <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-snug">
              <span className="font-bold text-cyan-400 block mb-0.5">Why we recommend this:</span>
              "{matchExplanation}"
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails && onViewDetails(game)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-gray-200 hover:text-white border border-white/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> View Details
          </button>

          <button
            onClick={() => onGenerateSimilar && onGenerateSimilar(game)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" /> Generate
          </button>
        </div>
      </div>
    </div>
  );
}
