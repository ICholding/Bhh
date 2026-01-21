import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Briefcase, Calendar, MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { generateJobToDo } from '@/components/jobs/AIToDoGenerator';
import { useState } from 'react';

export default function EmployeeJobsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('available');
  const [currentUser] = useState({ id: 'emp-1', name: 'John Worker' });

  const { data: availableJobs = [] } = useQuery({
    queryKey: ['availableJobs'],
    queryFn: () => base44.entities.JobListing.filter({ status: 'Posted' }, '-created_date')
  });

  const { data: myJobs = [] } = useQuery({
    queryKey: ['myJobs', currentUser.id],
    queryFn: () => base44.entities.JobListing.filter({ assignedEmployeeId: currentUser.id }, '-created_date')
  });

  const acceptJobMutation = useMutation({
    mutationFn: async (job) => {
      const updatedJob = await base44.entities.JobListing.update(job.id, {
        status: 'Assigned',
        assignedEmployeeId: currentUser.id,
        assignedEmployeeName: currentUser.name
      });

      await generateJobToDo(updatedJob, currentUser.id);

      await base44.entities.JobMessage.create({
        jobId: job.id,
        fromRole: 'Employee',
        fromName: currentUser.name,
        message: 'Job accepted. Starting preparation.'
      });

      return updatedJob;
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries(['availableJobs']);
      queryClient.invalidateQueries(['myJobs']);
      navigate(createPageUrl('EmployeeJobDetail') + `?jobId=${job.id}`);
    }
  });

  const statusColors = {
    Assigned: 'bg-purple-100 text-purple-700',
    InProgress: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700'
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('EmployeeDashboard'))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#1F3A5F]">Jobs</h1>
            <p className="text-sm text-[#5F7D95]">Available & assigned jobs</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="available">
              Available ({availableJobs.length})
            </TabsTrigger>
            <TabsTrigger value="mine">
              My Jobs ({myJobs.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {activeTab === 'available' ? (
          availableJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-[#5F7D95]">No available jobs</p>
            </div>
          ) : (
            availableJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="mb-3">
                  <h3 className="font-semibold text-[#1F3A5F] mb-1">{job.title}</h3>
                  <Badge className="bg-blue-100 text-blue-700">{job.serviceType}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location.city}, {job.location.state}</span>
                    </div>
                  )}
                  {job.scheduledStart && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(job.scheduledStart), 'MMM d, h:mm a')}</span>
                    </div>
                  )}
                  {job.estimatedDurationMinutes && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{job.estimatedDurationMinutes} minutes</span>
                    </div>
                  )}
                  {job.payRate && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.payRate}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => acceptJobMutation.mutate(job)}
                  disabled={acceptJobMutation.isPending}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600"
                >
                  {acceptJobMutation.isPending ? 'Accepting...' : 'Accept Job'}
                </Button>
              </div>
            ))
          )
        ) : (
          myJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-[#5F7D95]">No assigned jobs</p>
            </div>
          ) : (
            myJobs.map((job) => (
              <Link
                key={job.id}
                to={createPageUrl('EmployeeJobDetail') + `?jobId=${job.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1F3A5F] mb-1">{job.title}</h3>
                    <Badge className={statusColors[job.status]}>
                      {job.status}
                    </Badge>
                  </div>
                  {job.status === 'Completed' && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>

                <div className="space-y-2">
                  {job.scheduledStart && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(job.scheduledStart), 'MMM d, h:mm a')}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location.city}, {job.location.state}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )
        )}
      </div>
    </div>
  );
}