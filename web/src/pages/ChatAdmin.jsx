import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatShell from '@/components/chat/ChatShell';

export default function ChatAdmin() {
  const navigate = useNavigate();

  const quickActions = [
    "New requests overview",
    "Staffing gaps",
    "Approve worker",
    "Client issues"
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
          <h1 className="text-lg font-semibold text-gray-900">Admin AI</h1>
          <p className="text-xs text-gray-500">Operations Assistant</p>
        </div>
        <a 
          href="tel:7708913267"
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Phone className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-600">Support</span>
        </a>
      </header>

      {/* Chat */}
      <div className="flex-1">
        <ChatShell
          botName="BHH Admin AI"
          botDescription="Your operations command center"
          quickActions={quickActions}
          initialMessage="Hello Admin! I'm your operations assistant. I can help you with analytics, staff management, approvals, and operational insights. What would you like to know?"
        />
      </div>
    </div>
  );
}