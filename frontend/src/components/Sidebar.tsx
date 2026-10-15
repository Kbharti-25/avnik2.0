import React, { useState } from 'react';
import { 
  Network, 
  LayoutDashboard, 
  Bell, 
  FileText, 
  FolderKanban, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Settings, 
  ExternalLink, 
  Sun, 
  Moon, 
  PanelLeftClose, 
  PanelLeftOpen,
  FlaskConical,
  Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  investigationCount?: number;
  alertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  investigationCount = 8,
  alertCount = 3,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCaseWorkspaceOpen, setIsCaseWorkspaceOpen] = useState(true);

  return (
    <aside
      className={`relative h-screen flex flex-col border-r transition-all duration-300 ease-out z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        theme === 'dark'
          ? 'bg-[#0E1715] border-[#1C2E29] text-slate-300'
          : 'bg-[#FFFFFF] border-slate-200/90 text-slate-600'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-inherit">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Icon */}
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-700/20 shrink-0">
            <Network className="w-5 h-5 stroke-[2.2]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-lg font-bold tracking-tight font-sans ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  anvik
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                Follow the connections.
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-lg transition-colors btn-press ${
            theme === 'dark'
              ? 'hover:bg-[#1A2D28] text-slate-400 hover:text-slate-200'
              : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
          }`}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Workspace Group */}
        <div>
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Workspace
            </span>
          )}
          <div className="mt-2 space-y-1">
            <button
              onClick={() => onSelectSection('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all btn-press ${
                activeSection === 'overview'
                  ? theme === 'dark'
                    ? 'bg-emerald-950/70 text-emerald-300 font-semibold'
                    : 'bg-emerald-50 text-emerald-800 font-semibold shadow-sm'
                  : theme === 'dark'
                  ? 'hover:bg-[#152521] text-slate-300 hover:text-white'
                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span>Overview</span>}
            </button>

            <button
              onClick={() => onSelectSection('investigations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all btn-press ${
                activeSection === 'investigations'
                  ? theme === 'dark'
                    ? 'bg-emerald-900/40 text-emerald-300 font-semibold border border-emerald-800/40'
                    : 'bg-[#EAF7EE] text-[#0B6938] font-semibold border border-emerald-200/60 shadow-sm'
                  : theme === 'dark'
                  ? 'hover:bg-[#152521] text-slate-300 hover:text-white'
                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Network className="w-4 h-4 shrink-0 text-emerald-600" />
                {!isCollapsed && <span className="truncate">Investigations</span>}
              </div>
              {!isCollapsed && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    theme === 'dark'
                      ? 'bg-emerald-800/60 text-emerald-200'
                      : 'bg-emerald-200/70 text-[#07532B]'
                  }`}
                >
                  {investigationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectSection('alerts')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all btn-press ${
                activeSection === 'alerts'
                  ? theme === 'dark'
                    ? 'bg-emerald-950/70 text-emerald-300 font-semibold'
                    : 'bg-emerald-50 text-emerald-800 font-semibold shadow-sm'
                  : theme === 'dark'
                  ? 'hover:bg-[#152521] text-slate-300 hover:text-white'
                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Bell className="w-4 h-4 shrink-0 text-slate-400" />
                {!isCollapsed && <span className="truncate">Alerts</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium text-slate-400 bg-slate-200/60 dark:bg-slate-800">
                  {alertCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectSection('timeline')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all btn-press ${
                activeSection === 'timeline'
                  ? theme === 'dark'
                    ? 'bg-emerald-950/70 text-emerald-300 font-semibold'
                    : 'bg-emerald-50 text-emerald-800 font-semibold shadow-sm'
                  : theme === 'dark'
                  ? 'hover:bg-[#152521] text-slate-300 hover:text-white'
                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span>Timeline</span>}
            </button>

            <button
              onClick={() => onSelectSection('counterfactual')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all btn-press ${
                activeSection === 'counterfactual'
                  ? theme === 'dark'
                    ? 'bg-emerald-950/70 text-emerald-300 font-semibold'
                    : 'bg-emerald-50 text-emerald-800 font-semibold shadow-sm'
                  : theme === 'dark'
                  ? 'hover:bg-[#152521] text-slate-300 hover:text-white'
                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical className="w-4 h-4 shrink-0 text-emerald-500" />
              {!isCollapsed && <span>What-If Simulator</span>}
            </button>
          </div>
        </div>

        {/* Manage Group */}
        <div>
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Manage
            </span>
          )}
          <div className="mt-2 space-y-1">
            <button
              onClick={() => setIsCaseWorkspaceOpen(!isCaseWorkspaceOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all btn-press ${
                theme === 'dark' ? 'hover:bg-[#152521] text-slate-300' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FolderKanban className="w-4 h-4 shrink-0 text-slate-400" />
                {!isCollapsed && <span className="truncate">Case workspace</span>}
              </div>
              {!isCollapsed && (
                isCaseWorkspaceOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isCaseWorkspaceOpen && !isCollapsed && (
              <div className="pl-9 pr-2 space-y-1 text-xs">
                <button
                  onClick={() => onSelectSection('cases')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors ${
                    activeSection === 'cases'
                      ? 'text-emerald-600 font-semibold dark:text-emerald-400'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  • Active Dossiers
                </button>
                <button
                  onClick={() => onSelectSection('cases')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  • Evidence Lockbox
                </button>
                <button
                  onClick={() => onSelectSection('cases')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  • LEA Escalations
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Callout Box (Evidence, not assumptions.) */}
        {!isCollapsed && (
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              theme === 'dark'
                ? 'bg-[#12201C] border-[#1E3830] text-slate-300'
                : 'bg-[#F9FBFA] border-emerald-100 text-slate-700 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold tracking-tight">Evidence, not assumptions.</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Every connection tells a story. Verify it before taking action.
            </p>
          </div>
        )}
      </div>

      {/* Footer Controls: Light/Dark Mode Switcher & Preferences */}
      <div className="p-3 border-t border-inherit space-y-2">
        {/* Interactive Theme Switcher */}
        <div
          className={`flex items-center justify-between p-1 rounded-xl border transition-colors ${
            theme === 'dark'
              ? 'bg-[#121F1B] border-[#1C332C]'
              : 'bg-slate-100/90 border-slate-200'
          }`}
        >
          {!isCollapsed && (
            <span className="text-[11px] font-medium px-2 text-slate-500 dark:text-slate-400">
              Appearance
            </span>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => theme !== 'light' && toggleTheme()}
              title="Switch to Light Mode"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all btn-press ${
                theme === 'light'
                  ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              {!isCollapsed && <span className="text-[11px]">Light</span>}
            </button>

            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              title="Switch to Dark Mode"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all btn-press ${
                theme === 'dark'
                  ? 'bg-emerald-950 text-emerald-300 shadow-sm border border-emerald-800/60 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              {!isCollapsed && <span className="text-[11px]">Dark</span>}
            </button>
          </div>
        </div>

        {/* Preferences & Help */}
        {!isCollapsed && (
          <div className="pt-1 flex items-center justify-between text-xs text-slate-400 px-1">
            <button
              onClick={() => onSelectSection('preferences')}
              className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>
            <a
              href="https://github.com/23jmo/jmo-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-[11px]"
            >
              <span>Help & resources</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </aside>
  );
};
