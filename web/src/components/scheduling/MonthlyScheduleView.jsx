import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MonthlyScheduleView({ currentMonth = new Date(), onMonthChange, jobs = [] }) {
  const startOfMonth = moment(currentMonth).startOf('month');
  const endOfMonth = moment(currentMonth).endOf('month');
  const startDate = moment(startOfMonth).startOf('week');
  const endDate = moment(endOfMonth).endOf('week');
  
  const weeks = [];
  let current = startDate.clone();
  
  while (current.isBefore(endDate)) {
    const week = Array.from({ length: 7 }, () => {
      const day = current.clone();
      current.add(1, 'day');
      return day;
    });
    weeks.push(week);
  }

  const getJobsForDay = (day) => {
    return jobs.filter(job => 
      moment(job.scheduledDate).isSame(day, 'day')
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {moment(currentMonth).format('MMMM YYYY')}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange && onMonthChange(moment(currentMonth).subtract(1, 'month').toDate())}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange && onMonthChange(moment(currentMonth).add(1, 'month').toDate())}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-semibold text-gray-600 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const dayJobs = getJobsForDay(day);
              const isCurrentMonth = day.month() === moment(currentMonth).month();
              const isToday = moment(day).isSame(moment(), 'day');

              return (
                <motion.div
                  key={day.format('YYYY-MM-DD')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                  className={`min-h-[80px] p-2 rounded-lg border ${
                    isToday ? 'border-blue-500 bg-blue-50' :
                    isCurrentMonth ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className={`text-xs mb-1 ${
                    isToday ? 'font-bold text-blue-600' :
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {day.format('D')}
                  </div>
                  <div className="space-y-0.5">
                    {dayJobs.slice(0, 2).map(job => (
                      <div
                        key={job.id}
                        className="text-xs p-0.5 bg-blue-100 text-blue-700 rounded truncate"
                        title={job.title}
                      >
                        {job.title}
                      </div>
                    ))}
                    {dayJobs.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayJobs.length - 2}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
