import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  CalendarPlus, 
  MessageCircle, 
  User, 
  HeadphonesIcon,
  Bell,
  Clock,
  Calendar,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopHeader from '@/components/branding/TopHeader';
import PortalCard from '@/components/ui-custom/PortalCard';

export default function ServicePortal() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('userRole');
    navigate(createPageUrl('Auth'));
  };

  const upcomingServices = [
    { id: 1, type: 'Home Care', date: 'Tomorrow, 9:00 AM', provider: 'Sarah M.' },
    { id: 2, type: 'Transportation', date: 'Wed, 2:00 PM', provider: 'James T.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TopHeader 
        rightAction={
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSignOut}
            className="text-gray-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        }
      />

      {/* Welcome Section */}
      <div className="px-4 pt-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-5 text-white"
        >
          <h1 className="text-xl font-semibold">Welcome back!</h1>
          <p className="text-white/80 text-sm mt-1">How can we help you today?</p>
          
          <Link to={createPageUrl('CustomerChat')}>
            <Button className="mt-4 bg-white text-blue-600 hover:bg-white/90 rounded-xl h-12 w-full font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" />
              Open AI Help Chat
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Services</h2>
        
        <PortalCard
          icon={CalendarPlus}
          title="Request a Service"
          description="Book care, rides, or support"
          to={createPageUrl('CustomerChat')}
          variant="primary"
        />
        
        <PortalCard
          icon={MessageCircle}
          title="Messages"
          description="Chat with care team"
          to={createPageUrl('Messages')}
        />
        
        <PortalCard
          icon={User}
          title="My Profile"
          description="View and edit your info"
          to={createPageUrl('CustomerProfile')}
        />
        
        <PortalCard
          icon={HeadphonesIcon}
          title="Support"
          description="Contact our care team"
          to={createPageUrl('CustomerChat')}
        />
      </div>

      {/* Upcoming Services */}
      {upcomingServices.length > 0 && (
        <div className="px-4 mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Services</h2>
            <button className="text-sm text-blue-600 font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {upcomingServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.type}</p>
                      <p className="text-sm text-gray-500">{service.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{service.date.split(',')[0]}</p>
                    <p className="text-xs text-gray-500">{service.date.split(',')[1]}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to={createPageUrl('ServicePortal')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">Home</span>
          </Link>
          <Link to={createPageUrl('CustomerChat')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Chat</span>
          </Link>
          <Link to={createPageUrl('CustomerProfile')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}