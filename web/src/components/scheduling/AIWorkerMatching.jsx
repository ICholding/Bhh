import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Clock, Star, Award, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIWorkerMatching() {
  const [requests] = useState([
    {
      id: 1,
      client: 'Dorothy Williams',
      service: 'Home Care - 4 hours',
      time: 'Today, 2:00 PM - 6:00 PM',
      location: 'Downtown District',
      priority: 'High',
      specialRequirements: ['Mobility assistance', 'Meal preparation'],
      assignedWorker: null
    },
    {
      id: 2,
      client: 'James Patterson',
      service: 'Transportation - Medical Appointment',
      time: 'Tomorrow, 9:00 AM',
      location: 'Midtown',
      priority: 'Medium',
      specialRequirements: ['Wheelchair accessible vehicle'],
      assignedWorker: null
    }
  ]);

  const [expandedRequest, setExpandedRequest] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState({});

  const workerMatches = {
    1: [
      {
        id: 'w1',
        name: 'Sarah Mitchell',
        matchScore: 96,
        rating: 4.9,
        totalJobs: 234,
        distance: '1.2 miles',
        availability: 'Available now',
        reasons: [
          'Previously worked with this client (rated 5 stars)',
          'Perfect 4.9★ rating in mobility assistance (23 reviews)',
          'Completed 15 similar jobs this month with 100% satisfaction',
          'Closest available worker to client location (1.2 miles)',
          'Available for the full 4-hour time slot'
        ]
      },
      {
        id: 'w2',
        name: 'Michael Rodriguez',
        matchScore: 89,
        rating: 4.8,
        totalJobs: 127,
        distance: '2.8 miles',
        availability: 'Available now',
        reasons: [
          'Certified in mobility assistance',
          'Strong track record with similar clients',
          'Available for full shift with no conflicts',
          'Excellent meal preparation skills'
        ]
      }
    ],
    2: [
      {
        id: 'w3',
        name: 'David Chen',
        matchScore: 94,
        rating: 5.0,
        totalJobs: 156,
        distance: '0.8 miles',
        availability: 'Available tomorrow',
        reasons: [
          'Wheelchair accessible vehicle certified',
          'Perfect 5.0 rating on medical transports',
          'Preferred driver for morning appointments',
          'Closest to pickup location',
          'Familiar with all major medical facilities'
        ]
      },
      {
        id: 'w4',
        name: 'Jennifer Lee',
        matchScore: 91,
        rating: 4.9,
        totalJobs: 198,
        distance: '1.5 miles',
        availability: 'Available tomorrow',
        reasons: [
          'Wheelchair accessible vehicle',
          'Extensive medical transport experience',
          'Highly rated by senior clients',
          'Available for entire appointment duration'
        ]
      }
    ]
  };

  const handleAssign = (requestId, workerId) => {
    setSelectedWorker(prev => ({ ...prev, [requestId]: workerId }));
  };

  const toggleExpanded = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">AI Smart Matching</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Intelligent worker assignments based on skills, availability, and client needs
      </p>

      {requests.map((request) => (
        <div key={request.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Request Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{request.client}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    request.priority === 'High' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {request.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-gray-600">{request.service}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {request.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {request.location}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {request.specialRequirements.map((req, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                  {req}
                </span>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700"
              onClick={() => toggleExpanded(request.id)}
            >
              <Sparkles className="w-4 h-4" />
              <span>View AI Recommendations</span>
              {expandedRequest === request.id ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* AI Worker Matches */}
          {expandedRequest === request.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 space-y-3"
            >
              {workerMatches[request.id]?.map((worker, index) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl p-4 border-2 ${
                    selectedWorker[request.id] === worker.id
                      ? 'border-green-500'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{worker.name}</h5>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {worker.rating}
                          </span>
                          <span>•</span>
                          <span>{worker.totalJobs} jobs</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{worker.matchScore}%</div>
                      <div className="text-xs text-gray-500">match</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {worker.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      {worker.availability}
                    </span>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Why this is the best match:
                    </p>
                    <ul className="space-y-1">
                      {worker.reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedWorker[request.id] === worker.id ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-green-600 font-medium text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Assigned to {worker.name}</span>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-xl"
                      onClick={() => handleAssign(request.id, worker.id)}
                    >
                      {index === 0 && <Award className="w-4 h-4 mr-2" />}
                      {index === 0 ? 'Assign Best Match' : 'Assign Worker'}
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}