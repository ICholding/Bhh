import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ConversationList from '@/components/chat/ConversationList';
import MessageThread from '@/components/chat/MessageThread';
import MessageInput from '@/components/chat/MessageInput';

export default function AdminMessages() {
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const { data: allMessages = [] } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => base44.entities.Message.list('-created_date')
  });

  // Subscribe to real-time message updates
  useEffect(() => {
    const unsubscribe = base44.entities.Message.subscribe((event) => {
      if (event.type === 'create' && activeConversation) {
        if (event.data.conversation_id === activeConversation) {
          setMessages(prev => [...prev, event.data]);
        }
      }
    });
    return unsubscribe;
  }, [activeConversation]);

  // Group messages by conversation
  const conversations = allMessages.reduce((acc, msg) => {
    if (!acc[msg.conversation_id]) {
      acc[msg.conversation_id] = {
        id: msg.conversation_id,
        participants: [msg.sender_name],
        lastMessage: msg.content,
        lastMessageTime: msg.created_date,
        unreadCount: !msg.is_read ? 1 : 0,
        messages: [msg]
      };
    } else {
      acc[msg.conversation_id].messages.push(msg);
      if (!msg.is_read) acc[msg.conversation_id].unreadCount++;
      if (!acc[msg.conversation_id].participants.includes(msg.sender_name)) {
        acc[msg.conversation_id].participants.push(msg.sender_name);
      }
    }
    return acc;
  }, {});

  const conversationList = Object.values(conversations);

  useEffect(() => {
    if (activeConversation) {
      const conv = conversations[activeConversation];
      setMessages(conv?.messages || []);
    }
  }, [activeConversation, allMessages]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(createPageUrl('AdminDashboard'))}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <ConversationList
          conversations={conversationList}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900">
                {conversations[activeConversation]?.participants.join(', ')}
              </h3>
            </div>
            
            <MessageThread messages={messages} currentUserRole="admin" />
            
            <MessageInput
              conversationId={activeConversation}
              senderRole="admin"
              onSendMessage={() => {}}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}