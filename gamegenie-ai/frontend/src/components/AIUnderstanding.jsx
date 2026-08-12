import React from 'react';
import { Cpu, Sparkles, Tag, Monitor, Gamepad2, Layers, ShieldAlert, CheckCircle } from 'lucide-react';

export default function AIUnderstanding({ understanding, prompt }) {
  if (!understanding) return null;

  return (
    <div className="mb-8 p-6 rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl relative overflow-hidden group">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 group-hover:bg-cyan-500/20 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              AI Intent Extraction & Interpretation
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                <Sparkles className="w-3 h-3" /> Ready
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Parsed user prompt: <span className="text-cyan-300 font-medium italic">"{prompt}"</span>
            </p>
          </div>
        </div>

        {understanding.summary && (
          <div className="text-xs text-cyan-200/90 max-w-md bg-slate-900/60 px-3.5 py-2 rounded-xl border border-white/10">
            {understanding.summary}
          </div>
        )}
      </div>

      {/* Tag Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Genre */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> Genre
          </span>
          <span className="text-sm font-bold text-white truncate">{understanding.genre}</span>
        </div>

        {/* Mode */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> Mode
          </span>
          <span className="text-sm font-bold text-purple-300">
            {understanding.multiplayer ? 'Multiplayer' : 'Single Player'}
          </span>
        </div>

        {/* Theme */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Theme
          </span>
          <span className="text-sm font-bold text-pink-300">{understanding.theme}</span>
        </div>

        {/* Gameplay Style */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Gameplay
          </span>
          <span className="text-sm font-bold text-emerald-300 truncate">{understanding.gameplay_style}</span>
        </div>

        {/* Difficulty */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Difficulty
          </span>
          <span className="text-sm font-bold text-amber-300">{understanding.difficulty}</span>
        </div>

        {/* Platform */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Monitor className="w-3.5 h-3.5 text-cyan-400" /> Target Platform
          </span>
          <span className="text-sm font-bold text-cyan-300 truncate">
            {Array.isArray(understanding.platform) ? understanding.platform.join(', ') : understanding.platform}
          </span>
        </div>
      </div>

      {/* Keywords */}
      {understanding.keywords && understanding.keywords.length > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Keywords:
          </span>
          {understanding.keywords.map((kw, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
              #{kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
