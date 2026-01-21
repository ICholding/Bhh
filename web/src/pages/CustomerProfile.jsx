import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Clock, CheckCircle, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceFeedbackModal from '@/components/reviews/ServiceFeedbackModal';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const userInfo = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    memberSince: 'January 2025',
    plan: 'Plus Membership',
    address: '123 Main St, Atlanta, GA 30301'
  };

  const serviceHistory = [
    { id: 1, service: 'Transportation to Medical Appointment', date: '2025-01-15', status: 'Completed', provider: 'Michael R.', workerId: 'w1', reviewed: false },
    { id: 2, service: 'Grocery Delivery', date: '2025-01-12', status: 'Completed', provider: 'Lisa M.', workerId: 'w2', reviewed: true },
    { id: 3, service: 'Home Care - 4 hours', date: '2025-01-08', status: 'Completed', provider: 'David K.', workerId: 'w3', reviewed: false },
    { id: 4, service: 'Companion Care', date: '2025-01-05', status: 'Completed', provider: 'Jennifer S.', workerId: 'w4', reviewed: true },
    { id: 5, service: 'Transportation to Pharmacy', date: '2025-01-02', status: 'Completed', provider: 'Michael R.', workerId: 'w1', reviewed: false }
  ];

  const handleRateService = (service) => {
    setSelectedService(service);
    setFeedbackModalOpen(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('userRole');
    navigate(createPageUrl('Landing'));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(createPageUrl('ServicePortal'))}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">My Profile</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 pt-6 space-y-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{userInfo.name}</h2>
              <p className="text-sm text-white/80">{userInfo.plan}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Member since {userInfo.memberSince}</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{userInfo.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{userInfo.phone}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-gray-700">{userInfo.address}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-xl">
            Edit Information
          </Button>
        </div>

        {/* Service History */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Service History</h3>
          <div className="space-y-3">
            {serviceHistory.map(service => (
              <div key={service.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{service.service}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{service.provider}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{service.date}</span>
                  </div>
                  {!service.reviewed && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 text-xs rounded-lg"
                      onClick={() => handleRateService(service)}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Rate Service
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <Button 
          variant="outline" 
          className="w-full h-12 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Feedback Modal */}
      <ServiceFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
}