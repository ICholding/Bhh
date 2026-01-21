import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupHelpChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'bot', 
      content: "Hi! I can help you sign up, apply as an employee, or answer questions about Blessed Hope Healthcare." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    "Client signup help",
    "Employee application help",
    "Form questions",
    "Something else"
  ];

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    const userMessage = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "I understand. Let me help you with that.";
      
      if (text.toLowerCase().includes('client')) {
        botResponse = "Great! As a Client, you'll have access to request care services like transportation, grocery delivery, home care, and more. Continue filling out the form above to create your account.";
      } else if (text.toLowerCase().includes('employee') || text.toLowerCase().includes('worker')) {
        botResponse = "Wonderful! We're always looking for dedicated caregivers and workers. After you complete this basic form, you'll be directed to our full employment application with additional questions about your experience and availability.";
      } else if (text.toLowerCase().includes('form') || text.toLowerCase().includes('help')) {
        botResponse = "I'm happy to help! Please fill in your First Name, Last Name, Email, and Phone number. All fields are required. If you have any specific questions about a field, feel free to ask.";
      }
      
      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: botResponse
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (action) => {
    handleSend(action);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-white flex flex-col"
        >
          {/* Header */}
          <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">BHH Support Assistant</h1>
              <p className="text-xs text-gray-500">Here to help with signup</p>
            </div>
            <img 
              src=""
              alt="BHH"
              className="w-9 h-9 rounded-lg"
            />
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 ${message.role === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                {message.role === 'bot' && (
                  <img 
                    src=""
                    alt="BHH Bot"
                    className="w-8 h-8 rounded-lg flex-shrink-0"
                  />
                )}
                
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === 'bot'
                    ? 'bg-white shadow-sm border border-gray-100 rounded-bl-md' 
                    : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-br-md'
                }`}>
                  <p className={`text-sm leading-relaxed ${message.role === 'bot' ? 'text-gray-800' : 'text-white'}`}>
                    {message.content}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-3 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickAction(action)}
                    className="px-4 py-2 bg-white border border-blue-200 rounded-full text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors active:scale-95"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white border-t p-4">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-full border-gray-200 h-12"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim()}
                className="rounded-full h-12 w-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}