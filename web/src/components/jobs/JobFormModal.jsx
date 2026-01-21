import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function JobFormModal({ isOpen, onClose, editingJob }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(editingJob || {
    client_name: '',
    client_phone: '',
    client_address: '',
    service_type: '',
    date: '',
    start_time: '',
    end_time: '',
    duration_hours: '',
    rate: '',
    priority: 'medium',
    special_instructions: '',
    notes: '',
    status: 'pending'
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Job.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Job.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      onClose();
    }
  });

  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const duration = (endH * 60 + endM - startH * 60 - startM) / 60;
    return duration > 0 ? duration.toFixed(1) : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const duration = calculateDuration(formData.start_time, formData.end_time);
    const dataToSubmit = { ...formData, duration_hours: parseFloat(duration) };
    
    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingJob ? 'Edit Job' : 'Create New Job'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Client Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Client Information</h3>
            <div>
              <Label>Client Name *</Label>
              <Input
                required
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={formData.client_phone}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label>Service Type *</Label>
                <Select 
                  value={formData.service_type} 
                  onValueChange={(v) => setFormData({ ...formData, service_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Care">Home Care</SelectItem>
                    <SelectItem value="Companion Care">Companion Care</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Meal Preparation">Meal Preparation</SelectItem>
                    <SelectItem value="Light Housekeeping">Light Housekeeping</SelectItem>
                    <SelectItem value="Personal Care">Personal Care</SelectItem>
                    <SelectItem value="Medication Reminders">Medication Reminders</SelectItem>
                    <SelectItem value="Errands & Shopping">Errands & Shopping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={formData.client_address}
                onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                placeholder="123 Main St, Boston, MA"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Schedule</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Date *</Label>
                <Input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Start Time *</Label>
                <Input
                  required
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setFormData({ 
                      ...formData, 
                      start_time: newStart,
                      duration_hours: calculateDuration(newStart, formData.end_time)
                    });
                  }}
                />
              </div>
              <div>
                <Label>End Time *</Label>
                <Input
                  required
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => {
                    const newEnd = e.target.value;
                    setFormData({ 
                      ...formData, 
                      end_time: newEnd,
                      duration_hours: calculateDuration(formData.start_time, newEnd)
                    });
                  }}
                />
              </div>
            </div>
            {formData.start_time && formData.end_time && (
              <p className="text-sm text-gray-600">
                Duration: {calculateDuration(formData.start_time, formData.end_time)} hours
              </p>
            )}
          </div>

          {/* Job Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Job Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Priority *</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hourly Rate</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="25.00"
                />
              </div>
            </div>
            <div>
              <Label>Special Instructions</Label>
              <Textarea
                value={formData.special_instructions}
                onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                placeholder="Any special requirements or instructions..."
                rows={3}
              />
            </div>
            <div>
              <Label>Internal Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Admin notes..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-500">
              {editingJob ? 'Update' : 'Create'} Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}