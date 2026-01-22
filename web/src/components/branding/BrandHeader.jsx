import React from 'react';
import BrandLogo from './BrandLogo';

export default function BrandHeader({ children, className = '' }) {
  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <BrandLogo size="md" />
        {children}
      </div>
    </header>
  );
}
