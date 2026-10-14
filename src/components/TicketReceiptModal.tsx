import React, { useState } from 'react';
import { ClientInquiry } from '../types/inquiry';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  Clock, 
  FileText, 
  Building2, 
  Mail, 
  X 
} from 'lucide-react';

interface TicketReceiptModalProps {
  inquiry: ClientInquiry;
  isDarkMode: boolean;
  onClose: () => void;
  onTrackInquiry: (ticketId: string) => void;
}

export const TicketReceiptModal: React.FC<TicketReceiptModalProps> = ({
  inquiry,
  isDarkMode,
  onClose,
  onTrackInquiry,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(inquiry.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardBg = isDarkMode 
    ? 'bg-stone-900 border-stone-800 text-stone-100 shadow-2xl' 
    : 'bg-[#FFFDF9] border-amber-200/90 text-stone-900 shadow-2xl';
  const subtext = isDarkMode ? 'text-stone-400' : 'text-stone-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 sm:p-7 transition-all ${cardBg}`}>
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20 mb-3 font-bold">
            <CheckCircle2 className="h-6 w-6 text-stone-950" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Inquiry Registered
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-0.5">
            Your Tracking Ticket is Ready
          </h2>
          <p className={`text-xs mt-1 max-w-sm ${subtext}`}>
            Save your ticket reference. You can use it anytime to check status updates and communicate with our engineering desk.
          </p>
        </div>

        {/* Ticket Box */}
        <div className={`mt-5 p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'border-amber-900/60 bg-amber-950/30' : 'border-amber-300 bg-amber-100/60'
        }`}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Reference Ticket ID
            </span>
            <span className="font-mono text-lg font-bold text-amber-700 dark:text-amber-300">
              {inquiry.id}
            </span>
          </div>

          <button
            onClick={handleCopyTicket}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              copied
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                : isDarkMode
                  ? 'border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700'
                  : 'border-amber-300 bg-[#FFFDF9] text-stone-700 hover:bg-amber-100/70'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-amber-600" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Inquiry Brief Summary */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-dashed border-amber-200/60 dark:border-stone-800">
            <span className="text-stone-400">Service:</span>
            <span className="font-semibold text-amber-700 dark:text-amber-300">{inquiry.serviceType}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-dashed border-amber-200/60 dark:border-stone-800">
            <span className="text-stone-400">Client / Company:</span>
            <span className="font-medium">{inquiry.clientName} ({inquiry.companyName})</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-stone-400">Estimated Response:</span>
            <span className="font-medium text-emerald-600">{inquiry.estimatedResponseTime}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => onTrackInquiry(inquiry.id)}
            className="w-full btn-primary-yellow inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-sm hover:bg-amber-300 transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Track This Ticket Now</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-amber-200/80 bg-[#FFFDF9] dark:border-stone-700 dark:bg-stone-800 px-4 py-2.5 text-xs font-semibold hover:bg-amber-100/60 dark:hover:bg-stone-700 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
