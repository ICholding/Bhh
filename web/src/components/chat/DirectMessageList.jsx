import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MessageCircle, User, Users, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DirectMessageList({ currentUserId, onSelectConversation, selectedConversationId }) {
  const { data: conversations = [], refetch } = useQuery({
    queryKey: ['conversations', currentUserId],
    queryFn: async () => {
      const allConvos = await base44.entities.Conversation.list('-last_message_time');
      return allConvos.filter(c => 
        c.participants?.some(p => p.user_id === currentUserId)
      );
    }
  });

  useEffect(() => {
    // Real-time updates for conversations
    const unsubscribe = base44.entities.Conversation.subscribe(() => {
      refetch();
    });
    return unsubscribe;
  }, [refetch]);

  const getUnreadCount = (conversation) => {
    return conversation.unread_count?.[currentUserId] || 0;
  };

  const getOtherParticipant = (conversation) => {
    if (conversation.conversation_type === 'direct') {
      return conversation.participants?.find(p => p.user_id !== currentUserId);
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
          <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm">No conversations yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {conversations.map(conversation => {
            const otherParticipant = getOtherParticipant(conversation);
            const unreadCount = getUnreadCount(conversation);
            const isSelected = selectedConversationId === conversation.id;
            const isUrgent = conversation.last_message?.includes('URGENT');

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-teal-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    conversation.conversation_type === 'group' || conversation.conversation_type === 'job_notification'
                      ? 'bg-purple-100'
                      : 'bg-gray-200'
                  }`}>
                    {conversation.conversation_type === 'group' || conversation.conversation_type === 'job_notification' ? (
                      <Users className="w-6 h-6 text-purple-600" />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {conversation.title || otherParticipant?.name || 'Unknown'}
                      </p>
                      {conversation.last_message_time && (
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDistanceToNow(new Date(conversation.last_message_time), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                        {isUrgent && <AlertCircle className="w-3 h-3 inline text-red-500 mr-1" />}
                        {conversation.last_message_sender && `${conversation.last_message_sender}: `}
                        {conversation.last_message || 'No messages yet'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}