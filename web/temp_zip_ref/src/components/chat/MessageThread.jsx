import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { AlertCircle, Briefcase } from 'lucide-react';

export default function MessageThread({ messages, currentUserRole }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => {
        const isOwnMessage = msg.sender_role === currentUserRole;
        const showDate = index === 0 || 
          new Date(messages[index - 1].created_date).toDateString() !== new Date(msg.created_date).toDateString();

        return (
          <div key={msg.id}>
            {showDate && (
              <div className="text-center my-4">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {format(new Date(msg.created_date), 'MMMM d, yyyy')}
                </span>
              </div>
            )}

            {msg.message_type === 'system' ? (
              <div className="flex justify-center">
                <div className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-lg max-w-md text-center">
                  {msg.content}
                </div>
              </div>
            ) : msg.message_type === 'urgent' ? (
              <div className="flex justify-center">
                <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg max-w-md flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Urgent: {msg.sender_name}</p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            ) : msg.message_type === 'job_update' ? (
              <div className="flex justify-center">
                <div className="bg-teal-50 border border-teal-200 text-teal-800 text-sm px-4 py-3 rounded-lg max-w-md flex items-start gap-2">
                  <Briefcase className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Job Update</p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {!isOwnMessage && (
                    <p className="text-xs text-gray-500 mb-1 px-1">{msg.sender_name}</p>
                  )}
                  <div className={`rounded-2xl px-4 py-2 ${
                    isOwnMessage 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-teal-100' : 'text-gray-500'
                    }`}>
                      {format(new Date(msg.created_date), 'h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}