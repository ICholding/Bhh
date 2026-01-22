import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import moment from 'moment';
import { base44 } from '@/api/base44Client';

export default function DailyScheduleView({ date = new Date(), onJobClick }) {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDailyJobs = async () => {
      try {
        setIsLoading(true);
        const startOfDay = moment(date).startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();

        const snapshot = await base44.collection('jobs')
          .where('scheduledDate', '>=', startOfDay)
          .where('scheduledDate', '<=', endOfDay)
          .orderBy('scheduledDate', 'asc')
          .get();

        setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Failed to fetch daily jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyJobs();
  }, [date]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {moment(date).format('dddd, MMMM D, YYYY')}
        </h3>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No jobs scheduled for this day</p>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onJobClick && onJobClick(job)}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{moment(job.scheduledDate).format('h:mm A')}</span>
                    </div>
                    {job.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{job.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  job.status === 'completed' ? 'bg-green-100 text-green-700' :
                  job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {job.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
