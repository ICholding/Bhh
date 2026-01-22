import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

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
        <div className={`text-sm leading-relaxed ${isBot ? 'text-gray-800' : 'text-white'} prose prose-sm max-w-none ${!isBot && 'prose-invert'}`}>
          <ReactMarkdown
            components={{
              // Customize rendering to avoid security issues
              a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" />,
              code: ({ node, inline, ...props }) => 
                inline 
                  ? <code {...props} className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs" />
                  : <code {...props} className="block bg-gray-100 text-gray-800 p-2 rounded-lg text-xs overflow-x-auto" />,
              p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
              ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside mb-2" />,
              ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside mb-2" />,
              strong: ({ node, ...props }) => <strong {...props} className="font-semibold" />,
              em: ({ node, ...props }) => <em {...props} className="italic" />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </motion.div>
  );
}