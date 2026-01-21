import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle2, Circle, Loader2, Camera, FileText, PenTool, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function EmployeeJobDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const queryClient = useQueryClient();
  const [currentUser] = useState({ id: 'emp-1', name: 'John Worker' });

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => base44.entities.JobListing.filter({ id: jobId }).then(jobs => jobs[0]),
    enabled: !!jobId
  });

  const { data: toDo, isLoading: todoLoading } = useQuery({
    queryKey: ['jobToDo', jobId],
    queryFn: () => base44.entities.JobToDo.filter({ jobId }).then(todos => todos[0]),
    enabled: !!jobId
  });

  const updateStepMutation = useMutation({
    mutationFn: async ({ stepId, updates }) => {
      const updatedSteps = toDo.steps.map(step =>
        step.stepId === stepId ? { ...step, ...updates } : step
      );
      return base44.entities.JobToDo.update(toDo.id, { steps: updatedSteps });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['jobToDo', jobId]);
    }
  });

  const startJobMutation = useMutation({
    mutationFn: () => base44.entities.JobListing.update(jobId, { status: 'InProgress' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
    }
  });

  const completeJobMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.JobListing.update(jobId, { status: 'Completed' });
      await base44.entities.JobMessage.create({
        jobId,
        fromRole: 'Employee',
        fromName: currentUser.name,
        message: 'Job completed successfully. All steps finished.'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      navigate(createPageUrl('EmployeeJobsList'));
    }
  });

  const handleStepStatus = (stepId, newStatus) => {
    updateStepMutation.mutate({ stepId, updates: { status: newStatus } });
  };

  const handleProofUpdate = (stepId, proofValue) => {
    updateStepMutation.mutate({ stepId, updates: { proofValue } });
  };

  const allStepsComplete = toDo?.steps?.every(s => s.status === 'Done');

  if (jobLoading || todoLoading) {
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
    Assigned: 'bg-purple-100 text-purple-700',
    InProgress: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700'
  };

  const stepStatusIcons = {
    Todo: <Circle className="w-5 h-5 text-gray-400" />,
    Doing: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
    Done: <CheckCircle2 className="w-5 h-5 text-green-600" />
  };

  const proofIcons = {
    Photo: <Camera className="w-4 h-4" />,
    Note: <FileText className="w-4 h-4" />,
    Signature: <PenTool className="w-4 h-4" />,
    None: null
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('EmployeeJobsList'))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#1F3A5F]">{job.title}</h1>
            <Badge className={statusColors[job.status]}>{job.status}</Badge>
          </div>
        </div>
      </div>

      {/* Job Summary */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <h2 className="font-semibold text-[#1F3A5F] mb-3">Job Details</h2>
          <div className="space-y-2">
            {job.clientName && (
              <p className="text-sm text-gray-700">
                <strong>Client:</strong> {job.clientName}
              </p>
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

          {job.specialInstructions && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Special Instructions:</strong> {job.specialInstructions}
              </p>
            </div>
          )}

          {job.status === 'Assigned' && (
            <Button
              onClick={() => startJobMutation.mutate()}
              className="w-full mt-4 bg-gradient-to-r from-teal-600 to-cyan-500"
            >
              Start Job
            </Button>
          )}
        </div>

        {/* To-Do Checklist */}
        {toDo && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h2 className="font-semibold text-[#1F3A5F] mb-3">
              Task Checklist ({toDo.steps.filter(s => s.status === 'Done').length}/{toDo.steps.length})
            </h2>
            <div className="space-y-3">
              {toDo.steps.map((step, idx) => (
                <div key={step.stepId} className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-start gap-3 mb-2">
                    <button
                      onClick={() => {
                        const nextStatus = step.status === 'Todo' ? 'Doing' : step.status === 'Doing' ? 'Done' : 'Todo';
                        handleStepStatus(step.stepId, nextStatus);
                      }}
                      className="mt-0.5"
                    >
                      {stepStatusIcons[step.status]}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1F3A5F]">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {step.estimatedMinutes && (
                        <p className="text-xs text-gray-500 mt-1">~{step.estimatedMinutes} min</p>
                      )}
                    </div>
                  </div>

                  {step.safetyWarning && (
                    <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-900">{step.safetyWarning}</p>
                    </div>
                  )}

                  {step.requiresProof && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {proofIcons[step.proofType]}
                        <span className="text-xs font-medium text-gray-700">
                          {step.proofType} Required
                        </span>
                      </div>
                      {step.proofType === 'Note' && (
                        <Textarea
                          value={step.proofValue || ''}
                          onChange={(e) => handleProofUpdate(step.stepId, e.target.value)}
                          placeholder="Add notes..."
                          className="min-h-[60px] text-sm"
                        />
                      )}
                      {step.proofType === 'Signature' && (
                        <Input
                          value={step.proofValue || ''}
                          onChange={(e) => handleProofUpdate(step.stepId, e.target.value)}
                          placeholder="Client signature..."
                          className="text-sm"
                        />
                      )}
                      {step.proofType === 'Photo' && (
                        <div className="text-xs text-gray-500">Photo upload placeholder</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Job Button */}
      {job.status === 'InProgress' && allStepsComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Button
            onClick={() => completeJobMutation.mutate()}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Mark Job Completed
          </Button>
        </div>
      )}
    </div>
  );
}