import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PortalCard({ 
  icon: Icon, 
  title, 
  description, 
  to,
  variant = 'default',
  onClick
}) {
  const baseClasses = "block w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 active:scale-[0.98]";
  
  const content = (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
        variant === 'primary' 
          ? 'bg-gradient-to-br from-blue-500 to-teal-500 text-white' 
          : 'bg-blue-50 text-blue-600'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5 truncate">{description}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </div>
  );

  if (onClick) {
    return (
      <button className={baseClasses} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to} className={baseClasses}>
      {content}
    </Link>
  );
}