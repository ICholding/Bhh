import React from 'react';

export default function BrandLogo({ className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/6585f39cc_chat_avatar_48.png"
        alt="Blessed Hope Healthcare"
        className={`${sizeClasses[size]} w-auto`}
      />
      <span className={`font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text ${
        size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : size === 'xl' ? 'text-2xl' : 'text-base'
      }`}>
        Blessed Hope Healthcare
      </span>
    </div>
  );
}
