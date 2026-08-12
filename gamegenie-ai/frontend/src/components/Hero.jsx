import React from 'react';
import SearchBox from './SearchBox';
import { Gamepad2, Sparkles, Wand2, Shield, Zap } from 'lucide-react';

export default function Hero({ onSearch, onCreateGame, onNavigateToDiscover, onNavigateToCreator }) {
  return (
    <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto text-center space-y-8">
        
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/10 animate-float">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>GameGenie AI – Describe your game. Discover it. Create it.</span>
        </div>

        {/* Main Hero Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Next <br />
            <span className="gradient-text-cyan">Perfect Game</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Tell AI what kind of game you want to play, and we'll analyze genres, platforms, and gameplay styles to deliver personalized recommendations.
          </p>
        </div>

        {/* Search Box Component */}
        <div className="pt-2">
          <SearchBox onSearch={onSearch} onCreateGame={onCreateGame} />
        </div>

        {/* Bottom CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onNavigateToDiscover}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:scale-105"
          >
            <Gamepad2 className="w-5 h-5 fill-black" /> Discover Games
          </button>
          
          <button
            onClick={onNavigateToCreator}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-panel border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white font-extrabold text-sm transition-all shadow-lg shadow-purple-500/20 hover:scale-105"
          >
            <Wand2 className="w-5 h-5 text-purple-400" /> Create a Game with AI
          </button>
        </div>

        {/* Feature Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/10 text-xs text-gray-400 font-medium">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> NLP Preference Parser
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" /> Weighted Match Scoring
          </div>
          <div className="flex items-center justify-center gap-2">
            <Gamepad2 className="w-4 h-4 text-emerald-400" /> 30+ Seeded Games
          </div>
          <div className="flex items-center justify-center gap-2">
            <Wand2 className="w-4 h-4 text-pink-400" /> Playable HTML5 Canvas
          </div>
        </div>

      </div>
    </section>
  );
}
