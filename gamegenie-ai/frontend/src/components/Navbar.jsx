import React, { useState } from 'react';
import { Gamepad2, Search, Heart, User, Wand2, Home, Compass, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({
  activeTab,
  onNavigate,
  favoritesCount = 0,
  onOpenPreferences
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'creator', label: 'AI Game Creator', icon: Wand2 },
    { id: 'mygames', label: 'My Games', icon: Heart, badge: favoritesCount },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl bg-[#070913]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 border border-cyan-400/40 text-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight flex items-center gap-1">
              GameGenie <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block -mt-1">
              Discovery & Creation Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : ''}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('discover')}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            title="Search Games"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('mygames')}
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-gray-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
            title="My Favorites"
          >
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPreferences}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors text-xs font-bold"
            title="Gamer Preferences Profile"
          >
            <User className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-white/10 text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#070913] p-4 space-y-2 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
