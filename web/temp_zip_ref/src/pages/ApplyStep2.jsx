import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Briefcase, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function ApplyStep2() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    { 
      value: 'customer', 
      icon: Heart, 
      title: 'Customer', 
      desc: 'I need care services',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      value: 'worker', 
      icon: Briefcase, 
      title: 'Worker', 
      desc: 'I provide care services',
      color: 'from-teal-500 to-green-500'
    },
    { 
      value: 'admin', 
      icon: Shield, 
      title: 'Admin', 
      desc: 'I manage operations',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const handleNext = () => {
    const existingData = JSON.parse(localStorage.getItem('applyData') || '{}');
    localStorage.setItem('applyData', JSON.stringify({ ...existingData, role: selectedRole }));
    navigate(createPageUrl('ApplyStep3'));
  };

  const handleBack = () => {
    navigate(createPageUrl('Apply'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-sm font-semibold text-blue-600">Step 2 of 4</p>
          <p className="text-xs text-gray-500">Role Selection</p>
        </div>
        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 pb-3">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-teal-500 w-1/2 transition-all" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Role</h1>
          <p className="text-gray-600">Choose how you'll use our platform</p>
        </motion.div>

        {/* Role Cards */}
        <div className="space-y-3">
          {roles.map((role, index) => (
            <motion.button
              key={role.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedRole(role.value)}
              className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                selectedRole === role.value
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg">{role.title}</h3>
                  <p className="text-sm text-gray-600">{role.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === role.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedRole === role.value && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100"
          >
            <p className="text-sm text-gray-700 text-center">
              {selectedRole === 'customer' && "You'll have access to request services, track care, and chat with our AI assistant for support."}
              {selectedRole === 'worker' && "You'll be able to view assignments, manage your schedule, and communicate with our operations team."}
              {selectedRole === 'admin' && "You'll have full access to manage operations, staff, clients, and analytics."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button
          onClick={handleNext}
          disabled={!selectedRole}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-50"
        >
          Next Step
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}