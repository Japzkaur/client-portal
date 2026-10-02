import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
  onSelectTab: (tab: 'enquire' | 'status') => void;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode, onSelectTab }) => {
  return (
    <footer className={`w-full border-t py-6 px-4 sm:px-6 transition-colors duration-200 ${
      isDarkMode ? 'border-stone-800 bg-stone-950 text-stone-400' : 'border-amber-200/60 bg-[#F5F1E8] text-stone-600'
    }`}>
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-amber-500" />
          <span className="font-bold tracking-tight text-amber-600 dark:text-amber-400">CLIENT PORTAL</span>
          <span className="text-stone-400">•</span>
          <span>Secure Project Intake & Status Tracking</span>
        </div>

        <div className="flex items-center gap-4 font-medium">
          <button
            onClick={() => onSelectTab('enquire')}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            Enquire Form
          </button>
          <button
            onClick={() => onSelectTab('status')}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            Ticket Status
          </button>
        </div>

      </div>
    </footer>
  );
};
