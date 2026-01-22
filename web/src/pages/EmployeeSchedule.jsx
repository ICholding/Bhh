import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, Clock, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopHeader from '@/components/branding/TopHeader';
import DailyScheduleView from '@/components/schedule/DailyScheduleView';
import WeeklyScheduleView from '@/components/schedule/WeeklyScheduleView';
import MonthlyScheduleView from '@/components/schedule/MonthlyScheduleView';
import ScheduleMapView from '@/components/schedule/ScheduleMapView';

export default function EmployeeSchedule() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('daily');

  // Mock job data - in real app, fetch from entities
  const jobs = [
    {
      id: 1,
      client_name: 'Margaret Thompson',
      service_type: 'Home Care',
      date: '2026-01-17',
      start_time: '09:00',
      end_time: '13:00',
      status: 'confirmed',
      address: '123 Oak Street, Boston, MA',
      lat: 42.3601,
      lng: -71.0589,
      notes: 'Client prefers morning visits. Mobility assistance needed.',
      rate: '$28/hr'
    },
    {
      id: 2,
      client_name: 'Robert Williams',
      service_type: 'Transportation',
      date: '2026-01-17',
      start_time: '14:30',
      end_time: '15:30',
      status: 'confirmed',
      address: '456 Elm Avenue, Cambridge, MA',
      lat: 42.3736,
      lng: -71.1097,
      notes: 'Medical appointment pickup',
      rate: '$25/hr'
    },
    {
      id: 3,
      client_name: 'Helen Martinez',
      service_type: 'Companion Care',
      date: '2026-01-18',
      start_time: '10:00',
      end_time: '14:00',
      status: 'pending',
      address: '789 Pine Road, Somerville, MA',
      lat: 42.3876,
      lng: -71.0995,
      notes: 'First time client',
      rate: '$26/hr'
    },
    {
      id: 4,
      client_name: 'James Anderson',
      service_type: 'Home Care',
      date: '2026-01-19',
      start_time: '09:00',
      end_time: '12:00',
      status: 'confirmed',
      address: '321 Maple Drive, Brookline, MA',
      lat: 42.3318,
      lng: -71.1212,
      notes: 'Regular weekly visit',
      rate: '$28/hr'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopHeader
        showBack
        onBack={() => navigate(createPageUrl('EmployeeDashboard'))}
        title="My Schedule"
      />

      <div className="px-4 pt-4">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-0">
            <DailyScheduleView 
              jobs={jobs}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <WeeklyScheduleView 
              jobs={jobs}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="monthly" className="mt-0">
            <MonthlyScheduleView 
              jobs={jobs}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <ScheduleMapView 
              jobs={jobs.filter(j => j.status === 'confirmed')}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => navigate(createPageUrl('EmployeeDashboard'))}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">Schedule</span>
          </button>
          <button
            onClick={() => navigate(createPageUrl('EmployeeChat'))}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}