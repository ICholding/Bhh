import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import BHHLogo from './BHHLogo';

export default function TopHeader({ 
  showBack = false, 
  onBack,
  title,
  variant = 'light',
  rightAction
}) {
  const isLight = variant === 'light';
  
  return (
    <header className={`sticky top-0 z-40 px-4 py-3 flex items-center justify-between ${
      isLight ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="flex items-center gap-3">
        {showBack ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className={isLight ? 'text-gray-700' : 'text-white'}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Link to={createPageUrl('Landing')} className="flex items-center">
            <BHHLogo size="sm" inline />
          </Link>
        )}
        {title && (
          <span className={`font-medium ${isLight ? 'text-gray-800' : 'text-white'}`}>
            {title}
          </span>
        )}
      </div>
      
      {rightAction || (
        <Button 
          variant="ghost" 
          size="icon"
          className={isLight ? 'text-gray-700' : 'text-white'}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </header>
  );
}