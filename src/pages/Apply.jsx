import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SignupHelpChat from '@/components/help/SignupHelpChat';

export default function Apply() {
  const navigate = useNavigate();
  const [showHelpChat, setShowHelpChat] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('applyData', JSON.stringify(formData));
    navigate(createPageUrl('ApplyStep2'));
  };

  const handleBack = () => {
    navigate(createPageUrl('Welcome'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-sm font-semibold text-blue-600">Step 1 of 4</p>
          <p className="text-xs text-gray-500">Account Basics</p>
        </div>
        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 pb-3">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-teal-500 w-1/4 transition-all" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/6585f39cc_chat_avatar_48.png"
            alt="BHH Logo"
            className="w-16 h-16 rounded-xl mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Let's get started with your basic information</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600 mb-1.5 block">First Name *</Label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  placeholder="John"
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-1.5 block">Last Name *</Label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  placeholder="Doe"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-1.5 block">Email *</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => updateForm('email', e.target.value)}
                placeholder="john@example.com"
                className="h-12 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-1.5 block">Phone *</Label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Help Banner */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowHelpChat(true)}
          className="w-full bg-blue-50 rounded-2xl p-5 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 mb-0.5">Need Help?</h3>
              <p className="text-sm text-blue-600 font-medium">Contact Us</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.button>
      </div>

      {/* Help Chat Modal */}
      <SignupHelpChat isOpen={showHelpChat} onClose={() => setShowHelpChat(false)} />

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button
          onClick={handleNext}
          disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-50"
        >
          Next Step
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}