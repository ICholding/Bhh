import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function ConvertToJobWizard({ request, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  
  const [jobData, setJobData] = useState({
    title: '',
    serviceType: request.serviceType,
    location: request.address || {},
    scheduledStart: request.requestedDateTime || '',
    estimatedDurationMinutes: 120,
    payRate: '',
    requirements: [],
    needsTemplateId: '',
    clientName: request.clientName,
    clientPhone: request.clientPhone,
    specialInstructions: request.notes || ''
  });

  const handleAISuggest = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Convert this client request into a structured job listing:
        
Service Type: ${request.serviceType}
Client: ${request.clientName}
Notes: ${request.notes}

Return a JSON object with:
- title: A clear job title
- requirements: Array of 3-5 specific requirements
- estimatedDurationMinutes: Realistic estimate
- suggestedPayRate: Pay rate description

Be specific and professional.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            requirements: { type: "array", items: { type: "string" } },
            estimatedDurationMinutes: { type: "number" },
            suggestedPayRate: { type: "string" }
          }
        }
      });

      setAiSuggestions(response);
      setJobData(prev => ({
        ...prev,
        title: response.title,
        requirements: response.requirements,
        estimatedDurationMinutes: response.estimatedDurationMinutes,
        payRate: response.suggestedPayRate
      }));
    } catch (error) {
      console.error('AI suggestion failed:', error);
    }
    setLoading(false);
  };

  const handleCreateJob = async () => {
    setLoading(true);
    try {
      const newJob = await base44.entities.JobListing.create({
        ...jobData,
        requestId: request.id,
        status: 'Posted'
      });

      await base44.entities.ClientRequest.update(request.id, {
        status: 'ConvertedToJob'
      });

      await base44.entities.JobMessage.create({
        jobId: newJob.id,
        fromRole: 'Admin',
        fromName: 'System',
        message: `Job created from client request by ${request.clientName}`
      });

      onComplete?.(newJob);
      onClose();
    } catch (error) {
      console.error('Job creation failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-[#1F3A5F]">Convert to Job</h2>
            <p className="text-sm text-[#5F7D95] mt-1">Step {step} of 2</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-[#1F3A5F]">AI Assistant</span>
                  </div>
                  <Button 
                    onClick={handleAISuggest}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500"
                  >
                    {loading ? 'Generating...' : 'Auto-Generate Job Details'}
                  </Button>
                </div>

                <div>
                  <Label className="text-[#5F7D95] mb-2 block">Job Title</Label>
                  <Input
                    value={jobData.title}
                    onChange={(e) => setJobData({...jobData, title: e.target.value})}
                    placeholder="e.g., Personal Care Assistant for Senior Client"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-[#5F7D95] mb-2 block">Requirements</Label>
                  <Textarea
                    value={jobData.requirements.join('\n')}
                    onChange={(e) => setJobData({...jobData, requirements: e.target.value.split('\n').filter(Boolean)})}
                    placeholder="Enter each requirement on a new line"
                    className="min-h-[120px] rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#5F7D95] mb-2 block flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration (minutes)
                    </Label>
                    <Input
                      type="number"
                      value={jobData.estimatedDurationMinutes}
                      onChange={(e) => setJobData({...jobData, estimatedDurationMinutes: parseInt(e.target.value)})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-[#5F7D95] mb-2 block flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Pay Rate
                    </Label>
                    <Input
                      value={jobData.payRate}
                      onChange={(e) => setJobData({...jobData, payRate: e.target.value})}
                      placeholder="e.g., $25/hour"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-[#5F7D95] mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Scheduled Start
                  </Label>
                  <Input
                    type="datetime-local"
                    value={jobData.scheduledStart}
                    onChange={(e) => setJobData({...jobData, scheduledStart: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-[#5F7D95] mb-2 block">Location</Label>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-900">{jobData.location.street}</p>
                    <p className="text-sm text-gray-600">
                      {jobData.location.city}, {jobData.location.state} {jobData.location.zip}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-[#5F7D95] mb-2 block">Special Instructions</Label>
                  <Textarea
                    value={jobData.specialInstructions}
                    onChange={(e) => setJobData({...jobData, specialInstructions: e.target.value})}
                    placeholder="Any special notes for the employee..."
                    className="min-h-[100px] rounded-xl"
                  />
                </div>

                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 mb-1">Ready to Post</p>
                      <p className="text-sm text-green-700">
                        This job will be visible to all available employees. They can accept it and start working.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="ghost"
            onClick={() => step === 1 ? onClose() : setStep(1)}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={() => step === 1 ? setStep(2) : handleCreateJob()}
            disabled={loading || !jobData.title}
            className="bg-gradient-to-r from-blue-600 to-teal-500"
          >
            {loading ? 'Creating...' : step === 1 ? 'Next' : 'Create Job'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}