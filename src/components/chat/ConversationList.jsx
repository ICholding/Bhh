import React from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ConversationList({ conversations, activeConversation, onSelectConversation }) {
  const getMessageTypeIcon = (type) => {
    if (type === 'urgent') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (type === 'job_update') return <MessageCircle className="w-4 h-4 text-blue-500" />;
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No conversations yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                activeConversation === conv.id ? 'bg-teal-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-gray-900 text-sm truncate flex-1">
                  {conv.participants.join(', ')}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="ml-2 bg-teal-600 text-white text-xs rounded-full px-2 py-0.5">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getMessageTypeIcon(conv.messageType)}
                <p className="text-sm text-gray-600 truncate flex-1">{conv.lastMessage}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(conv.lastMessageTime), 'MMM d, h:mm a')}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}