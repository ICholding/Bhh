import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation,
  Check,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const allJobs = [
  { id: 1, client: 'Maria Johnson', type: 'Home Care', time: '9:00 AM - 12:00 PM', address: '123 Oak St, Springfield', phone: '(555) 123-4567', status: 'upcoming', date: 'Today' },
  { id: 2, client: 'Robert Smith', type: 'Transportation', time: '2:00 PM - 3:30 PM', address: '456 Elm Ave, Springfield', phone: '(555) 234-5678', status: 'upcoming', date: 'Today' },
  { id: 3, client: 'Linda Davis', type: 'Companion Care', time: '4:00 PM - 6:00 PM', address: '789 Pine Rd, Springfield', phone: '(555) 345-6789', status: 'upcoming', date: 'Today' },
  { id: 4, client: 'James Wilson', type: 'Home Care', time: '10:00 AM - 1:00 PM', address: '321 Cedar Ln, Springfield', phone: '(555) 456-7890', status: 'upcoming', date: 'Tomorrow' },
  { id: 5, client: 'Sarah Brown', type: 'Transportation', time: '3:00 PM - 4:00 PM', address: '654 Birch St, Springfield', phone: '(555) 567-8901', status: 'completed', date: 'Yesterday' },
];

export default function EmployeeJobs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredJobs = allJobs.filter(job => {
    if (activeTab === 'upcoming') return job.status === 'upcoming';
    return job.status === 'completed';
  });

  const groupedJobs = filteredJobs.reduce((acc, job) => {
    if (!acc[job.date]) acc[job.date] = [];
    acc[job.date].push(job);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('EmployeeDashboard'))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">My Assignments</h1>
        </div>
        
        <div className="px-4 pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-gray-100">
              <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Jobs List */}
      <div className="px-4 pt-4">
        {Object.entries(groupedJobs).map(([date, jobs]) => (
          <div key={date} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {date}
            </h2>
            <div className="space-y-3">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{job.client}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {job.type}
                      </span>
                    </div>
                    {job.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <Check className="w-4 h-4" />
                        Done
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {job.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {job.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {job.phone}
                    </div>
                  </div>
                  
                  {job.status === 'upcoming' && (
                    <div className="flex gap-2">
                      <a 
                        href={`tel:${job.phone.replace(/[^0-9]/g, '')}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full rounded-xl">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </a>
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full rounded-xl bg-teal-600 hover:bg-teal-700">
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigate
                        </Button>
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No {activeTab} assignments</p>
          </div>
        )}
      </div>
    </div>
  );
}