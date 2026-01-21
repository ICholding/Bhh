import React, { useState } from 'react';
import { X, User, Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function JobAssignmentModal({ isOpen, onClose, job }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Mock workers data - in production, fetch from User entity filtered by role
  const workers = [
    { id: 'w001', name: 'Sarah Johnson', rating: 4.9, skills: ['Home Care', 'Personal Care'], availability: 'Available', distance: '2.3 miles' },
    { id: 'w002', name: 'Michael Chen', rating: 4.8, skills: ['Companion Care', 'Transportation'], availability: 'Available', distance: '3.1 miles' },
    { id: 'w003', name: 'Emily Rodriguez', rating: 5.0, skills: ['Home Care', 'Meal Preparation'], availability: 'Available', distance: '1.8 miles' },
    { id: 'w004', name: 'James Wilson', rating: 4.7, skills: ['Transportation', 'Errands & Shopping'], availability: 'Busy', distance: '4.2 miles' },
  ];

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Job.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      onClose();
    }
  });

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    w.skills.some(skill => skill === job?.service_type)
  );

  const handleAssign = () => {
    if (selectedWorker && job) {
      updateJobMutation.mutate({
        id: job.id,
        data: {
          assigned_worker_id: selectedWorker.id,
          assigned_worker_name: selectedWorker.name
        }
      });
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Assign Worker</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Job Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-semibold text-gray-900">{job.client_name}</p>
            <p className="text-sm text-teal-600">{job.service_type}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.start_time} - {job.end_time}
              </span>
              {job.client_address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.client_address.split(',')[0]}
                </span>
              )}
            </div>
          </div>

          {/* Search */}
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workers..."
          />

          {/* Workers List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredWorkers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No available workers found</p>
            ) : (
              filteredWorkers.map(worker => (
                <button
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedWorker?.id === worker.id
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{worker.name}</p>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-600">{worker.rating}</span>
                        </div>
                      </div>
                    </div>
                    {selectedWorker?.id === worker.id && (
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full ${
                      worker.availability === 'Available' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {worker.availability}
                    </span>
                    <span>• {worker.distance}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {worker.skills.map(skill => (
                      <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!selectedWorker}
              className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-500"
            >
              Assign Worker
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}