import React from 'react';
import { brandConfig } from '../../config/brand';

export default function BHHLogo({ size = 'md', showText = false, inline = false }) {
  const imageUrls = brandConfig.logos;

  const sizes = {
    sm: { width: 36, height: 36 },
    md: { width: 80, height: 80 },
    lg: { width: 128, height: 128 },
    xl: { width: 160, height: 160 }
  };

  const { width, height } = sizes[size] || sizes.md;
  const imageUrl = imageUrls[size] || imageUrls.md;

  if (inline) {
    return (
      <div className="flex items-center gap-2">
        <img 
          src={imageUrls.sm}
          alt={brandConfig.appName} 
          className="w-9 h-9 rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <img 
        src={imageUrl}
        alt={brandConfig.appName} 
        style={{ width, height }}
        className="rounded-3xl shadow-xl"
      />
      {showText && (
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white drop-shadow-md">{brandConfig.appName}</h1>
          <p className="text-sm text-white/80 mt-1 drop-shadow">{brandConfig.tagline}</p>
        </div>
      )}
    </div>
  );
}
