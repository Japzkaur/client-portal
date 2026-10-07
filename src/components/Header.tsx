import React from 'react';
import { Send, Search, Sun, Moon, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: 'enquire' | 'status';
  onSelectTab: (tab: 'enquire' | 'status') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
      isDarkMode 
        ? 'border-stone-800 bg-stone-950/95 text-white backdrop-blur-md' 
        : 'border-amber-200/60 bg-[#FBF9F4]/95 text-stone-900 shadow-xs backdrop-blur-md'
    }`}>
      <div className="mx-auto flex h-13 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand / Title */}
        <div 
          onClick={() => onSelectTab('enquire')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isDarkMode ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-amber-400 text-stone-950 shadow-sm font-bold'
          }`}>
            <Shield className="h-4 w-4 text-stone-950" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-amber-600 dark:text-amber-400">
              CLIENT PORTAL
            </span>
          </div>
        </div>

        {/* Client Only Tabs: Enquire Form & Ticket Status */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onSelectTab('enquire')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'enquire'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : isDarkMode
                  ? 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  : 'text-stone-600 hover:bg-amber-100/70 hover:text-amber-900'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Enquire</span>
          </button>

          <button
            onClick={() => onSelectTab('status')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : isDarkMode
                  ? 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  : 'text-stone-600 hover:bg-amber-100/70 hover:text-amber-900'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Track Status</span>
          </button>
        </nav>

        {/* Night / Day Mode Toggle (Icon only) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
              isDarkMode
                ? 'border-stone-800 bg-stone-900 text-amber-400 hover:bg-stone-800 hover:text-amber-300'
                : 'border-amber-200 bg-[#F5F1E8] text-amber-700 hover:bg-amber-100 hover:text-amber-900'
            }`}
            title={isDarkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            aria-label={isDarkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
