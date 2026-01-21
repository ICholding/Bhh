import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Send, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

export default function ChatWindow({ conversation, currentUserId, currentUserName, currentUserRole }) {
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: messages = [], refetch } = useQuery({
    queryKey: ['messages', conversation?.id],
    queryFn: () => base44.entities.Message.filter({ conversation_id: conversation.id }, 'created_date'),
    enabled: !!conversation?.id
  });

  useEffect(() => {
    if (!conversation?.id) return;

    // Real-time message updates
    const unsubscribe = base44.entities.Message.subscribe((event) => {
      if (event.data?.conversation_id === conversation.id) {
        refetch();
      }
    });

    return unsubscribe;
  }, [conversation?.id, refetch]);

  useEffect(() => {
    // Mark messages as read
    if (messages.length > 0 && conversation?.id) {
      messages.forEach(msg => {
        if (msg.sender_id !== currentUserId && !msg.read_by?.includes(currentUserId)) {
          base44.entities.Message.update(msg.id, {
            read_by: [...(msg.read_by || []), currentUserId]
          });
        }
      });

      // Update conversation unread count
      const unreadCount = { ...(conversation.unread_count || {}) };
      unreadCount[currentUserId] = 0;
      base44.entities.Conversation.update(conversation.id, { unread_count: unreadCount });
    }
  }, [messages, conversation?.id, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Message.create(data);
      
      // Update conversation last message
      const unreadCount = { ...(conversation.unread_count || {}) };
      conversation.participants?.forEach(p => {
        if (p.user_id !== currentUserId) {
          unreadCount[p.user_id] = (unreadCount[p.user_id] || 0) + 1;
        }
      });

      await base44.entities.Conversation.update(conversation.id, {
        last_message: data.content,
        last_message_time: new Date().toISOString(),
        last_message_sender: currentUserName,
        unread_count: unreadCount
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversation?.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setMessageText('');
      setIsUrgent(false);
    }
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !conversation) return;

    sendMessageMutation.mutate({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_role: currentUserRole,
      content: messageText.trim(),
      message_type: isUrgent ? 'urgent' : 'text',
      is_urgent: isUrgent,
      read_by: [currentUserId]
    });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="font-semibold text-gray-900">
          {conversation.title || conversation.participants?.find(p => p.user_id !== currentUserId)?.name || 'Conversation'}
        </h2>
        {conversation.conversation_type === 'job_notification' && (
          <p className="text-xs text-gray-500 mt-1">Job Updates & Notifications</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === currentUserId;
          const isSystem = message.message_type === 'system';

          if (isSystem) {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-gray-100 rounded-lg px-3 py-1 text-xs text-gray-600">
                  {message.content}
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                {!isOwnMessage && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="text-xs text-gray-600">{message.sender_name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      message.sender_role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      message.sender_role === 'worker' ? 'bg-teal-100 text-teal-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {message.sender_role}
                    </span>
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2 ${
                  isOwnMessage 
                    ? 'bg-teal-600 text-white' 
                    : message.is_urgent 
                      ? 'bg-red-50 border-2 border-red-500 text-gray-900'
                      : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.is_urgent && !isOwnMessage && (
                    <div className="flex items-center gap-1 text-red-600 text-xs font-semibold mb-1">
                      <AlertCircle className="w-3 h-3" />
                      URGENT
                    </div>
                  )}
                  <p className="text-sm break-words">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  {format(new Date(message.created_date), 'h:mm a')}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Checkbox
            id="urgent"
            checked={isUrgent}
            onCheckedChange={setIsUrgent}
          />
          <label htmlFor="urgent" className="text-sm text-gray-700 cursor-pointer flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            Mark as urgent
          </label>
        </div>
        <div className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!messageText.trim()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}