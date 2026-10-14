import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EnquiryForm } from './components/EnquiryForm';
import { StatusTracker } from './components/StatusTracker';
import { TicketReceiptModal } from './components/TicketReceiptModal';
import { Footer } from './components/Footer';
import { ClientInquiry } from './types/inquiry';

export default function App() {
  const [activeTab, setActiveTab] = useState<'enquire' | 'status'>('enquire');
  const [createdInquiry, setCreatedInquiry] = useState<ClientInquiry | null>(null);
  const [trackTicketId, setTrackTicketId] = useState<string | undefined>(undefined);

  // Day / Night mode state (persisted in localStorage)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('portal_theme_mode');
      if (saved) return saved === 'dark';
      return true; // Default to dark mode
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('portal_theme_mode', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleInquirySubmitted = (inquiry: ClientInquiry) => {
    setCreatedInquiry(inquiry);
  };

  const handleProceedToTracking = (ticketId: string) => {
    setCreatedInquiry(null);
    setTrackTicketId(ticketId);
    setActiveTab('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-stone-950 text-stone-100 selection:bg-amber-500/30 selection:text-amber-200' 
        : 'bg-[#FBF9F4] text-stone-900 selection:bg-amber-500/20 selection:text-amber-900'
    }`}>
      
      {/* Yellow & Oat Milk Header with Day/Night toggle */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area: Enquire Form & Ticket Status */}
      <main className="flex-1">
        {activeTab === 'enquire' ? (
          <EnquiryForm
            isDarkMode={isDarkMode}
            onInquirySubmitted={handleInquirySubmitted}
          />
        ) : (
          <StatusTracker
            initialTicketId={trackTicketId}
            isDarkMode={isDarkMode}
            onNavigateToForm={() => setActiveTab('enquire')}
          />
        )}
      </main>

      {/* Modal with generated random ticket number */}
      {createdInquiry && (
        <TicketReceiptModal
          inquiry={createdInquiry}
          isDarkMode={isDarkMode}
          onClose={() => setCreatedInquiry(null)}
          onTrackInquiry={handleProceedToTracking}
        />
      )}

      {/* Simplified clean footer */}
      <Footer
        isDarkMode={isDarkMode}
        onSelectTab={setActiveTab}
      />

    </div>
  );
}
