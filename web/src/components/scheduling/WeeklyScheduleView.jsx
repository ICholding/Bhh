import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WeeklyScheduleView({ currentWeek = new Date(), onWeekChange, jobs = [] }) {
  const startOfWeek = moment(currentWeek).startOf('week');
  const days = Array.from({ length: 7 }, (_, i) => moment(startOfWeek).add(i, 'days'));

  const getJobsForDay = (day) => {
    return jobs.filter(job => 
      moment(job.scheduledDate).isSame(day, 'day')
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {startOfWeek.format('MMM D')} - {moment(startOfWeek).add(6, 'days').format('MMM D, YYYY')}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onWeekChange && onWeekChange(moment(currentWeek).subtract(1, 'week').toDate())}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onWeekChange && onWeekChange(moment(currentWeek).add(1, 'week').toDate())}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayJobs = getJobsForDay(day);
          const isToday = moment(day).isSame(moment(), 'day');

          return (
            <motion.div
              key={day.format('YYYY-MM-DD')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`min-h-[120px] p-2 rounded-lg border ${
                isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-center mb-2">
                <div className="text-xs text-gray-600">{day.format('ddd')}</div>
                <div className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day.format('D')}
                </div>
              </div>
              <div className="space-y-1">
                {dayJobs.slice(0, 3).map(job => (
                  <div
                    key={job.id}
                    className="text-xs p-1 bg-blue-100 text-blue-700 rounded truncate"
                    title={job.title}
                  >
                    {job.title}
                  </div>
                ))}
                {dayJobs.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayJobs.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
