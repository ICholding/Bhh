import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatShell from '@/components/chat/ChatShell';

export default function EmployeeChat() {
  const navigate = useNavigate();

  const quickActions = [
    "Check my schedule",
    "Report an issue",
    "Request time off",
    "Contact supervisor"
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(createPageUrl('EmployeeDashboard'))}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Worker Assistant</h1>
      </header>

      {/* Chat */}
      <div className="flex-1">
        <ChatShell
          botName="BHH Worker Assistant"
          botDescription="Here to help with your daily tasks"
          quickActions={quickActions}
          initialMessage="Hi! I'm your BHH Worker Assistant. I can help you with your schedule, report issues, or answer questions about your assignments. How can I assist you today?"
          portal="worker"
        />
      </div>
    </div>
  );
}