import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatShell from '@/components/chat/ChatShell';

export default function ChatWorker() {
  const navigate = useNavigate();

  const quickActions = [
    "View assigned jobs",
    "Start a shift",
    "Report arrival",
    "Complete a job"
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(createPageUrl('Portal'))}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Worker AI</h1>
          <p className="text-xs text-gray-500">Job & Shift Assistant</p>
        </div>
        <a 
          href="tel:7708913267"
          className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
        >
          <Phone className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-medium text-teal-600">Support</span>
        </a>
      </header>

      {/* Chat */}
      <div className="flex-1">
        <ChatShell
          botName="BHH Worker AI"
          botDescription="Your shift companion"
          quickActions={quickActions}
          initialMessage="Hello! I'm here to help you manage your assignments and shifts. You can ask me about today's jobs, report your status, or get help with any work-related questions. How can I assist you?"
        />
      </div>
    </div>
  );
}