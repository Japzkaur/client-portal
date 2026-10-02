import { ClientInquiry, InquiryFormData } from '../types/inquiry';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
const LOCAL_STORAGE_KEY = 'portal_client_inquiries_local_cache';

// Helper to get cached inquiries
function getCached(): ClientInquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCached(item: ClientInquiry) {
  try {
    const current = getCached().filter(i => i.id !== item.id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([item, ...current]));
  } catch (e) {
    console.error(e);
  }
}

export async function submitInquiryToApi(data: InquiryFormData): Promise<ClientInquiry> {
  try {
    const response = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const res = await response.json();
      if (res.inquiry) {
        saveCached(res.inquiry);
        return res.inquiry;
      }
    }
  } catch (err) {
    console.warn('Backend API at port 5000 unreachable, using client offline mode:', err);
  }

  // Offline fallback if backend server isn't running yet
  const year = new Date().getFullYear();
  const ticketId = `TKT-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const fallbackInquiry: ClientInquiry = {
    id: ticketId,
    createdAt: now.toISOString(),
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    companyName: data.companyName,
    phone: data.phone,
    serviceType: data.serviceType,
    projectDetails: data.projectDetails,
    specificQuestions: data.specificQuestions,
    status: 'in_review',
    estimatedResponseTime: 'Within 24 Hours',
    attachments: data.attachments,
    steps: [
      { id: 's1', title: 'Inquiry Received', description: 'Your brief was registered securely.', timestamp: formattedTime, completed: true, current: false },
      { id: 's2', title: 'Under Review', description: 'Solutions architect reviewing requirements.', timestamp: 'In Progress', completed: true, current: true },
      { id: 's3', title: 'Proposal & Scope Preparation', description: 'Timeline and cost estimate.', completed: false, current: false },
      { id: 's4', title: 'Project Kickoff & Active Work', description: 'Agreement sign-off & sprint kickoff.', completed: false, current: false },
      { id: 's5', title: 'Project Delivery & Completed', description: 'Final handover.', completed: false, current: false }
    ],
    messages: [
      { id: `msg-${Date.now()}`, sender: 'support', senderName: 'Client Advisory Desk', text: 'Inquiry registered. Route to backend server.', timestamp: 'Just now' }
    ]
  };

  saveCached(fallbackInquiry);
  return fallbackInquiry;
}

export async function fetchInquiryFromApi(ticketId: string): Promise<ClientInquiry | null> {
  try {
    const response = await fetch(`${API_BASE}/inquiries/${ticketId}`);
    if (response.ok) {
      const res = await response.json();
      if (res.inquiry) {
        saveCached(res.inquiry);
        return res.inquiry;
      }
    }
  } catch (err) {
    console.warn('Backend API at port 5000 unreachable, checking local cache:', err);
  }

  // Look in cached
  const cached = getCached().find(i => i.id.toUpperCase() === ticketId.toUpperCase());
  return cached || null;
}

export async function postMessageToApi(ticketId: string, text: string, clientName: string): Promise<ClientInquiry | null> {
  try {
    const response = await fetch(`${API_BASE}/inquiries/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: 'client', senderName: clientName, text }),
    });

    if (response.ok) {
      const res = await response.json();
      if (res.inquiry) {
        saveCached(res.inquiry);
        return res.inquiry;
      }
    }
  } catch (err) {
    console.warn('Backend API offline, updating local cache:', err);
  }

  const cached = getCached().find(i => i.id.toUpperCase() === ticketId.toUpperCase());
  if (cached) {
    cached.messages.push({
      id: `msg-${Date.now()}`,
      sender: 'client',
      senderName: clientName,
      text,
      timestamp: 'Just now'
    });
    saveCached(cached);
    return cached;
  }
  return null;
}
