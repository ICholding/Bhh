import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WeeklyScheduleView({ jobs, selectedDate, onDateChange }) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const getJobsForDay = (day) => {
    return jobs.filter(job => isSameDay(new Date(job.date), day))
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <div>
      {/* Week Navigation */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousWeek}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextWeek}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week View */}
      <div className="space-y-4">
        {weekDays.map((day) => {
          const dayJobs = getJobsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={day.toISOString()} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isToday ? 'border-blue-200' : 'border-gray-100'}`}>
                <div>
                  <h4 className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {format(day, 'EEEE')}
                  </h4>
                  <p className="text-xs text-gray-500">{format(day, 'MMM d')}</p>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-lg ${
                  dayJobs.length > 0 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {dayJobs.length} {dayJobs.length === 1 ? 'job' : 'jobs'}
                </div>
              </div>
              
              {dayJobs.length > 0 ? (
                <div className="space-y-2">
                  {dayJobs.map(job => (
                    <div key={job.id} className="text-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{job.client_name}</p>
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
                <p className="text-sm text-gray-400 text-center py-2">No jobs scheduled</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}