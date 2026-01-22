import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useChatOverlay } from '@/chat/ChatOverlayProvider';

export default function AdminChat() {
  const navigate = useNavigate();
  const { openChat } = useChatOverlay();

  useEffect(() => {
    // Open admin chat overlay when this route is accessed
    openChat({
      mode: 'admin',
      title: 'Admin Operations Assistant',
      agentId: 'admin-agent'
    });
    
    // Redirect back to admin dashboard
    navigate(createPageUrl('AdminDashboard'), { replace: true });
  }, [navigate, openChat]);

  return null;
}