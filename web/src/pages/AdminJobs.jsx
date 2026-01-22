import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Search, Calendar, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import TopHeader from '@/components/branding/TopHeader';
import JobFormModal from '@/components/jobs/JobFormModal';
import JobAssignmentModal from '@/components/jobs/JobAssignmentModal';

export default function AdminJobs() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [assigningJob, setAssigningJob] = useState(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => base44.entities.Job.list('-date')
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Job.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    }
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.assigned_worker_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    confirmed: jobs.filter(j => j.status === 'confirmed').length,
    in_progress: jobs.filter(j => j.status === 'in_progress').length,
    completed: jobs.filter(j => j.status === 'completed').length
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority] || 'text-gray-500';
  };

  const handleStatusChange = async (jobId, newStatus) => {
    await updateJobMutation.mutateAsync({
      id: jobId,
      data: { status: newStatus }
    });
  };

  const handleAssignWorker = (job) => {
    setAssigningJob(job);
    setShowAssignModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <TopHeader 
        showBack 
        onBack={() => navigate(createPageUrl('AdminDashboard'))}
        title="Job Management"
      />

      {/* Stats */}
      <div className="px-4 pt-4 pb-6">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
            <p className="text-xs text-gray-600 mb-1">Pending</p>
            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
            <p className="text-xs text-gray-600 mb-1">Confirmed</p>
            <p className="text-xl font-bold text-blue-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
            <p className="text-xs text-gray-600 mb-1">In Progress</p>
            <p className="text-xl font-bold text-purple-600">{stats.in_progress}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-3 text-white text-center">
            <p className="text-xs opacity-90 mb-1">Completed</p>
            <p className="text-xl font-bold">{stats.completed}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3 text-white text-center">
            <p className="text-xs opacity-90 mb-1">Total Jobs</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-4">
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Job
        </Button>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No jobs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{job.client_name}</h3>
                      <span className={`text-xs font-semibold ${getPriorityColor(job.priority)}`}>
                        {job.priority?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-teal-600 font-medium mb-2">{job.service_type}</p>
                    
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(job.date), 'MMM d, yyyy')} • {job.start_time} - {job.end_time}
                      </div>
                      {job.client_address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.client_address}
                        </div>
                      )}
                      {job.assigned_worker_name ? (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {job.assigned_worker_name}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-600">
                          <User className="w-3 h-3" />
                          Unassigned
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(job.status)}`}>
                    {job.status.split('_').join(' ')}
                  </span>
                </div>

                <div className="flex gap-2">
                  {!job.assigned_worker_id && job.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleAssignWorker(job)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Assign Worker
                    </Button>
                  )}
                  {job.status === 'pending' && job.assigned_worker_id && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(job.id, 'confirmed')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Confirm Job
                    </Button>
                  )}
                  {job.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(job.id, 'in_progress')}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Start Job
                    </Button>
                  )}
                  {job.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(job.id, 'completed')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Complete
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingJob(job);
                      setShowCreateModal(true);
                    }}
                    className="flex-1"
                  >
                    Edit Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <JobFormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingJob(null);
        }}
        editingJob={editingJob}
      />

      <JobAssignmentModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setAssigningJob(null);
        }}
        job={assigningJob}
      />
    </div>
  );
}