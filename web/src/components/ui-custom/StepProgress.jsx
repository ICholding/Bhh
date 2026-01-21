import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { number: 1, label: 'Account' },
  { number: 2, label: 'Billing' },
  { number: 3, label: 'Membership' }
];

export default function StepProgress({ currentStep = 1 }) {
  return (
    <div className="flex items-center justify-center gap-2 py-6 px-4 w-full max-w-full overflow-x-hidden">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
              ${currentStep > step.number 
                ? 'bg-green-500 text-white' 
                : currentStep === step.number 
                  ? 'bg-blue-600 text-white ring-4 ring-blue-200' 
                  : 'bg-gray-200 text-gray-500'}
            `}>
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span className={`text-xs mt-2 font-medium ${
              currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 rounded-full max-w-16 -mt-6 ${
              currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
            }`} key={`line-${step.number}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}