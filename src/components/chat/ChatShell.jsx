import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';

export default function ChatShell({ 
  botName = 'BHH Assistant',
  botDescription = 'Here to help you',
  quickActions = [],
  initialMessage = "Hello! How can I help you today?",
  portal = 'customer'
}) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', content: initialMessage }
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

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    const userMessage = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // AI responses based on portal type and query
    setTimeout(() => {
      let botResponse = "I understand. Let me help you with that.";
      const query = text.toLowerCase();
      
      if (portal === 'worker') {
        if (query.includes('job') || query.includes('assignment') || query.includes('schedule')) {
          botResponse = "To view your current assignments, navigate to the Jobs tab. There you'll find complete job details including client information, service location, and time slots. You can update job status and report any issues directly from each assignment card.";
        } else if (query.includes('shift') || query.includes('availability') || query.includes('time off')) {
          botResponse = "Manage your availability status by going to your Profile page. Toggle your availability switch to indicate when you're accepting new assignments. For immediate shift changes or time-off requests, contact the dispatch team through the emergency contact option in your profile.";
        } else if (query.includes('client') || query.includes('customer')) {
          botResponse = "Client details are available in each job assignment. Review client preferences, medical notes, and special instructions before arriving. Always maintain professional communication and follow BHH care protocols. If you have concerns about a client situation, report it immediately through the support channel.";
        } else if (query.includes('help') || query.includes('how')) {
          botResponse = "I can assist you with viewing job details, managing your schedule, updating availability status, and accessing client information. What specific task would you like help with?";
        }
      } else if (portal === 'admin') {
        if (query.includes('request') || query.includes('service')) {
          botResponse = "Access the Operations Overview to see all service requests. Filter by status (pending, assigned, in-progress, completed) or priority level. You can quickly assign available workers, view request details, and track completion metrics. Urgent requests are automatically flagged at the top.";
        } else if (query.includes('staff') || query.includes('employee') || query.includes('worker')) {
          botResponse = "Navigate to the Users section to manage your workforce. View real-time worker availability, review performance ratings, assign new jobs, and handle scheduling conflicts. Use the AI analysis tool for intelligent staffing recommendations based on worker skills, location, and availability.";
        } else if (query.includes('client') || query.includes('issue') || query.includes('problem')) {
          botResponse = "Client issues are tracked in the Support Queue. Review issue severity, client history, and recommended actions. Assign issues to appropriate team members and monitor resolution progress. Escalate critical situations to senior management using the priority escalation workflow.";
        } else if (query.includes('report') || query.includes('analytics') || query.includes('metric')) {
          botResponse = "Access comprehensive reports through the Analytics dashboard. View key performance indicators including service completion rates, customer satisfaction scores, worker productivity, and revenue metrics. Export reports for further analysis or stakeholder presentations.";
        }
      } else {
        if (query.includes('service') || query.includes('request') || query.includes('book')) {
          botResponse = "To request a service, return to your home screen and tap the service type you need (Transportation, Home Care, Companion Care, etc.). Select your preferred date and time, and we'll match you with an available qualified provider. You'll receive confirmation within minutes.";
        } else if (query.includes('schedule') || query.includes('appointment') || query.includes('booking')) {
          botResponse = "View all your upcoming appointments on the home screen under 'Upcoming Services'. To reschedule or cancel, you must do so at least 24 hours in advance. For urgent changes within 24 hours, contact our support team directly.";
        } else if (query.includes('payment') || query.includes('billing') || query.includes('plan')) {
          botResponse = "Your billing information and membership plan details are available in your Profile. To update payment methods or change your subscription tier, navigate to Profile > Billing Settings. Your invoices and payment history are also accessible there.";
        } else if (query.includes('help') || query.includes('how')) {
          botResponse = "I'm here to help you with service requests, scheduling, billing questions, and general support. You can book new services, check your appointments, or manage your account settings. What would you like assistance with?";
        }
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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <img 
            src=""
            alt="BHH Logo"
            className="w-10 h-10 rounded-xl"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{botName}</h2>
            <p className="text-xs text-gray-500">{botDescription}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
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
      {quickActions.length > 0 && messages.length < 3 && (
        <QuickActions actions={quickActions} onSelect={handleQuickAction} />
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
            placeholder="Type your message..."
            className="flex-1 rounded-full border-gray-200"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim()}
            className="rounded-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}