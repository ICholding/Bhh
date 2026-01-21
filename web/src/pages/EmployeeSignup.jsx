import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function EmployeeSignup() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  
  // Pre-fill data from registration if available
  const prefilledData = React.useMemo(() => {
    const stored = localStorage.getItem('employeeSignupData');
    if (stored) {
      const data = JSON.parse(stored);
      localStorage.removeItem('employeeSignupData'); // Clear after reading
      return data;
    }
    return {};
  }, []);

  const [formData, setFormData] = useState({
    firstName: prefilledData.firstName || '',
    lastName: prefilledData.lastName || '',
    email: prefilledData.email || '',
    phone: prefilledData.phone || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    roleInterest: '',
    availability: '',
    certifications: '',
    consent: false
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, submit to backend
    console.log('Employee Application:', formData);
    // Navigate to onboarding flow
    navigate(createPageUrl('WorkerOnboarding'));
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-3 flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('Landing'))}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="px-4 pt-8 pb-32 max-w-2xl mx-auto">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1F3A5F] mb-2">Join Blessed Hope Healthcare</h1>
          <p className="text-[#5F7D95]">Apply to become an employee.</p>
        </motion.div>

        {/* Application Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-[#1F3A5F] mb-6">Application Information</h2>
          
          <div className="space-y-5">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-[#5F7D95] mb-1.5 block">First Name *</Label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  placeholder="John"
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm text-[#5F7D95] mb-1.5 block">Last Name *</Label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  placeholder="Doe"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <Label className="text-sm text-[#5F7D95] mb-1.5 block">Email *</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => updateForm('email', e.target.value)}
                placeholder="john@example.com"
                className="h-12 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm text-[#5F7D95] mb-1.5 block">Mobile Phone *</Label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="h-12 rounded-xl"
              />
            </div>

            {/* Address */}
            <div>
              <Label className="text-sm text-[#5F7D95] mb-1.5 block">Street Address *</Label>
              <Input
                required
                value={formData.street}
                onChange={(e) => updateForm('street', e.target.value)}
                placeholder="123 Main Street"
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-[#5F7D95] mb-1.5 block">City *</Label>
                <Input
                  required
                  value={formData.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  placeholder="Springfield"
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm text-[#5F7D95] mb-1.5 block">State *</Label>
                <Input
                  required
                  value={formData.state}
                  onChange={(e) => updateForm('state', e.target.value)}
                  placeholder="IL"
                  className="h-12 rounded-xl"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm text-[#5F7D95] mb-1.5 block">ZIP Code *</Label>
              <Input
                required
                value={formData.zip}
                onChange={(e) => updateForm('zip', e.target.value)}
                placeholder="12345"
                className="h-12 rounded-xl"
                maxLength={5}
              />
            </div>

            {/* Role & Availability */}
            <div>
              <Label className="text-sm text-[#5F7D95] mb-1.5 block">Role Interest *</Label>
              <Select required value={formData.roleInterest} onValueChange={(v) => updateForm('roleInterest', v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caregiver">Caregiver</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="companion">Companion/Support</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-[#5F7D95] mb-1.5 block">Availability *</Label>
              <Select required value={formData.availability} onValueChange={(v) => updateForm('availability', v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Certifications */}
            <div>
              <Label className="text-sm text-[#5F7D95] mb-1.5 block">Certifications (Optional)</Label>
              <Input
                value={formData.certifications}
                onChange={(e) => updateForm('certifications', e.target.value)}
                placeholder="e.g., CNA, CPR, First Aid"
                className="h-12 rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-1">List any relevant certifications</p>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => updateForm('consent', checked)}
                className="mt-1"
                required
              />
              <Label htmlFor="consent" className="text-sm text-[#5F7D95] cursor-pointer leading-relaxed">
                I consent to be contacted about my application. *
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              disabled={!formData.consent}
              className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 disabled:opacity-50"
            >
              Continue Application
            </Button>
          </div>
        </motion.form>
      </div>


    </div>
  );
}