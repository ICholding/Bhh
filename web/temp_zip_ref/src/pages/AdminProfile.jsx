import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, User, Mail, Shield, TrendingUp, Users, Briefcase, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminProfile() {
  const navigate = useNavigate();

  const adminInfo = {
    name: 'Jennifer Smith',
    email: 'j.smith@bhhcare.com',
    role: 'System Administrator',
    accessLevel: 'Full Access',
    employeeSince: 'January 2024'
  };

  const operationalMetrics = [
    { label: 'Total Active Clients', value: '487', icon: Users, color: 'blue' },
    { label: 'Active Employees', value: '92', icon: Briefcase, color: 'teal' },
    { label: 'This Month Requests', value: '1,234', icon: Calendar, color: 'green' },
    { label: 'Satisfaction Rate', value: '4.8/5', icon: TrendingUp, color: 'purple' }
  ];

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
          onClick={() => navigate(createPageUrl('AdminDashboard'))}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Admin Profile</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 pt-6 space-y-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{adminInfo.name}</h2>
              <p className="text-sm text-white/80">{adminInfo.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Since {adminInfo.employeeSince}</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              {adminInfo.accessLevel}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{adminInfo.email}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-xl">
            Edit Information
          </Button>
        </div>

        {/* Operational Metrics */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            {operationalMetrics.map((metric, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
              >
                <metric.icon className={`w-5 h-5 text-${metric.color}-600 mb-2`} />
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-600 mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Admin Tools</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl">
              <Shield className="w-4 h-4 mr-2" />
              Security Settings
            </Button>
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
    </div>
  );
}