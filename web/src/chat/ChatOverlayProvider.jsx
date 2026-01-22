import React, { createContext, useContext, useState } from 'react';

const ChatOverlayContext = createContext();

export const useChatOverlay = () => {
  const context = useContext(ChatOverlayContext);
  if (!context) {
    throw new Error('useChatOverlay must be used within ChatOverlayProvider');
  }
  return context;
};

export const ChatOverlayProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatConfig, setChatConfig] = useState({
    mode: 'general',
    agentId: null,
    title: 'Chat Assistant'
  });

  const openChat = (config = {}) => {
    setChatConfig({
      mode: config.mode || 'general',
      agentId: config.agentId || null,
      title: config.title || 'Chat Assistant'
    });
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ChatOverlayContext.Provider
      value={{
        isOpen,
        chatConfig,
        openChat,
        closeChat,
        toggleChat
      }}
    >
      {children}
    </ChatOverlayContext.Provider>
  );
};
