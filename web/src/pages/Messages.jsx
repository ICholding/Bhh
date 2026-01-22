import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopHeader from '@/components/branding/TopHeader';
import DirectMessageList from '@/components/chat/DirectMessageList';
import ChatWindow from '@/components/chat/ChatWindow';
import NewConversationModal from '@/components/chat/NewConversationModal';

export default function Messages() {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewConversation, setShowNewConversation] = useState(false);

  // In production, get from auth
  const currentUser = {
    id: 'user123',
    name: 'Current User',
    role: 'worker' // or 'client'
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopHeader 
        showBack 
        onBack={() => navigate(createPageUrl('EmployeeDashboard'))}
        title="Messages"
        rightAction={
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowNewConversation(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
          <DirectMessageList
            currentUserId={currentUser.id}
            onSelectConversation={setSelectedConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>

        {/* Chat Window */}
        <div className="hidden md:flex md:flex-1">
          <ChatWindow
            conversation={selectedConversation}
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            currentUserRole={currentUser.role}
          />
        </div>
      </div>

      <NewConversationModal
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        currentUserId={currentUser.id}
        currentUserName={currentUser.name}
        currentUserRole={currentUser.role}
      />
    </div>
  );
}