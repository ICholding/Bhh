import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message }) {
  const isBot = message.role === 'bot';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/6585f39cc_chat_avatar_48.png"
          alt="BHH Bot"
          className="w-8 h-8 rounded-lg flex-shrink-0"
        />
      )}
      
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
        isBot 
          ? 'bg-white shadow-sm border border-gray-100 rounded-bl-md' 
          : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-br-md'
      }`}>
        <p className={`text-sm leading-relaxed ${isBot ? 'text-gray-800' : 'text-white'}`}>
          {message.content}
        </p>
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </motion.div>
  );
}