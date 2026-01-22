import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, MapPin, Calendar, Clock, User, MessageCircle, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminJobDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => base44.entities.JobListing.filter({ id: jobId }).then(jobs => jobs[0]),
    enabled: !!jobId
  });

  const { data: toDo } = useQuery({
    queryKey: ['jobToDo', jobId],
    queryFn: () => base44.entities.JobToDo.filter({ jobId }).then(todos => todos[0]),
    enabled: !!jobId
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['jobMessages', jobId],
    queryFn: () => base44.entities.JobMessage.filter({ jobId }, '-created_date'),
    enabled: !!jobId
  });

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-[#5F7D95]">Job not found</p>
      </div>
    );
  }

  const statusColors = {
    Draft: 'bg-gray-100 text-gray-700',
    Posted: 'bg-blue-100 text-blue-700',
    Assigned: 'bg-purple-100 text-purple-700',
    InProgress: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
  };

  const stepStatusIcons = {
    Todo: <Circle className="w-4 h-4 text-gray-400" />,
    Doing: <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />,
    Done: <CheckCircle2 className="w-4 h-4 text-green-600" />
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('AdminJobsList'))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#1F3A5F]">Job Details</h1>
            <Badge className={statusColors[job.status]}>{job.status}</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Job Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-[#1F3A5F] mb-1">{job.title}</h2>
          <p className="text-sm text-[#5F7D95] mb-3">{job.serviceType}</p>
          
          <div className="space-y-2">
            {job.clientName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{job.clientName} • {job.clientPhone}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>{job.location.street}, {job.location.city}, {job.location.state} {job.location.zip}</span>
              </div>
            )}
            {job.scheduledStart && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(job.scheduledStart), 'MMM d, yyyy h:mm a')}</span>
              </div>
            )}
            {job.estimatedDurationMinutes && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{job.estimatedDurationMinutes} minutes</span>
              </div>
            )}
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">Requirements:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>• {req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.assignedEmployeeName && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">
                <strong>Assigned to:</strong> {job.assignedEmployeeName}
              </p>
            </div>
          )}
        </div>

        {/* To-Do Progress (Read-Only) */}
        {toDo && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h2 className="font-semibold text-[#1F3A5F] mb-3">
              Progress ({toDo.steps.filter(s => s.status === 'Done').length}/{toDo.steps.length} steps)
            </h2>
            <div className="space-y-2">
              {toDo.steps.map((step) => (
                <div key={step.stepId} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                  {stepStatusIcons[step.status]}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${step.status === 'Done' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {step.title}
                    </p>
                    {step.proofValue && (
                      <p className="text-xs text-gray-600 mt-1 italic">Note: {step.proofValue}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-[#1F3A5F]" />
            <h2 className="font-semibold text-[#1F3A5F]">Activity Log</h2>
          </div>
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="border-l-2 border-blue-200 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600">{msg.fromRole}</span>
                    {msg.fromName && <span className="text-xs text-gray-500">({msg.fromName})</span>}
                    <span className="text-xs text-gray-400">
                      {format(new Date(msg.created_date), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}