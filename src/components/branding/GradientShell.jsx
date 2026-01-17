import React from 'react';

export default function GradientShell({ children, variant = 'full' }) {
  if (variant === 'full') {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 relative">
        {/* Layered gradient panels */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-blue-400/40 via-cyan-400/30 to-transparent rounded-t-[40%] transform translate-y-20" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-500/30 via-teal-400/20 to-transparent rounded-t-[50%] transform translate-y-10" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-600/20 to-transparent rounded-t-[60%]" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      {children}
    </div>
  );
}