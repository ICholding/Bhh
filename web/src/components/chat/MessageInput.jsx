import React, { useState } from 'react';
import { Send, Paperclip, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function MessageInput({ conversationId, senderRole, onSendMessage }) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('direct');

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.Message.create({
        ...data,
        sender_id: user.id,
        sender_name: user.full_name,
        sender_role: senderRole,
        conversation_id: conversationId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      queryClient.invalidateQueries({ queryKey: ['worker-messages'] });
      queryClient.invalidateQueries({ queryKey: ['client-messages'] });
      setMessage('');
      setMessageType('direct');
      onSendMessage();
    }
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate({
        content: message,
        message_type: messageType
      });
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {senderRole === 'admin' && (
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setMessageType('direct')}
            className={`text-xs px-3 py-1 rounded-full ${
              messageType === 'direct' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setMessageType('job_update')}
            className={`text-xs px-3 py-1 rounded-full ${
              messageType === 'job_update' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Job Update
          </button>
          <button
            onClick={() => setMessageType('urgent')}
            className={`text-xs px-3 py-1 rounded-full ${
              messageType === 'urgent' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Urgent
          </button>
        </div>
      )}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon">
          <Paperclip className="w-5 h-5 text-gray-400" />
        </Button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim()}
          className="rounded-full bg-teal-600 hover:bg-teal-700"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}