import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

export default function AIEmployeeAssistant({ isOpen, onClose, job, toDo }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I can help you:\n• Understand job steps\n• Get safety guidance\n• Draft updates to admin\n• Answer task questions\n\nHow can I assist?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const context = job ? `
Job: ${job.title}
Service: ${job.serviceType}
Instructions: ${job.specialInstructions || 'None'}
${toDo ? `Current Steps: ${toDo.steps.map(s => `${s.title} (${s.status})`).join(', ')}` : ''}
` : '';

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI assistant for BHH healthcare workers. Help them complete jobs safely and professionally.

Context:
${context}

Worker question: ${userMessage}

Provide clear, practical guidance. For "what's next", tell them the next ToDo step. For safety questions, give operational safety tips (hand hygiene, communication, documentation) - never medical advice. For admin updates, draft a professional message.

Be helpful and concise.`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-teal-600 to-cyan-500">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-semibold">AI Job Assistant</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2.5">
                    <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("What's my next step?");
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-xs whitespace-nowrap"
              >
                What's next?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("Draft an update message to admin");
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-xs whitespace-nowrap"
              >
                Draft update
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("Safety reminders for this job");
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-xs whitespace-nowrap"
              >
                Safety tips
              </Button>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="min-h-[60px] resize-none"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-gradient-to-r from-teal-600 to-cyan-500"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}