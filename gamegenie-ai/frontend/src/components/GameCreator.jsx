import React, { useState } from 'react';
import { Wand2, Play, Sparkles, Cpu, Layers, ShieldAlert, Gamepad2, CheckCircle2 } from 'lucide-react';
import { generateGame } from '../services/api';

export default function GameCreator({ initialPrompt = "", onLaunchGame, showToast }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generating, setGenerating] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState(null);
  const [generatedConfig, setGeneratedConfig] = useState(null);

  const samplePrompts = [
    "Create a 2D space shooter where the player controls a spaceship, enemies appear in waves, and difficulty increases over time.",
    "Create an endless runner set in a neon cyberpunk city where you jump over laser barriers.",
    "Build a quantum cyber snake game where eating energy orbs grows your body.",
    "Generate a futuristic paddle pong game against an AI opponent.",
    "Create a neon breakout brick destroyer game with explosive laser combos."
  ];

  const handleGenerateSpec = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    setGeneratedSpec(null);
    setGeneratedConfig(null);

    try {
      const result = await generateGame(prompt.trim());
      setGeneratedSpec(result.spec);
      setGeneratedConfig(result.game_config);
      if (showToast) showToast("AI Game Specification Generated Successfully!", "success");
    } catch (err) {
      console.error("Failed to generate game:", err);
      if (showToast) showToast("Error generating game. Please try again.", "error");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Creator Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
          <Wand2 className="w-4 h-4 text-purple-400" /> AI Game Studio & Engine
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white gradient-text-pink">
          Describe & Generate Playable Games
        </h2>
        <p className="text-sm text-gray-300 max-w-xl mx-auto">
          Enter any game concept in natural language. GameGenie AI will formulate a structured specification and compile a playable HTML5 Canvas browser game in seconds!
        </p>
      </div>

      {/* Creator Prompt Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

        <form onSubmit={handleGenerateSpec} className="space-y-4">
          <label className="block text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Enter Game Concept Prompt
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="e.g. Create a 2D space shooter with futuristic weapons, increasing enemy wave difficulty, and score multipliers..."
            className="w-full bg-slate-950/80 border border-white/10 focus:border-purple-500 rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none shadow-inner"
          />

          {/* Prompt Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-gray-400 font-medium">Quick Presets:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(p);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-slate-900 border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-purple-300 transition-colors"
              >
                Preset #{idx + 1}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={generating || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
            >
              <Cpu className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              {generating ? "Formulating AI Specification..." : "Formulate Game Specification"}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Spec Preview Card */}
      {generatedSpec && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{generatedSpec.title}</h3>
                <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider">
                  Template Engine: {generatedSpec.game_type} | Genre: {generatedSpec.genre}
                </span>
              </div>
            </div>

            <button
              onClick={() => onLaunchGame && onLaunchGame(generatedConfig)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm transition-all shadow-lg shadow-cyan-500/30 hover:scale-105"
            >
              <Play className="w-5 h-5 fill-black" /> Launch & Play Now
            </button>
          </div>

          {/* Grid Spec Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">Theme</span>
              <p className="text-sm font-bold text-purple-300">{generatedSpec.theme}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">Player Unit</span>
              <p className="text-sm font-bold text-cyan-300">{generatedSpec.player}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">Enemies & Hazards</span>
              <p className="text-sm font-bold text-rose-400">{generatedSpec.enemies}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">Controls</span>
              <p className="text-sm font-bold text-emerald-300">{generatedSpec.controls}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">Difficulty & Levels</span>
              <p className="text-sm font-bold text-amber-300">{generatedSpec.difficulty} ({generatedSpec.levels})</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">Visual Style</span>
              <p className="text-sm font-bold text-cyan-300">{generatedSpec.visual_style}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10">
            <span className="text-xs font-bold text-gray-300 uppercase block mb-1">Game Objective & Rules</span>
            <p className="text-sm text-gray-200">{generatedSpec.objective}</p>
          </div>
        </div>
      )}
    </div>
  );
}
