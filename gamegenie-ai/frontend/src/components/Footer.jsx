import React from 'react';
import { Sparkles, Heart, Gamepad2, Shield, Cpu } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="mt-20 border-t border-white/10 glass-panel bg-[#05070e] text-gray-400 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500 text-black">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-lg font-black text-white">GameGenie AI</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            "Describe your game. Discover it. Create it."
            <br /> AI-Powered natural language discovery engine and instant HTML5 playable game generator.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-cyan-300 transition-colors">Home Search</button>
            </li>
            <li>
              <button onClick={() => onNavigate('discover')} className="hover:text-cyan-300 transition-colors">AI Game Discovery</button>
            </li>
            <li>
              <button onClick={() => onNavigate('creator')} className="hover:text-cyan-300 transition-colors">AI Game Creator Studio</button>
            </li>
            <li>
              <button onClick={() => onNavigate('mygames')} className="hover:text-cyan-300 transition-colors">Favorites & Library</button>
            </li>
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-300 transition-colors">Gamer Dashboard</button>
            </li>
          </ul>
        </div>

        {/* Col 3: Tech Stack */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Tech Stack</h4>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> Python FastAPI + SQLite</li>
            <li className="flex items-center gap-1.5"><Gamepad2 className="w-3.5 h-3.5 text-purple-400" /> React 18 + Vite + Tailwind CSS</li>
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-pink-400" /> Multi-Factor NLP Match Engine</li>
            <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> HTML5 Canvas + Web Audio API</li>
          </ul>
        </div>

        {/* Col 4: Hackathon Notes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Hackathon Prototype</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Designed as a high-performance, working MVP for AI game discovery & browser game synthesis.
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
            Status: Fully Operational
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>© 2026 GameGenie AI. All rights reserved.</div>
        <div className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI Game Developers & Gamers worldwide.
        </div>
      </div>
    </footer>
  );
}
