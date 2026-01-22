import React from 'react';
import { Bot } from 'lucide-react';

export default function AgentAvatar({ size = 'md', className = '', agentName = 'AI Assistant' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0 ${className}`}
      title={agentName}
    >
      <Bot className={`${iconSizes[size]} text-white`} />
    </div>
  );
}
