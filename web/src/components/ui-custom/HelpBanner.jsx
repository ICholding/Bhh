import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SignupHelpChat from '@/components/help/SignupHelpChat';

export default function HelpBanner({ 
  message = 'Need help signing up or have questions?'
}) {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div className="w-full max-w-full px-4 mb-4">
        <button
          onClick={() => setShowChat(true)}
          className="w-full max-w-full bg-[#EAF4FF] border border-[#D6E6F5] rounded-xl p-3 hover:bg-[#D6E6F5] transition-all overflow-hidden"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2F80ED] to-[#2BB0A6] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs text-[#5F7D95] break-words leading-tight">{message}</p>
              <p className="text-xs text-[#2F80ED] font-semibold mt-0.5">Contact Us</p>
            </div>
          </div>
        </button>
      </div>

      <SignupHelpChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </>
  );
}