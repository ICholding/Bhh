import React, { useState } from 'react';
import { Calendar, MessageCircle, Star, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AppTutorialStep({ onNext }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const tutorials = [
    {
      icon: Calendar,
      title: 'Managing Your Schedule',
      description: 'View daily, weekly, and monthly calendars. Accept or decline jobs with one tap.',
      features: [
        'See all assignments at a glance',
        'Accept, decline, or request changes',
        'Get navigation to job locations',
        'Set your availability preferences'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Communication Tools',
      description: 'Stay connected with clients, support team, and AI assistance.',
      features: [
        'Chat with BHH support 24/7',
        'Get AI-powered job recommendations',
        'Receive real-time updates',
        'Report issues instantly'
      ]
    },
    {
      icon: Star,
      title: 'Performance & Feedback',
      description: 'Build your reputation and earn more opportunities.',
      features: [
        'Receive client reviews and ratings',
        'Track your performance metrics',
        'Earn badges and certifications',
        'Get matched to better-paying jobs'
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < tutorials.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext({ tutorialCompleted: true });
    }
  };

  const tutorial = tutorials[currentSlide];
  const Icon = tutorial.icon;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{tutorial.title}</h2>
          <p className="text-gray-600 mb-6">{tutorial.description}</p>

          {/* Features */}
          <div className="space-y-3">
            {tutorial.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {tutorials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-teal-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      <Button 
        onClick={handleNext}
        className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600"
      >
        {currentSlide < tutorials.length - 1 ? (
          <>
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </>
        ) : (
          'Continue to Skills Assessment'
        )}
      </Button>

      {currentSlide > 0 && (
        <Button 
          onClick={() => setCurrentSlide(currentSlide - 1)}
          variant="outline"
          className="w-full"
        >
          Previous
        </Button>
      )}
    </div>
  );
}