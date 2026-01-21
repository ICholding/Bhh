import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ServiceFeedbackModal({ isOpen, onClose, service }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    // In a real app, this would save to the ServiceReview entity
    console.log('Review submitted:', {
      worker_id: service.workerId,
      worker_name: service.provider,
      client_name: 'Current User',
      service_type: service.service,
      rating,
      comment,
      service_date: service.date
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setComment('');
    }, 2000);
  };

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Rate Your Service</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {submitted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Thank You!
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your feedback helps us improve our services
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  {/* Service Info */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Service Provider</p>
                    <p className="font-semibold text-gray-900">{service.provider}</p>
                    <p className="text-sm text-gray-600 mt-1">{service.service}</p>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      How would you rate this service?
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`w-10 h-10 ${
                              star <= (hoveredRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Additional Comments (Optional)
                    </p>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="min-h-24 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white h-12 rounded-xl"
                  >
                    Submit Review
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}