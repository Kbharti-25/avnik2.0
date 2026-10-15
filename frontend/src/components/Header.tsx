import React from 'react';
import { 
  ChevronRight, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentInvestigationId?: string;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  alertCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentInvestigationId = 'INV-2026-084',
  onOpenSearch,
  onOpenAlerts,
  alertCount = 3,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`h-16 px-6 flex items-center justify-between border-b transition-colors duration-200 select-none ${
        theme === 'dark'
          ? 'bg-[#0E1715]/80 border-[#1C2E29] backdrop-blur-md'
          : 'bg-white/80 border-slate-200/80 backdrop-blur-md'
      }`}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Workspace</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400 font-medium">Investigations</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span
          className={`font-mono font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          {currentInvestigationId}
        </span>
      </div>

      {/* Right Controls: Demo workspace pill, Search, Notifications, Theme toggle, Avatar */}
      <div className="flex items-center gap-3">
        {/* Demo Workspace Pill */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            theme === 'dark'
              ? 'bg-[#12231E] border-[#1E3B33] text-emerald-400'
              : 'bg-[#EAF7EE] border-emerald-200 text-[#0B6938]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Demo workspace</span>
        </div>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          title="Search entities (Ctrl+K)"
          className={`p-2 rounded-xl transition-all btn-press ${
            theme === 'dark'
              ? 'hover:bg-[#1A2D28] text-slate-400 hover:text-white'
              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenAlerts}
          title="Explainable alerts"
          className={`relative p-2 rounded-xl transition-all btn-press ${
            theme === 'dark'
              ? 'hover:bg-[#1A2D28] text-slate-400 hover:text-white'
              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* Quick Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className={`p-2 rounded-xl border transition-all btn-press ${
            theme === 'dark'
              ? 'bg-[#142320] border-[#1E3B33] text-amber-400 hover:text-amber-300'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Avatar */}
        <div
          title="Bharath (Lead Forensics)"
          className="w-8 h-8 rounded-full bg-[#0F5A38] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-emerald-500/20 cursor-pointer shadow-sm btn-press"
        >
          BK
        </div>
      </div>
    </header>
  );
};
