import React, { useState } from 'react';
import { Award, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function SkillsAssessmentStep({ onNext, initialData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(initialData?.answers || []);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: 'When assisting a client with mobility issues, what is the most important first step?',
      options: [
        'Help them stand up immediately',
        'Assess their current mobility level and ask about their comfort',
        'Give them a walker without instruction',
        'Tell them to try on their own first'
      ],
      correct: 1
    },
    {
      question: 'A client mentions they missed their medication this morning. What should you do?',
      options: [
        'Give them the medication immediately',
        'Document the situation and contact their healthcare provider or family',
        'Tell them it\'s okay to skip it',
        'Double their next dose'
      ],
      correct: 1
    },
    {
      question: 'What is the best approach when a client seems withdrawn or sad?',
      options: [
        'Leave them alone',
        'Try to cheer them up with jokes',
        'Listen actively, show empathy, and report concerns to supervisors',
        'Tell them to think positive'
      ],
      correct: 2
    },
    {
      question: 'When transporting a client, safety priorities include:',
      options: [
        'Getting there as fast as possible',
        'Securing seatbelts, checking comfort, and driving carefully',
        'Listening to loud music',
        'Answering phone calls while driving'
      ],
      correct: 1
    },
    {
      question: 'If you notice signs of potential abuse or neglect, you should:',
      options: [
        'Ignore it if you\'re not sure',
        'Confront the suspected person',
        'Report it immediately to your supervisor and appropriate authorities',
        'Talk to the client\'s family first'
      ],
      correct: 2
    }
  ];

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  const handleComplete = () => {
    const score = calculateScore();
    onNext({ 
      assessment: { 
        answers, 
        score,
        total: questions.length 
      } 
    });
  };

  if (showResult) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <Award className={`w-10 h-10 ${passed ? 'text-green-600' : 'text-yellow-600'}`} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Great Job!' : 'Assessment Complete'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            You scored {score} out of {questions.length} ({percentage.toFixed(0)}%)
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Your Results</h3>
            <div className="space-y-2 text-left">
              {questions.map((q, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  {answers[index] === q.correct ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-gray-700">Question {index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {passed ? (
            <p className="text-green-700 text-sm mb-6">
              ✓ You've demonstrated strong caregiving knowledge. You're ready to start!
            </p>
          ) : (
            <p className="text-yellow-700 text-sm mb-6">
              You can start working, but we recommend reviewing our training materials.
            </p>
          )}
        </div>

        <Button 
          onClick={handleComplete}
          className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600"
        >
          Complete Onboarding
        </Button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Skills Assessment</h2>
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg text-gray-900 mb-6">{question.question}</p>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    answers[currentQuestion] === index
                      ? 'border-teal-600 bg-teal-600'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <p className="text-gray-900">{option}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}