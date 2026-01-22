import React from 'react';
import { Star } from 'lucide-react';

export default function WorkerReviews({ workerId }) {
  // Mock reviews data - in real app, fetch from ServiceReview entity filtered by worker_id
  const reviews = [
    {
      id: 1,
      client_name: 'Margaret T.',
      service_type: 'Home Care',
      rating: 5,
      comment: 'Michael was incredibly professional and caring. He went above and beyond to make sure my mother was comfortable. Highly recommend!',
      service_date: '2025-01-15',
      created_date: '2025-01-15'
    },
    {
      id: 2,
      client_name: 'Robert K.',
      service_type: 'Transportation',
      rating: 5,
      comment: 'Very punctual and friendly. Made the trip to my medical appointment stress-free.',
      service_date: '2025-01-12',
      created_date: '2025-01-12'
    },
    {
      id: 3,
      client_name: 'Helen M.',
      service_type: 'Companion Care',
      rating: 4,
      comment: 'Great service overall. Michael is patient and kind. Would definitely book again.',
      service_date: '2025-01-08',
      created_date: '2025-01-08'
    }
  ];

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">{reviews.length} reviews</div>
          </div>
          <div className="flex-1">
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-gray-600">{rating} ★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{review.client_name}</p>
                <p className="text-xs text-gray-500">{review.service_type} • {new Date(review.service_date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}