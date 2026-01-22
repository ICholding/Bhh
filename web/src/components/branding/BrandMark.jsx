import React from 'react';

export default function BrandMark({ className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <img 
      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/6585f39cc_chat_avatar_48.png"
      alt="BHH"
      className={`${sizeClasses[size]} rounded-lg ${className}`}
    />
  );
}
