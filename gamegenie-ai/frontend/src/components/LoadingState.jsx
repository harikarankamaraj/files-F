import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Search, SlidersHorizontal } from 'lucide-react';

export default function LoadingState({ message = "AI is finding your perfect games..." }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Understanding your request...",
    "Analyzing game preferences...",
    "Searching database & online sources...",
    "Calculating multi-factor match scores...",
    "Generating personalized recommendations..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 border-r-purple-500 animate-spin flex items-center justify-center"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <div className="absolute -inset-4 rounded-full bg-cyan-500/10 blur-xl -z-10 animate-pulse"></div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-wide gradient-text-cyan">
        {message}
      </h3>

      <div className="flex items-center gap-2 text-sm text-cyan-300/80 bg-slate-900/80 px-4 py-2 rounded-full border border-cyan-500/20 backdrop-blur-md">
        <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
        <span>{steps[step]}</span>
      </div>
    </div>
  );
}
