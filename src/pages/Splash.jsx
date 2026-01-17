import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(createPageUrl('Landing'));
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-50 via-blue-100 to-blue-400 relative flex flex-col items-center justify-center px-6">
      {/* Subtle wave patterns in lower half */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-500/20 via-cyan-400/10 to-transparent rounded-t-[50%] transform translate-y-12" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-600/15 to-transparent rounded-t-[60%]" />
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Logo Container - Perfect Circle */}
        <div className="relative">
          <div className="w-40 h-40 rounded-full bg-white shadow-2xl flex items-center justify-center p-6">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/4cfe26f62_in_app_512.png"
              alt="BHH"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        {/* Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Blessed Hope Healthcare
          </h1>
          <p className="text-sm text-gray-600">
            Care. Support. Peace of mind.
          </p>
        </motion.div>
      </motion.div>

      {/* Loading Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute bottom-16 flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }} />
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }} />
      </motion.div>
    </div>
  );
}