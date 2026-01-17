import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Check, X, MessageCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function JobCard({ job }) {
  const [showActions, setShowActions] = useState(job.status === 'pending');
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [changeMessage, setChangeMessage] = useState('');

  const handleAccept = () => {
    console.log('Accepting job:', job.id);
    setShowActions(false);
    // In real app: update job status to 'confirmed'
  };

  const handleDecline = () => {
    console.log('Declining job:', job.id);
    setShowActions(false);
    // In real app: update job status to 'declined'
  };

  const handleRequestChange = () => {
    console.log('Requesting change:', { jobId: job.id, message: changeMessage });
    setShowChangeRequest(false);
    setChangeMessage('');
    // In real app: create a change request entity
  };

  const handleNavigate = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700'
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      {/* Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{job.client_name}</h4>
          <p className="text-sm text-gray-600">{job.service_type}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusColors[job.status]}`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{job.start_time} - {job.end_time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="flex-1">{job.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{job.rate}</span>
        </div>
      </div>

      {/* Notes */}
      {job.notes && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-900">{job.notes}</p>
        </div>
      )}

      {/* Navigation Button */}
      {job.status === 'confirmed' && (
        <Button
          onClick={handleNavigate}
          variant="outline"
          className="w-full mb-3"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Navigate to Location
        </Button>
      )}

      {/* Action Buttons */}
      {showActions && !showChangeRequest && (
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleAccept}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-1" />
            Accept
          </Button>
          <Button
            onClick={handleDecline}
            variant="destructive"
          >
            <X className="w-4 h-4 mr-1" />
            Decline
          </Button>
          <Button
            onClick={() => setShowChangeRequest(true)}
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Change
          </Button>
        </div>
      )}

      {/* Change Request Form */}
      {showChangeRequest && (
        <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900">Request Changes</p>
          <Textarea
            value={changeMessage}
            onChange={(e) => setChangeMessage(e.target.value)}
            placeholder="Describe what you'd like to change (time, date, etc.)"
            className="min-h-20 text-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleRequestChange}
              disabled={!changeMessage.trim()}
              className="flex-1"
            >
              Send Request
            </Button>
            <Button
              onClick={() => setShowChangeRequest(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}