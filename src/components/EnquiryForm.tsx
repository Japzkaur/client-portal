import React, { useState, useRef } from 'react';
import { InquiryFormData, ClientInquiry } from '../types/inquiry';
import { submitInquiryToApi } from '../services/api';
import { 
  Building2, 
  Send, 
  Upload, 
  FileText, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone 
} from 'lucide-react';

interface EnquiryFormProps {
  isDarkMode: boolean;
  onInquirySubmitted: (inquiry: ClientInquiry) => void;
}

const SERVICE_OPTIONS = [
  'Web & Cloud Architecture',
  'AI & Machine Learning Solutions',
  'Mobile Application Development (iOS & Android)',
  'Cybersecurity & Infrastructure Auditing',
  'UI/UX Engineering & Product Design',
  'Custom Enterprise Software Systems'
];

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  isDarkMode,
  onInquirySubmitted,
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    clientName: '',
    clientEmail: '',
    companyName: '',
    phone: '',
    serviceType: SERVICE_OPTIONS[0],
    projectDetails: '',
    specificQuestions: '',
    attachments: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fillSampleData = () => {
    setFormData({
      clientName: 'Julian Mercer',
      clientEmail: 'j.mercer@apex-logistics.io',
      companyName: 'Apex Global Logistics',
      phone: '+1 (555) 392-8819',
      serviceType: 'Web & Cloud Architecture',
      projectDetails: 'We are architecting a real-time freight telematics dashboard tracking 4,500 active fleet vehicles. System requires Kafka-compatible streaming ingestion, sub-second latency analytics, and role-based access for operations dispatchers.',
      specificQuestions: 'Can you provide architectural guidance on multi-region AWS vs GCP failover strategies?',
      attachments: [
        { id: 'sample-doc-1', name: 'apex-telematics-scope.pdf', size: '1.8 MB' },
        { id: 'sample-doc-2', name: 'data-schema-v2.docx', size: '640 KB' }
      ]
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof InquiryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newAttachments = files.map((f, i) => ({
      id: `att-${Date.now()}-${i}`,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + ' MB'
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== id)
    }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof InquiryFormData, string>> = {};
    if (!formData.clientName.trim()) errs.clientName = 'Please enter your full name';
    if (!formData.clientEmail.trim()) {
      errs.clientEmail = 'Please provide a valid work email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      errs.clientEmail = 'Invalid email address format';
    }
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.projectDetails.trim()) {
      errs.projectDetails = 'Please provide project specifications';
    } else if (formData.projectDetails.trim().length < 20) {
      errs.projectDetails = 'Project details must be at least 20 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = await submitInquiryToApi(formData);
      setIsSubmitting(false);
      onInquirySubmitted(created);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  const cardBg = isDarkMode 
    ? 'bg-stone-900 border-stone-800 text-stone-100 shadow-xl' 
    : 'bg-[#FFFDF9] border-amber-200/80 text-stone-900 shadow-sm';
  const inputBg = isDarkMode
    ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:ring-amber-400'
    : 'bg-[#F5F1E8]/70 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:ring-amber-500 focus:bg-[#FFFDF9]';
  const labelColor = isDarkMode ? 'text-stone-300' : 'text-stone-700';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
      
      {/* Title & Top Description */}
      <div className="mb-6 border-b border-amber-200/60 pb-5 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Client Inquiry Form
          </span>
          <button
            type="button"
            onClick={fillSampleData}
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
              isDarkMode 
                ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60' 
                : 'text-stone-500 hover:text-stone-700 hover:bg-amber-100/70'
            }`}
            title="Pre-fill form with realistic project details for testing"
          >
            <Sparkles className="h-3 w-3 opacity-75 text-amber-500" />
            <span>Sample data</span>
          </button>
        </div>
        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
          Submit Your Project Details
        </h1>
      </div>

      {/* Main Clean Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        
        {/* Combined Unified Details & Project Scope Card (Compact) */}
        <div className={`rounded-xl border p-4 sm:p-6 transition-colors duration-200 ${cardBg}`}>
          
          {/* Section 1: Contact Information */}
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-wide text-amber-600 dark:text-amber-400 mb-3.5 flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>1. Contact & Company Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Client Name */}
              <div>
                <label htmlFor="clientName" className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${labelColor}`}>
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="clientName"
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className={`w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-1 ${inputBg} ${
                      errors.clientName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
                    }`}
                  />
                </div>
                {errors.clientName && (
                  <p className="mt-1 text-xs text-rose-500">{errors.clientName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="clientEmail" className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${labelColor}`}>
                  Work Email <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="e.g. s.jenkins@company.com"
                    className={`w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-1 ${inputBg} ${
                      errors.clientEmail ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
                    }`}
                  />
                </div>
                {errors.clientEmail && (
                  <p className="mt-1 text-xs text-rose-500">{errors.clientEmail}</p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${labelColor}`}>
                  Company or Organization <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className={`w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-1 ${inputBg} ${
                      errors.companyName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
                    }`}
                  />
                </div>
                {errors.companyName && (
                  <p className="mt-1 text-xs text-rose-500">{errors.companyName}</p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div>
                <label htmlFor="phone" className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${labelColor}`}>
                  Phone Number <span className="text-stone-400 lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g. +1 (555) 123-4567"
                    className={`w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-1 ${inputBg}`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section Divider */}
          <div className="border-t my-4 sm:my-5 border-amber-200/60 dark:border-stone-800" />

          {/* Section 2: Project Scope & Questions */}
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-wide text-amber-600 dark:text-amber-400 mb-3.5 flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>2. Project Requirements & Questions</span>
            </h2>

            <div className="space-y-3.5">
              
              {/* Service Type Selector */}
              <div>
                <label htmlFor="serviceType" className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${labelColor}`}>
                  Service Category <span className="text-amber-500">*</span>
                </label>
                <select
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-xs sm:text-sm transition-all focus:outline-none focus:ring-1 ${inputBg}`}
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className={isDarkMode ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Details */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="projectDetails" className={`text-[11px] font-semibold uppercase tracking-wider ${labelColor}`}>
                    Project Description & Requirements <span className="text-amber-500">*</span>
                  </label>
                  <span className={`text-[11px] ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                    {formData.projectDetails.length} chars (min 20)
                  </span>
                </div>
                <textarea
                  id="projectDetails"
                  rows={3}
                  value={formData.projectDetails}
                  onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                  placeholder="Describe your project goals, scope, key features, and timeline expectations..."
                  className={`w-full rounded-lg border p-2.5 sm:p-3 text-xs sm:text-sm leading-relaxed transition-all focus:outline-none focus:ring-1 ${inputBg} ${
                    errors.projectDetails ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
                  }`}
                />
                {errors.projectDetails && (
                  <p className="mt-1 text-xs text-rose-500">{errors.projectDetails}</p>
                )}
              </div>

              {/* Specific Questions */}
              <div>
                <label htmlFor="specificQuestions" className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${labelColor}`}>
                  Specific Questions for Our Team <span className="text-stone-400 lowercase">(optional)</span>
                </label>
                <textarea
                  id="specificQuestions"
                  rows={2}
                  value={formData.specificQuestions}
                  onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                  placeholder="Any questions about timelines, team availability, technology stack, or budgeting?"
                  className={`w-full rounded-lg border p-2.5 text-xs sm:text-sm leading-relaxed transition-all focus:outline-none focus:ring-1 ${inputBg}`}
                />
              </div>

              {/* Attachments */}
              <div>
                <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${labelColor}`}>
                  Attach Supporting Documents <span className="text-stone-400 lowercase">(optional)</span>
                </label>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-3 sm:p-4 text-center transition-all ${
                    isDarkMode
                      ? 'border-stone-700 bg-stone-950/60 hover:border-amber-400 hover:bg-stone-950'
                      : 'border-amber-300 bg-[#F5F1E8]/50 hover:border-amber-500 hover:bg-amber-50/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.xlsx,.txt,.png,.jpg,.jpeg,.zip"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-5 w-5 text-amber-500 mb-1" />
                    <p className={`text-xs font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                      Click to browse files or drag & drop here
                    </p>
                    <p className={`text-[10px] sm:text-[11px] mt-0.5 ${isDarkMode ? 'text-stone-500' : 'text-stone-500'}`}>
                      PDF, DOCX, XLSX, Images, or ZIP (up to 25MB)
                    </p>
                  </div>
                </div>

                {/* Uploaded items list */}
                {formData.attachments.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {formData.attachments.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs ${
                          isDarkMode ? 'border-stone-800 bg-stone-950 text-stone-200' : 'border-amber-200 bg-[#F5F1E8] text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span className="font-medium truncate">{file.name}</span>
                          <span className={isDarkMode ? 'text-stone-500' : 'text-stone-500'}>({file.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(file.id)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-0.5"
                          title="Remove file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            <span>Secure 256-bit inquiry intake & instant ticket receipt</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto btn-primary-yellow inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-stone-950 shadow-sm hover:bg-amber-300 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                <span>Processing Inquiry...</span>
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Inquiry & Generate Ticket</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
