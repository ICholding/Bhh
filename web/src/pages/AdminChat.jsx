import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatShell from '@/components/chat/ChatShell';

export default function AdminChat() {
  const navigate = useNavigate();

  const quickActions = [
    "Show today's stats",
    "Pending service requests",
    "Employee availability",
    "Generate report"
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(createPageUrl('AdminDashboard'))}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Operations Assistant</h1>
      </header>

      {/* Chat */}
      <div className="flex-1">
        <ChatShell
          botName="BHH Ops Assistant"
          botDescription="Your operations command center"
          quickActions={quickActions}
          initialMessage="Hello! I'm your BHH Operations Assistant. I can help you with analytics, scheduling, staff management, and operational insights. What would you like to know?"
          portal="admin"
        />
      </div>
    </div>
  );
}