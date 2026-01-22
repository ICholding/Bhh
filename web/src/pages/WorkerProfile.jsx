import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, User, Mail, Phone, Briefcase, CheckCircle, Star, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import WorkerReviews from '@/components/reviews/WorkerReviews';

export default function WorkerProfile() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);

  const workerInfo = {
    name: 'Michael Rodriguez',
    email: 'michael.r@bhhcare.com',
    phone: '(555) 234-5678',
    role: 'Certified Home Care Provider',
    employeeSince: 'March 2024',
    rating: 4.9,
    totalJobs: 127
  };

  const completedJobs = [
    { id: 1, client: 'Sarah J.', service: 'Transportation to Medical Appointment', date: '2025-01-15', duration: '2 hours' },
    { id: 2, client: 'Robert K.', service: 'Home Care Assistance', date: '2025-01-14', duration: '4 hours' },
    { id: 3, client: 'Maria S.', service: 'Companion Care', date: '2025-01-13', duration: '3 hours' },
    { id: 4, client: 'David H.', service: 'Transportation to Pharmacy', date: '2025-01-12', duration: '1.5 hours' },
    { id: 5, client: 'Linda M.', service: 'Home Care Assistance', date: '2025-01-11', duration: '4 hours' }
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
          onClick={() => navigate(createPageUrl('EmployeeDashboard'))}
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
            <div className="flex-1">
              <h2 className="text-xl font-bold">{workerInfo.name}</h2>
              <p className="text-sm text-white/80">{workerInfo.role}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span className="font-semibold">{workerInfo.rating}</span>
              </div>
              <p className="text-xs text-white/80">{workerInfo.totalJobs} jobs</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4" />
            <span>Working since {workerInfo.employeeSince}</span>
          </div>
        </div>

        {/* Availability Status */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Availability Status</h3>
              <p className="text-sm text-gray-500 mt-1">
                {isAvailable ? 'Currently accepting assignments' : 'Not accepting assignments'}
              </p>
            </div>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={setIsAvailable}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{workerInfo.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{workerInfo.phone}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-xl">
            Edit Information
          </Button>
        </div>

        {/* Client Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Client Reviews</h3>
          <WorkerReviews workerId="w1" />
        </div>

        {/* Completed Jobs History */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Completed Jobs</h3>
          <div className="space-y-3">
            {completedJobs.map(job => (
              <div key={job.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{job.service}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{job.client}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{job.date}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{job.duration}</span>
                  </div>
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
    </div>
  );
}