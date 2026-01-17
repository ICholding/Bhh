import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewsFloater({ onClick }) {
  return (
    <motion.button
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      onClick={onClick}
      className="fixed bottom-24 left-4 z-50 bg-white rounded-full shadow-lg px-4 py-2.5 flex items-center gap-2 border border-gray-100 hover:shadow-xl transition-shadow active:scale-95"
    >
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-gray-800">4.9</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3.5 h-3.5 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      <span className="text-xs font-medium text-blue-600">Read Our Reviews!</span>
    </motion.button>
  );
}