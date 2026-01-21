import React from 'react';
import { motion } from 'framer-motion';

export default function QuickActions({ actions, onSelect }) {
  return (
    <div className="px-4 pb-3">
      <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(action)}
            className="px-4 py-2 bg-white border border-blue-200 rounded-full text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors active:scale-95"
          >
            {action}
          </motion.button>
        ))}
      </div>
    </div>
  );
}