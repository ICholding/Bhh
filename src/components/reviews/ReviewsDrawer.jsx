import React, { useState } from 'react';
import { X, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const reviews = [
  {
    id: 1,
    name: 'Maria S.',
    rating: 5,
    date: '2 weeks ago',
    text: 'BHH has been a blessing for my elderly mother. The caregivers are professional, kind, and always on time. I can finally have peace of mind knowing she\'s in good hands.',
    expanded: false
  },
  {
    id: 2,
    name: 'James T.',
    rating: 5,
    date: '1 month ago',
    text: 'Outstanding service! The transportation help for my medical appointments has made such a difference. Drivers are courteous and the scheduling is seamless.',
    expanded: false
  },
  {
    id: 3,
    name: 'Patricia L.',
    rating: 5,
    date: '1 month ago',
    text: 'As a family caregiver, I needed respite care support. BHH matched us with wonderful helpers who truly care. Highly recommend their services!',
    expanded: false
  },
  {
    id: 4,
    name: 'Robert K.',
    rating: 4,
    date: '2 months ago',
    text: 'Very reliable home care services. The team is responsive and always follows up to ensure everything is going well. Great communication throughout.',
    expanded: false
  },
  {
    id: 5,
    name: 'Linda M.',
    rating: 5,
    date: '2 months ago',
    text: 'The companion care service has been wonderful for my father who lives alone. His caregiver has become like family. Thank you BHH!',
    expanded: false
  },
  {
    id: 6,
    name: 'David H.',
    rating: 5,
    date: '3 months ago',
    text: 'Professional and compassionate care. The entire process from signup to receiving care was smooth. Their customer support is excellent.',
    expanded: false
  }
];

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 120;
  
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
            {review.name[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{review.name}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {expanded || !isLong ? review.text : `${review.text.slice(0, 120)}...`}
      </p>
      {isLong && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

export default function ReviewsDrawer({ isOpen, onClose }) {
  const [visibleCount, setVisibleCount] = useState(4);
  
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, reviews.length));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">4.9</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(128 reviews)</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {reviews.slice(0, visibleCount).map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
              
              {visibleCount < reviews.length && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={loadMore}
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Load more reviews
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}