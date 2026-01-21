import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  MessageCircle, 
  Users,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  LogOut,
  DollarSign,
  Sparkles,
  FileText,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopHeader from '@/components/branding/TopHeader';
import PortalCard from '@/components/ui-custom/PortalCard';
import AIWorkerMatching from '@/components/scheduling/AIWorkerMatching';
import AIAdminAssistant from '@/components/ai/AIAdminAssistant';

const stats = [
  { label: 'Active Requests', value: '24', change: '+12%', up: true, color: 'blue' },
  { label: 'Employees On Duty', value: '18', change: '+3', up: true, color: 'teal' },
  { label: 'Completed Today', value: '42', change: '+8%', up: true, color: 'green' },
  { label: 'Pending Issues', value: '3', change: '-2', up: false, color: 'orange' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showAI, setShowAI] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('userRole');
    navigate(createPageUrl('Auth'));
  };

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
          className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-2xl p-5 text-white"
        >
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <p className="text-white/80 text-sm mt-1">Operations overview for today</p>
          
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className="flex items-end justify-between mt-1">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                <span className={`flex items-center text-xs font-medium ${
                  stat.up ? 'text-green-600' : 'text-red-500'
                }`}>
                  {stat.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Management</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAI(true)}
            className="text-blue-600 border-blue-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
        </div>
        
        <PortalCard
          icon={FileText}
          title="Client Requests"
          description="New service requests queue"
          to={createPageUrl('AdminRequests')}
          variant="primary"
        />
        
        <PortalCard
          icon={Briefcase}
          title="Job Management"
          description="Posted & assigned jobs"
          to={createPageUrl('AdminJobsList')}
        />
        
        <PortalCard
          icon={MessageCircle}
          title="Messages"
          description="Chat with team & clients"
          to={createPageUrl('AdminMessages')}
        />
        
        <PortalCard
          icon={Users}
          title="Users"
          description="Manage customers & employees"
          to={createPageUrl('AdminUsers')}
        />
        
        <PortalCard
          icon={DollarSign}
          title="Payouts"
          description="Manage worker payments"
          to={createPageUrl('AdminPayouts')}
        />
      </div>

      {/* AI Worker Matching */}
      <div className="px-4 mt-8">
        <AIWorkerMatching />
      </div>

      {/* Recent Activity */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {[
            { action: 'New service request', user: 'Maria Johnson', time: '5 min ago' },
            { action: 'Employee clocked in', user: 'James T.', time: '12 min ago' },
            { action: 'Service completed', user: 'Robert Smith', time: '25 min ago' },
            { action: 'New registration', user: 'Linda Davis', time: '1 hour ago' },
          ].map((item, index) => (
            <div key={index} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.user}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to={createPageUrl('AdminDashboard')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs text-indigo-600 font-medium">Dashboard</span>
          </Link>
          <Link to={createPageUrl('AdminUsers')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Users</span>
          </Link>
          <Link to={createPageUrl('AdminMessages')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Messages</span>
          </Link>
          <Link to={createPageUrl('AdminProfile')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Profile</span>
          </Link>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAdminAssistant isOpen={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
}