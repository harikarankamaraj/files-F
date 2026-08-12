import React, { useState, useEffect } from 'react';
import { X, Star, Gamepad2, Monitor, Users, User, ShieldAlert, Sparkles, Tag, Wand2, Calendar, DollarSign, Layers } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { getSimilarGames } from '../services/api';

export default function GameDetailsModal({ game, onClose, onFavoriteToggle, onGenerateSimilar }) {
  const [similarGames, setSimilarGames] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    if (game && game.id) {
      setLoadingSimilar(true);
      getSimilarGames(game.id)
        .then((res) => setSimilarGames(res || []))
        .catch((err) => console.error("Error loading similar games:", err))
        .finally(() => setLoadingSimilar(false));
    }
  }, [game]);

  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col bg-[#0b0f19]">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-gray-400 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Header Cover Banner */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <img
              src={game.image_url}
              alt={game.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {game.genre}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {game.theme}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white gradient-text-cyan tracking-tight">
                  {game.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <FavoriteButton
                  isFavorite={game.is_favorite}
                  onToggle={(status) => onFavoriteToggle && onFavoriteToggle(game.id, status)}
                  size="lg"
                />
                <button
                  onClick={() => onGenerateSimilar && onGenerateSimilar(game)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                >
                  <Wand2 className="w-4 h-4" /> Generate Similar Game
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <div className="text-[11px] text-gray-400 font-semibold uppercase">Rating</div>
                <div className="text-base font-bold text-white">{game.rating?.toFixed(1)} / 5.0</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[11px] text-gray-400 font-semibold uppercase">Price</div>
                <div className="text-base font-bold text-emerald-300">{game.price === 0 ? "Free to Play" : `$${game.price}`}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-[11px] text-gray-400 font-semibold uppercase">Released</div>
                <div className="text-base font-bold text-white">{game.release_year}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[11px] text-gray-400 font-semibold uppercase">Difficulty</div>
                <div className="text-base font-bold text-amber-300">{game.difficulty}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">About The Game</h3>
            <p className="text-sm text-gray-200 leading-relaxed">{game.description}</p>
          </div>

          {/* AI Recommendation Reason */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-900/80 border border-cyan-500/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-cyan-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" /> Why AI Recommended This
            </div>
            <p className="text-sm text-cyan-100/90 leading-relaxed italic">
              "This title aligns perfectly with your requested preference for {game.genre.toLowerCase()} and {game.theme.toLowerCase()} elements, featuring {game.gameplay_style.toLowerCase()} mechanics designed for {game.platform}."
            </p>
          </div>

          {/* Additional Tags & Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Platforms & Mode</span>
              <div className="text-sm text-gray-200 font-medium flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" /> {game.platform}
              </div>
              <div className="text-sm text-gray-200 font-medium flex items-center gap-2">
                {game.multiplayer ? (
                  <>
                    <Users className="w-4 h-4 text-emerald-400" /> Supports Online Multiplayer & Co-op
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-amber-400" /> Single Player Campaign
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {game.tags ? game.tags.split(',').map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-200">
                    #{t.strip ? t.strip() : t.trim()}
                  </span>
                )) : null}
              </div>
            </div>
          </div>

          {/* Similar Games Section */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" /> Similar Games You Might Enjoy
            </h3>

            {loadingSimilar ? (
              <div className="text-center py-6 text-gray-400 text-sm">Loading similar games...</div>
            ) : similarGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarGames.slice(0, 4).map((sim) => (
                  <div key={sim.id} className="p-3 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
                    <img
                      src={sim.image_url}
                      alt={sim.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <h4 className="text-xs font-bold text-white line-clamp-1">{sim.title}</h4>
                    <span className="text-[10px] text-cyan-400">{sim.genre}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-xs italic">No similar games found in local database.</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
