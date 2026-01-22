import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  MessageCircle, 
  Clock, 
  User,
  Calendar,
  MapPin,
  ChevronRight,
  LogOut,
  DollarSign,
  Sparkles,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopHeader from '@/components/branding/TopHeader';
import PortalCard from '@/components/ui-custom/PortalCard';
import AIJobRecommendations from '@/components/scheduling/AIJobRecommendations';
import AIEmployeeAssistant from '@/components/ai/AIEmployeeAssistant';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [clockedIn, setClockedIn] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('userRole');
    navigate(createPageUrl('Auth'));
  };

  const todaysJobs = [
    { id: 1, client: 'Maria Johnson', type: 'Home Care', time: '9:00 AM - 12:00 PM', address: '123 Oak St' },
    { id: 2, client: 'Robert Smith', type: 'Transportation', time: '2:00 PM - 3:30 PM', address: '456 Elm Ave' },
    { id: 3, client: 'Linda Davis', type: 'Companion Care', time: '4:00 PM - 6:00 PM', address: '789 Pine Rd' },
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

      {/* Welcome & Status */}
      <div className="px-4 pt-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-2xl p-5 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">Good morning!</h1>
              <p className="text-white/80 text-sm mt-1">You have {todaysJobs.length} assignments today</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              clockedIn ? 'bg-green-500/30 text-green-100' : 'bg-white/20 text-white'
            }`}>
              {clockedIn ? '● Clocked In' : '○ Not Clocked In'}
            </div>
          </div>
          
          <Button 
            onClick={() => setClockedIn(!clockedIn)}
            className={`w-full h-12 rounded-xl font-semibold ${
              clockedIn 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white text-teal-600 hover:bg-white/90'
            }`}
          >
            <Clock className="w-5 h-5 mr-2" />
            {clockedIn ? 'Clock Out' : 'Clock In'}
          </Button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAI(true)}
            className="text-teal-600 border-teal-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Help
          </Button>
        </div>
        
        <PortalCard
          icon={Briefcase}
          title="Available Jobs"
          description="Browse & accept jobs"
          to={createPageUrl('EmployeeJobsList')}
          variant="primary"
        />
        
        <PortalCard
          icon={Calendar}
          title="My Schedule"
          description="Calendar & map views"
          to={createPageUrl('EmployeeSchedule')}
        />
        
        <PortalCard
          icon={ClipboardList}
          title="Today's Assignments"
          description={`${todaysJobs.length} jobs scheduled`}
          to={createPageUrl('EmployeeJobs')}
        />
        
        <PortalCard
          icon={MessageCircle}
          title="Messages"
          description="Chat with team & clients"
          to={createPageUrl('Messages')}
        />
        
        <PortalCard
          icon={Clock}
          title="Clock In/Out"
          description={clockedIn ? 'Currently clocked in' : 'Start your shift'}
          onClick={() => setClockedIn(!clockedIn)}
        />
        
        <PortalCard
          icon={DollarSign}
          title="Payouts"
          description="View earnings & payment history"
          to={createPageUrl('WorkerPayouts')}
        />

        <PortalCard
          icon={User}
          title="Profile"
          description="View your info and schedule"
          to={createPageUrl('WorkerProfile')}
        />
      </div>

      {/* AI Job Recommendations */}
      <div className="px-4 mt-8">
        <AIJobRecommendations />
      </div>

      {/* Today's Schedule */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
          <Link to={createPageUrl('EmployeeJobs')} className="text-sm text-teal-600 font-medium">
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {todaysJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{job.client}</p>
                  <p className="text-sm text-teal-600 font-medium">{job.type}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.address}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to={createPageUrl('EmployeeDashboard')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-xs text-teal-600 font-medium">Home</span>
          </Link>
          <Link to={createPageUrl('EmployeeSchedule')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Schedule</span>
          </Link>
          <Link to={createPageUrl('WorkerMessages')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Messages</span>
          </Link>
          <Link to={createPageUrl('WorkerProfile')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Profile</span>
          </Link>
        </div>
      </div>

      {/* AI Assistant */}
      <AIEmployeeAssistant isOpen={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
}