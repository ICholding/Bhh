import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Briefcase, Calendar, MapPin, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';

export default function AdminJobsList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs', filter],
    queryFn: async () => {
      if (filter === 'all') {
        return base44.entities.JobListing.list('-created_date');
      }
      return base44.entities.JobListing.filter({ status: filter }, '-created_date');
    }
  });

  const statusColors = {
    Draft: 'bg-gray-100 text-gray-700',
    Posted: 'bg-blue-100 text-blue-700',
    Assigned: 'bg-purple-100 text-purple-700',
    InProgress: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
  };

  const jobCounts = {
    all: jobs.length,
    Posted: jobs.filter(j => j.status === 'Posted').length,
    Assigned: jobs.filter(j => j.status === 'Assigned').length,
    InProgress: jobs.filter(j => j.status === 'InProgress').length,
    Completed: jobs.filter(j => j.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('AdminDashboard'))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#1F3A5F]">Job Management</h1>
            <p className="text-sm text-[#5F7D95]">{jobs.length} total jobs</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All ({jobCounts.all})</TabsTrigger>
            <TabsTrigger value="Posted">Posted ({jobCounts.Posted})</TabsTrigger>
            <TabsTrigger value="Assigned">Assigned ({jobCounts.Assigned})</TabsTrigger>
            <TabsTrigger value="InProgress">Active ({jobCounts.InProgress})</TabsTrigger>
            <TabsTrigger value="Completed">Done ({jobCounts.Completed})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-[#5F7D95]">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#5F7D95]">No jobs found</p>
          </div>
        ) : (
          jobs.map((job) => (
            <Link
              key={job.id}
              to={createPageUrl('AdminJobDetail') + `?jobId=${job.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1F3A5F] mb-1">{job.title}</h3>
                  <p className="text-sm text-[#5F7D95]">{job.serviceType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[job.status]}>
                    {job.status}
                  </Badge>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                {job.clientName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{job.clientName}</span>
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location.city}, {job.location.state}</span>
                  </div>
                )}
                {job.scheduledStart && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(job.scheduledStart), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                )}
                {job.assignedEmployeeName && (
                  <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <User className="w-4 h-4" />
                    <span>Assigned to {job.assignedEmployeeName}</span>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}