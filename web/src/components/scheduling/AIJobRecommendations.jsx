import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Clock, TrendingUp, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIJobRecommendations() {
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      client: 'Margaret Thompson',
      service: 'Home Care - 4 hours',
      time: 'Tomorrow, 10:00 AM - 2:00 PM',
      location: '2.3 miles away',
      matchScore: 98,
      reasons: [
        'Client rated you 5 stars on previous service',
        'Only 2.3 miles from your last assignment',
        'Matches your expertise in elder care (4.9★ avg in this category)',
        'Fits perfectly in your schedule'
      ],
      pay: '$68',
      accepted: false
    },
    {
      id: 2,
      client: 'Robert Anderson',
      service: 'Transportation to Medical Facility',
      time: 'Tomorrow, 3:30 PM - 5:00 PM',
      location: '4.1 miles away',
      matchScore: 92,
      reasons: [
        'On your preferred route home',
        'Client specifically requested you',
        'Quick 1.5 hour assignment',
        'Premium rate for medical transport'
      ],
      pay: '$45',
      accepted: false
    },
    {
      id: 3,
      client: 'Helen Martinez',
      service: 'Companion Care - 3 hours',
      time: 'Wed, 9:00 AM - 12:00 PM',
      location: '1.8 miles away',
      matchScore: 89,
      reasons: [
        'Closest to your home address',
        'Morning slot matches your preference',
        'Recurring opportunity (3x/week)',
        'Client has similar interests to past clients'
      ],
      pay: '$51',
      accepted: false
    }
  ]);

  const handleAccept = (id) => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, accepted: true } : rec
    ));
  };

  const handleDismiss = (id) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
        <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No new recommendations at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">AI Job Recommendations</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Personalized matches based on your skills, location, and schedule
      </p>

      <AnimatePresence>
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-4 border-2 ${
              rec.accepted ? 'border-green-500' : 'border-blue-200'
            }`}
          >
            {rec.accepted && (
              <div className="flex items-center gap-2 mb-3 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Assignment Accepted!</span>
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-blue-600">{rec.matchScore}%</span>
                  <span className="text-xs text-gray-500">match score</span>
                </div>
                <h4 className="font-semibold text-gray-900">{rec.client}</h4>
                <p className="text-sm text-gray-600">{rec.service}</p>
              </div>
              {!rec.accepted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1"
                  onClick={() => handleDismiss(rec.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{rec.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{rec.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">{rec.pay}</span>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-3 mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Why this is a great match:</p>
              <ul className="space-y-1">
                {rec.reasons.map((reason, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!rec.accepted ? (
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl h-11"
                onClick={() => handleAccept(rec.id)}
              >
                Accept Assignment
              </Button>
            ) : (
              <div className="text-center py-2 text-sm text-green-600 font-medium">
                Added to your schedule ✓
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}