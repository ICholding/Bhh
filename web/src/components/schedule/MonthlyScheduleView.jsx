import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MonthlyScheduleView({ jobs, selectedDate, onDateChange }) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const getJobsForDay = (day) => {
    return jobs.filter(job => isSameDay(new Date(job.date), day));
  };

  const handleDayClick = (day) => {
    onDateChange(day);
  };

  return (
    <div>
      {/* Month Navigation */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="font-semibold text-gray-900">
            {format(selectedDate, 'MMMM yyyy')}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayJobs = getJobsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, selectedDate);
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square p-1 rounded-lg text-center relative
                  ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                  ${isToday ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-50'}
                  ${isSelected && !isToday ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <div className="text-sm">{format(day, 'd')}</div>
                {dayJobs.length > 0 && isCurrentMonth && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {dayJobs.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-blue-500" />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Jobs */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h4>
        {getJobsForDay(selectedDate).length > 0 ? (
          <div className="space-y-2">
            {getJobsForDay(selectedDate).map(job => (
              <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{job.client_name}</p>
                    <p className="text-xs text-gray-500">{job.service_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-700">{job.start_time} - {job.end_time}</p>
                    <p className="text-xs text-gray-500">{job.rate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No jobs scheduled</p>
        )}
      </div>
    </div>
  );
}