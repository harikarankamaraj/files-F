import React from 'react';

export default function MatchScore({ score = 90, size = "md" }) {
  // Score color tiers
  let colorClass = "from-emerald-400 to-cyan-400 border-emerald-400/40 text-emerald-300 shadow-emerald-500/20";
  let bgGlow = "bg-emerald-500/10";

  if (score >= 90) {
    colorClass = "from-cyan-400 to-purple-400 border-cyan-400/50 text-cyan-300 shadow-cyan-500/30";
    bgGlow = "bg-cyan-500/15";
  } else if (score >= 75) {
    colorClass = "from-purple-400 to-pink-400 border-purple-400/40 text-purple-300 shadow-purple-500/20";
    bgGlow = "bg-purple-500/10";
  } else if (score >= 50) {
    colorClass = "from-amber-400 to-orange-400 border-amber-400/40 text-amber-300 shadow-amber-500/20";
    bgGlow = "bg-amber-500/10";
  } else {
    colorClass = "from-slate-400 to-gray-500 border-gray-500/30 text-gray-400 shadow-none";
    bgGlow = "bg-slate-800/40";
  }

  if (size === "sm") {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-slate-900/80 ${colorClass}`}>
        <span>{score}%</span>
        <span className="opacity-80">Match</span>
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border backdrop-blur-md ${bgGlow} ${colorClass} shadow-xl`}>
        <span className="text-3xl font-black tracking-tight">{score}%</span>
        <span className="text-xs uppercase font-semibold tracking-wider opacity-80">Match Score</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-slate-900/90 shadow-lg ${colorClass}`}>
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
      <span className="text-sm font-extrabold">{score}%</span>
      <span className="uppercase text-[10px] tracking-wider opacity-75">Match</span>
    </div>
  );
}
