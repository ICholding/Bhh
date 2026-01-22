import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatShell from '@/components/chat/ChatShell';

export default function CustomerChat() {
  const navigate = useNavigate();

  const quickActions = [
    "Book a service",
    "Check my schedule",
    "Upload document",
    "Contact support"
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(createPageUrl('ServicePortal'))}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Care Assistant</h1>
      </header>

      {/* Chat */}
      <div className="flex-1">
        <ChatShell
          botName="BHH Care Assistant"
          botDescription="Here to help you 24/7"
          quickActions={quickActions}
          initialMessage="Hello! I'm your BHH Care Assistant. I can help you book services, check your appointments, answer questions, or connect you with our care team. How can I help you today?"
          portal="customer"
        />
      </div>
    </div>
  );
}