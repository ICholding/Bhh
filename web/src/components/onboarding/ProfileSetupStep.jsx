import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

export default function ProfileSetupStep({ onNext, initialData }) {
  const [formData, setFormData] = useState({
    bio: initialData?.bio || '',
    yearsExperience: initialData?.yearsExperience || '',
    zipCode: initialData?.zipCode || '',
    travelRadius: initialData?.travelRadius || '10',
    services: initialData?.services || [],
    availability: initialData?.availability || []
  });

  const serviceOptions = [
    'Home Care',
    'Companion Care',
    'Transportation',
    'Meal Preparation',
    'Light Housekeeping',
    'Personal Care',
    'Medication Reminders',
    'Errands & Shopping'
  ];

  const availabilityOptions = [
    'Monday - Morning',
    'Monday - Afternoon',
    'Monday - Evening',
    'Tuesday - Morning',
    'Tuesday - Afternoon',
    'Tuesday - Evening',
    'Wednesday - Morning',
    'Wednesday - Afternoon',
    'Wednesday - Evening',
    'Thursday - Morning',
    'Thursday - Afternoon',
    'Thursday - Evening',
    'Friday - Morning',
    'Friday - Afternoon',
    'Friday - Evening',
    'Saturday - Morning',
    'Saturday - Afternoon',
    'Saturday - Evening',
    'Sunday - Morning',
    'Sunday - Afternoon',
    'Sunday - Evening'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ profile: formData });
  };

  const toggleService = (service) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter(s => s !== service)
        : [...formData.services, service]
    });
  };

  const toggleAvailability = (slot) => {
    setFormData({
      ...formData,
      availability: formData.availability.includes(slot)
        ? formData.availability.filter(s => s !== slot)
        : [...formData.availability, slot]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Build Your Profile</h2>
        
        {/* Bio */}
        <div className="mb-6">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell clients about your experience and what makes you a great caregiver..."
            className="mt-2 min-h-24"
            required
          />
        </div>

        {/* Experience */}
        <div className="mb-6">
          <Label htmlFor="experience">Years of Experience</Label>
          <div className="flex items-center gap-2 mt-2">
            <Award className="w-5 h-5 text-gray-400" />
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              placeholder="e.g., 5"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="02108"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="radius">Travel Radius (miles)</Label>
            <Input
              id="radius"
              type="number"
              min="1"
              max="50"
              value={formData.travelRadius}
              onChange={(e) => setFormData({ ...formData, travelRadius: e.target.value })}
              className="mt-2"
              required
            />
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <Label className="mb-3 block">Services You Provide</Label>
          <div className="grid grid-cols-2 gap-3">
            {serviceOptions.map(service => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={formData.services.includes(service)}
                  onCheckedChange={() => toggleService(service)}
                />
                <label
                  htmlFor={service}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <Label className="mb-3 block">Your Availability</Label>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-lg">
            {availabilityOptions.map(slot => (
              <div key={slot} className="flex items-center space-x-2">
                <Checkbox
                  id={slot}
                  checked={formData.availability.includes(slot)}
                  onCheckedChange={() => toggleAvailability(slot)}
                />
                <label
                  htmlFor={slot}
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  {slot}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600"
        disabled={formData.services.length === 0 || formData.availability.length === 0}
      >
        Continue to Documents
      </Button>
    </form>
  );
}