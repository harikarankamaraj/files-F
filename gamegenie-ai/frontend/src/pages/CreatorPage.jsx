import React, { useState, useEffect } from 'react';
import GameCreator from '../components/GameCreator';
import { getGeneratedGames } from '../services/api';
import { Play, Wand2, History, Gamepad2, Calendar } from 'lucide-react';

export default function CreatorPage({ initialPrompt = "", onLaunchGame, showToast }) {
  const [userGeneratedGames, setUserGeneratedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserGames = () => {
    getGeneratedGames()
      .then((res) => setUserGeneratedGames(res || []))
      .catch((err) => console.error("Error fetching generated games:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserGames();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Creator Studio Component */}
      <GameCreator
        initialPrompt={initialPrompt}
        onLaunchGame={(config) => {
          if (onLaunchGame) onLaunchGame(config);
          fetchUserGames();
        }}
        showToast={showToast}
      />

      {/* Previously Generated Games Section */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" /> Your Previously Created AI Games
          </h3>
          <span className="text-xs text-gray-400 font-semibold">
            {userGeneratedGames.length} Games Generated
          </span>
        </div>

        {loading ? (
          <div className="text-gray-400 text-sm py-4">Loading your created games...</div>
        ) : userGeneratedGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userGeneratedGames.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {item.game_type}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-300 italic line-clamp-2">"{item.prompt}"</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-cyan-300 font-semibold">Ready to Play</span>
                  <button
                    onClick={() => onLaunchGame && onLaunchGame(item.game_config)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" /> Launch Game
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-panel text-center text-gray-400 text-sm">
            You haven't generated any custom AI games yet. Use the prompt box above to create your first playable browser game!
          </div>
        )}
      </div>
    </div>
  );
}
