import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function FavoriteButton({ isFavorite = false, onToggle, loading = false, size = "md" }) {
  const [fav, setFav] = useState(isFavorite);

  const handleClick = (e) => {
    e.stopPropagation();
    const newStatus = !fav;
    setFav(newStatus);
    if (onToggle) onToggle(newStatus);
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={fav ? "Remove from Favorites" : "Add to Favorites"}
      className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 flex items-center justify-center ${
        fav
          ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-lg shadow-rose-500/20 hover:bg-rose-500/30'
          : 'bg-slate-900/70 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/40 hover:bg-slate-800/80'
      }`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-300 ${
          fav ? 'fill-rose-500 text-rose-500 scale-110' : 'hover:scale-110'
        }`}
      />
    </button>
  );
}
