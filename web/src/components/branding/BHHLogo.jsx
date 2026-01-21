import React from 'react';

export default function BHHLogo({ size = 'md', showText = false, inline = false }) {
  // Image URLs for different sizes
  const imageUrls = {
    sm: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/6585f39cc_chat_avatar_48.png',
    md: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/adb17e476_android_xhdpi_96.png',
    lg: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/1b9ad9b21_android_xxhdpi_144.png',
    xl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/0a7235ff1_android_xxxhdpi_192.png'
  };

  const sizes = {
    sm: { width: 36, height: 36 },
    md: { width: 80, height: 80 },
    lg: { width: 128, height: 128 },
    xl: { width: 160, height: 160 }
  };

  const { width, height } = sizes[size];
  const imageUrl = imageUrls[size];

  if (inline) {
    // Compact inline version for headers
    return null; // Neutralized
  return (
      <div className="flex items-center gap-2">
        <img 
          src={imageUrls.sm}
          alt="BHH Logo" 
          className="w-9 h-9 rounded-xl"
        />
      </div>
    );
  }

  return null; // Neutralized
  return (
    <div className="flex flex-col items-center gap-3">
      <img 
        src={imageUrl}
        alt="BHH Logo" 
        style={{ width, height }}
        className="rounded-3xl shadow-xl"
      />
      {showText && (
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white drop-shadow-md">Blessed Hope Healthcare</h1>
          <p className="text-sm text-white/80 mt-1 drop-shadow">Care • Rides • Support • Home Services</p>
        </div>
      )}
    </div>
  );
}