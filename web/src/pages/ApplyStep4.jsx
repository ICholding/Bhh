import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, User, Briefcase, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApplyStep4() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('applyData') || '{}');
    setFormData(data);
  }, []);

  const handleSubmit = () => {
    // Store account creation state
    localStorage.setItem('isSignedIn', 'true');
    localStorage.setItem('userRole', formData?.role || 'customer');
    localStorage.removeItem('applyData');
    
    // Route to portal
    navigate(createPageUrl('Portal'));
  };

  const handleBack = () => {
    navigate(createPageUrl('ApplyStep3'));
  };

  if (!formData) return null;

  const roleLabels = {
    customer: 'Customer',
    worker: 'Worker',
    admin: 'Admin'
  };

  const methodLabels = {
    email: 'Email',
    phone: 'Phone',
    sms: 'SMS Only'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-sm font-semibold text-blue-600">Step 4 of 4</p>
          <p className="text-xs text-gray-500">Review & Submit</p>
        </div>
        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 pb-3">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-teal-500 w-full transition-all" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h1>
          <p className="text-gray-600">Everything looks good? Let's create your account</p>
        </motion.div>

        {/* Review Cards */}
        <div className="space-y-3">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">{formData.phone}</span>
              </div>
            </div>
          </motion.div>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Selected Role</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Role:</span>
              <span className="font-semibold text-teal-600">{roleLabels[formData.role]}</span>
            </div>
          </motion.div>

          {/* Contact Preference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Contact Preference</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Preferred Method:</span>
                <span className="font-medium text-gray-900">{methodLabels[formData.contactMethod]}</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>Consent provided</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100"
        >
          <p className="text-sm text-gray-700 text-center">
            By creating an account, you'll get instant access to our AI-powered healthcare platform with personalized assistance tailored to your role.
          </p>
        </motion.div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button
          onClick={handleSubmit}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
        >
          Create Account
          <Check className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}