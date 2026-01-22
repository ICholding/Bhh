import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import moment from 'moment';

export default function ActivityFeed({ limit = 10, userId = null }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    const setupSubscription = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build query
        let query = base44.collection('activities').orderBy('createdAt', 'desc');
        
        if (userId) {
          query = query.where('userId', '==', userId);
        }
        
        if (limit) {
          query = query.limit(limit);
        }

        // Subscribe to activities
        unsubscribe = query.subscribe((snapshot) => {
          const activityData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setActivities(activityData);
          setIsLoading(false);
        }, (err) => {
          console.error('Activity feed subscription error:', err);
          setError(err.message);
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Failed to setup activity subscription:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    setupSubscription();

    // Cleanup subscription on unmount to prevent memory leak
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userId, limit]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700">Failed to load activities: {error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center p-8">
        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No activities yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.title || 'Activity'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {activity.description || 'No description'}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{moment(activity.createdAt).fromNow()}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
