import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, FileText, AlertCircle, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ConvertToJobWizard from '@/components/jobs/ConvertToJobWizard';
import { format } from 'date-fns';

export default function AdminRequests() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showConvertWizard, setShowConvertWizard] = useState(false);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['clientRequests'],
    queryFn: () => base44.entities.ClientRequest.list('-created_date')
  });

  const priorityColors = {
    Low: 'bg-gray-100 text-gray-700',
    Normal: 'bg-blue-100 text-blue-700',
    High: 'bg-orange-100 text-orange-700',
    Urgent: 'bg-red-100 text-red-700'
  };

  const statusColors = {
    New: 'bg-blue-100 text-blue-700',
    Reviewed: 'bg-yellow-100 text-yellow-700',
    ConvertedToJob: 'bg-green-100 text-green-700',
    Archived: 'bg-gray-100 text-gray-500'
  };

  const handleConvertComplete = () => {
    queryClient.invalidateQueries(['clientRequests']);
    setSelectedRequest(null);
    setShowConvertWizard(false);
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
            <h1 className="text-xl font-bold text-[#1F3A5F]">Client Requests</h1>
            <p className="text-sm text-[#5F7D95]">{requests.length} total requests</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-[#5F7D95]">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#5F7D95]">No client requests yet</p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#1F3A5F]">{request.clientName}</h3>
                  <p className="text-sm text-[#5F7D95]">{request.serviceType}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={priorityColors[request.priority]}>
                    {request.priority}
                  </Badge>
                  <Badge className={statusColors[request.status]}>
                    {request.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {request.address && (
                  <p className="text-sm text-gray-600">
                    📍 {request.address.street}, {request.address.city}, {request.address.state}
                  </p>
                )}
                {request.requestedDateTime && (
                  <p className="text-sm text-gray-600">
                    📅 {format(new Date(request.requestedDateTime), 'MMM d, yyyy h:mm a')}
                  </p>
                )}
                {request.notes && (
                  <p className="text-sm text-gray-600 italic">{request.notes}</p>
                )}
              </div>

              <div className="flex gap-2">
                {request.status === 'New' && (
                  <Button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowConvertWizard(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Convert to Job
                  </Button>
                )}
                {request.status === 'ConvertedToJob' && (
                  <Button variant="outline" className="flex-1" disabled>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Converted to Job
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Convert Wizard */}
      {showConvertWizard && selectedRequest && (
        <ConvertToJobWizard
          request={selectedRequest}
          onClose={() => {
            setShowConvertWizard(false);
            setSelectedRequest(null);
          }}
          onComplete={handleConvertComplete}
        />
      )}
    </div>
  );
}