import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobCard from './JobCard';

export default function DailyScheduleView({ jobs, selectedDate, onDateChange }) {
  const filteredJobs = jobs.filter(job => 
    isSameDay(new Date(job.date), selectedDate)
  ).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div>
      {/* Date Navigation */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousDay}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">
              {format(selectedDate, 'EEEE, MMM d')}
            </h3>
            <p className="text-xs text-gray-500">{format(selectedDate, 'yyyy')}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextDay}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {!isSameDay(selectedDate, new Date()) && (
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="w-full"
          >
            Today
          </Button>
        )}
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <p className="text-gray-500">No jobs scheduled for this day</p>
            <p className="text-sm text-gray-400 mt-1">Check other dates or accept new assignments</p>
          </div>
        )}
      </div>
    </div>
  );
}