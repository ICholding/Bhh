import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SignupHelpChat from '@/components/help/SignupHelpChat';

export default function HelpBanner({ 
  message = 'Need help signing up or have questions?'
}) {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowChat(true)}
        className="w-full bg-[#EAF4FF] border border-[#D6E6F5] rounded-2xl p-4 mx-4 mb-6 hover:bg-[#D6E6F5] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2F80ED] to-[#2BB0A6] flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-[#5F7D95]">{message}</p>
            <p className="text-sm text-[#2F80ED] font-semibold mt-0.5">Contact Us</p>
          </div>
        </div>
      </button>

      <SignupHelpChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </>
  );
}