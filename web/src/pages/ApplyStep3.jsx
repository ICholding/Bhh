import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function ApplyStep3() {
  const navigate = useNavigate();
  const [contactMethod, setContactMethod] = useState('');
  const [consent, setConsent] = useState(false);

  const methods = [
    { value: 'email', icon: Mail, title: 'Email', desc: 'Receive updates via email' },
    { value: 'phone', icon: Phone, title: 'Phone', desc: 'Calls and text messages' },
    { value: 'sms', icon: MessageSquare, title: 'SMS Only', desc: 'Text messages only' }
  ];

  const handleNext = () => {
    const existingData = JSON.parse(localStorage.getItem('applyData') || '{}');
    localStorage.setItem('applyData', JSON.stringify({ ...existingData, contactMethod, consent }));
    navigate(createPageUrl('ApplyStep4'));
  };

  const handleBack = () => {
    navigate(createPageUrl('ApplyStep2'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-sm font-semibold text-blue-600">Step 3 of 4</p>
          <p className="text-xs text-gray-500">Contact Preferences</p>
        </div>
        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 pb-3">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-teal-500 w-3/4 transition-all" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Preferences</h1>
          <p className="text-gray-600">How would you like us to reach you?</p>
        </motion.div>

        {/* Contact Method Cards */}
        <div className="space-y-3 mb-6">
          {methods.map((method, index) => (
            <motion.button
              key={method.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setContactMethod(method.value)}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                contactMethod === method.value
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  contactMethod === method.value 
                    ? 'bg-blue-600' 
                    : 'bg-gray-100'
                }`}>
                  <method.icon className={`w-6 h-6 ${
                    contactMethod === method.value ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{method.title}</h3>
                  <p className="text-sm text-gray-600">{method.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  contactMethod === method.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {contactMethod === method.value && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Consent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={setConsent}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
              I consent to receive communications from Blessed Hope Healthcare and agree to the Terms of Service and Privacy Policy. I understand I can opt out at any time.
            </Label>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button
          onClick={handleNext}
          disabled={!contactMethod || !consent}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-50"
        >
          Next Step
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}