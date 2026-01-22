import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StepProgress from '@/components/ui-custom/StepProgress';
import ProfileSetupStep from '@/components/onboarding/ProfileSetupStep';
import DocumentVerificationStep from '@/components/onboarding/DocumentVerificationStep';
import AppTutorialStep from '@/components/onboarding/AppTutorialStep';
import SkillsAssessmentStep from '@/components/onboarding/SkillsAssessmentStep';

export default function WorkerOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    profile: {},
    documents: {},
    tutorialCompleted: false,
    assessment: {}
  });

  const steps = [
    { number: 1, title: 'Profile Setup' },
    { number: 2, title: 'Documents' },
    { number: 3, title: 'Tutorial' },
    { number: 4, title: 'Skills Assessment' }
  ];

  const handleNext = (stepData) => {
    setOnboardingData({ ...onboardingData, ...stepData });
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate(createPageUrl('EmployeeDashboard'));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {currentStep > 1 && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Worker Onboarding</h1>
            <p className="text-sm text-gray-500">Step {currentStep} of 4</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4 pb-6 max-w-2xl mx-auto">
        <StepProgress steps={steps} currentStep={currentStep} />
      </div>

      {/* Content */}
      <div className="px-4 pb-8 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <ProfileSetupStep onNext={handleNext} initialData={onboardingData.profile} />
            )}
            {currentStep === 2 && (
              <DocumentVerificationStep onNext={handleNext} initialData={onboardingData.documents} />
            )}
            {currentStep === 3 && (
              <AppTutorialStep onNext={handleNext} />
            )}
            {currentStep === 4 && (
              <SkillsAssessmentStep onNext={handleNext} initialData={onboardingData.assessment} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}