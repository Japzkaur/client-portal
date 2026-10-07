import React, { useState, useEffect } from 'react';
import { ClientInquiry } from '../types/inquiry';
import { fetchInquiryFromApi, postMessageToApi } from '../services/api';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Send, 
  Copy, 
  Check, 
  FileText, 
  Calendar, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface StatusTrackerProps {
  initialTicketId?: string;
  isDarkMode: boolean;
  onNavigateToForm: () => void;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  initialTicketId,
  isDarkMode,
  onNavigateToForm,
}) => {
  const [searchInput, setSearchInput] = useState(initialTicketId || '');
  const [activeInquiry, setActiveInquiry] = useState<ClientInquiry | null>(null);
  const [searchError, setSearchError] = useState('');
  const [copied, setCopied] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const performSearch = async (ticketId: string) => {
    setSearchError('');
    if (!ticketId.trim()) {
      setSearchError('Please enter a ticket reference ID (e.g. TKT-2026-4821)');
      return;
    }

    const found = await fetchInquiryFromApi(ticketId.trim());
    if (found) {
      setActiveInquiry(found);
    } else {
      setSearchError(`No inquiry found matching "${ticketId}". Please check your ticket ID.`);
    }
  };

  useEffect(() => {
    if (initialTicketId) {
      setSearchInput(initialTicketId);
      performSearch(initialTicketId);
    }
  }, [initialTicketId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry || !newMessage.trim()) return;

    setIsSendingMessage(true);
    const updated = await postMessageToApi(activeInquiry.id, newMessage.trim(), activeInquiry.clientName);
    setIsSendingMessage(false);
    if (updated) {
      setActiveInquiry(updated);
      setNewMessage('');
    }
  };

  const cardBg = isDarkMode 
    ? 'bg-stone-900 border-stone-800 text-stone-100 shadow-xl' 
    : 'bg-[#FFFDF9] border-amber-200/80 text-stone-900 shadow-sm';
  const inputBg = isDarkMode
    ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:ring-amber-400'
    : 'bg-[#F5F1E8]/70 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:ring-amber-500 focus:bg-[#FFFDF9]';
  const subtext = isDarkMode ? 'text-stone-400' : 'text-stone-600';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
      
      {/* Tracker Search Header */}
      <div className="mb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Real-Time Progress Tracking
        </span>
        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
          Check Project Status
        </h1>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="mt-4 mx-auto max-w-md flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. TKT-2026-4821"
              className={`w-full rounded-lg border pl-10 pr-3.5 py-2 text-xs sm:text-sm font-mono transition-all focus:outline-none focus:ring-1 ${inputBg}`}
            />
          </div>
          <button
            type="submit"
            className="btn-primary-yellow inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs sm:text-sm font-bold text-stone-950 shadow-sm hover:bg-amber-300 transition-all cursor-pointer"
          >
            <span>Track</span>
          </button>
        </form>

        {searchError && (
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-rose-500 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {activeInquiry ? (
        <div className="space-y-4">
          
          {/* Ticket Info Summary Card */}
          <div className={`rounded-xl border p-4 sm:p-5 transition-colors ${cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Tracking Reference
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                    {activeInquiry.id}
                  </span>
                  <button
                    onClick={() => handleCopyTicket(activeInquiry.id)}
                    className="p-1 text-stone-400 hover:text-amber-600 transition-colors"
                    title="Copy Ticket Reference"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/50">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span>{activeInquiry.serviceType}</span>
                </span>
              </div>
            </div>

            {/* Step Milestones Progress Track (Compact & Engaging) */}
            <div className="mt-6 pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Milestone Progress
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/50">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>
                    Stage {activeInquiry.steps.findIndex(s => s.current) >= 0 ? activeInquiry.steps.findIndex(s => s.current) + 1 : 1} of {activeInquiry.steps.length}
                  </span>
                </span>
              </div>

              {/* Horizontal Stepper Track */}
              <div className="relative pt-1 pb-2">
                {/* Connecting track line passing exactly through the vertical center of the step circles */}
                <div className="absolute top-[14px] sm:top-[16px] left-[14px] right-[14px] sm:left-[16px] sm:right-[16px] -translate-y-1/2 h-1 bg-stone-200 dark:bg-stone-800 rounded-full z-0 overflow-hidden pointer-events-none">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${(() => {
                        const curIdx = activeInquiry.steps.findIndex(s => s.current);
                        const completedIdx = activeInquiry.steps.reduce((acc, s, idx) => s.completed ? idx : acc, -1);
                        const activeIndex = curIdx >= 0 ? curIdx : (completedIdx >= 0 ? completedIdx : 0);
                        return activeInquiry.steps.length > 1 ? Math.min(100, Math.max(0, (activeIndex / (activeInquiry.steps.length - 1)) * 100)) : 0;
                      })()}%`
                    }}
                  />
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  {activeInquiry.steps.map((step, index) => {
                    const isCompleted = step.completed && !step.current;
                    const isCurrent = step.current;

                    return (
                      <div key={step.id} className="flex flex-col items-center text-center w-16 sm:w-24 md:w-28">
                        {/* Step Node */}
                        <div className={`relative z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-200 shrink-0 ${
                          isCompleted
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                            : isCurrent
                              ? 'border-2 border-amber-500 bg-[#FFFDF9] dark:bg-stone-900 text-amber-600 dark:text-amber-400 font-bold shadow-md shadow-amber-500/25 ring-4 ring-amber-400/25 scale-105'
                              : isDarkMode
                                ? 'border-2 border-stone-700 bg-stone-800 text-stone-400'
                                : 'border-2 border-stone-300 bg-stone-100 text-stone-500'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          ) : (
                            <span className="text-[11px] font-bold">{index + 1}</span>
                          )}
                        </div>

                        {/* Step Label */}
                        <span className={`text-[10px] sm:text-xs font-semibold mt-1.5 transition-colors line-clamp-2 leading-tight text-center px-0.5 ${
                          isCurrent 
                            ? 'text-amber-600 dark:text-amber-400 font-bold' 
                            : isCompleted 
                              ? (isDarkMode ? 'text-stone-300' : 'text-stone-700')
                              : (isDarkMode ? 'text-stone-400' : 'text-stone-500')
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section (Compact & Streamlined) */}
          <div className={`rounded-xl border p-4 sm:p-5 transition-colors ${cardBg}`}>
            <div className="flex items-center justify-between mb-3 border-b border-amber-200/60 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>Inquiry Specifications</span>
              </h3>
              <span className="text-[11px] font-semibold text-stone-500">
                Service: <span className="text-amber-600 dark:text-amber-400 font-bold">{activeInquiry.serviceType}</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Project Description:
                </span>
                <p className={`leading-relaxed p-2.5 sm:p-3 rounded-lg border text-xs ${
                  isDarkMode ? 'border-stone-800 bg-stone-950 text-stone-200' : 'border-amber-200/70 bg-[#F5F1E8] text-stone-800'
                }`}>
                  {activeInquiry.projectDetails}
                </p>
              </div>

              {activeInquiry.specificQuestions && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Specific Questions:
                  </span>
                  <p className={`leading-relaxed p-2.5 sm:p-3 rounded-lg border text-xs ${
                    isDarkMode ? 'border-stone-800 bg-stone-950 text-stone-200' : 'border-amber-200/70 bg-[#F5F1E8] text-stone-800'
                  }`}>
                    {activeInquiry.specificQuestions}
                  </p>
                </div>
              )}

              {activeInquiry.attachments.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
                    Files ({activeInquiry.attachments.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeInquiry.attachments.map(att => (
                      <span
                        key={att.id}
                        className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md border text-[11px] font-medium ${
                          isDarkMode ? 'border-stone-800 bg-stone-950 text-stone-300' : 'border-amber-200/80 bg-[#F5F1E8] text-stone-700'
                        }`}
                      >
                        <FileText className="h-3 w-3 text-amber-500 dark:text-amber-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{att.name}</span>
                        <span className="text-stone-400 text-[10px]">({att.size})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Communication Timeline & Direct Reply */}
          <div className={`rounded-xl border p-4 sm:p-5 transition-colors ${cardBg}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5" />
              <span>Project Communication History</span>
            </h3>

            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
              {activeInquiry.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg border text-xs leading-relaxed ${
                    msg.sender === 'support'
                      ? isDarkMode ? 'border-amber-900/40 bg-amber-950/20 text-stone-200' : 'border-amber-200 bg-amber-50/60 text-stone-800'
                      : isDarkMode ? 'border-stone-800 bg-stone-950 text-stone-200' : 'border-stone-200 bg-[#F5F1E8] text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className={`font-bold ${msg.sender === 'support' ? 'text-amber-600 dark:text-amber-400' : 'text-stone-500'}`}>
                      {msg.senderName}
                    </span>
                    <span className="text-stone-400 text-[10px]">{msg.timestamp}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a follow-up question or note for the engineering desk..."
                className={`flex-1 rounded-lg border px-3 py-2 text-xs transition-all ${inputBg}`}
              />
              <button
                type="submit"
                disabled={isSendingMessage || !newMessage.trim()}
                className="btn-primary-yellow inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-stone-950 shadow-sm hover:bg-amber-300 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

        </div>
      ) : (
        <div className={`rounded-xl border p-10 text-center transition-colors ${cardBg}`}>
          <Search className="h-8 w-8 text-stone-400 mx-auto mb-2" />
          <h2 className="text-sm font-bold">No Inquiry Record Selected</h2>
          <p className={`text-xs mt-1 max-w-sm mx-auto ${subtext}`}>
            Enter your ticket reference above or submit a new inquiry form to receive a ticket.
          </p>
          <button
            onClick={onNavigateToForm}
            className="btn-primary-yellow mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-stone-950 shadow-sm hover:bg-amber-300 transition-all cursor-pointer"
          >
            <span>Submit a New Inquiry</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
