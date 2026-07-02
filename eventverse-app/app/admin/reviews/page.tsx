'use client';

import { useState } from 'react';

const mockSystemReviews = [
  { id: 1, customer: 'Vikram Patel', vendor: 'Epic Moments Photography', service: 'Wedding Photography', rating: 5, date: '2026-07-10', comment: 'Absolutely fantastic work! Every photo was a masterpiece. Captures every precious moment.', status: 'approved' },
  { id: 2, customer: 'Sunita Rao', vendor: 'Dream Decorators', service: 'Pre-Wedding Shoot', rating: 5, date: '2026-06-28', comment: 'Very professional, made us feel comfortable. The photos came out stunning.', status: 'approved' },
  { id: 3, customer: 'Deepak Kumar', vendor: 'Golden Catering Services', service: 'Birthday Photography', rating: 2, date: '2026-06-15', comment: 'Catering staff was rude. Food quality was not up to the standard pricing.', status: 'flagged' },
  { id: 4, customer: 'Pooja Nair', vendor: 'Epic Moments Photography', service: 'Wedding Photography', rating: 5, date: '2026-05-30', comment: 'Captured all emotions beautifully. The candid shots were our favorite!', status: 'approved' },
  { id: 5, customer: 'Arjun Sharma', vendor: 'Dream Decorators', service: 'Pre-Wedding Shoot', rating: 1, date: '2026-05-10', comment: 'Scam vendor! Stole our money and never delivered the final edits.', status: 'flagged' },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockSystemReviews);
  const [filter, setFilter] = useState('all');

  const updateReviewStatus = (id: number, newStatus: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews Moderation ⭐</h1>
        <p className="text-gray-500 mt-1">Moderate user reviews, ratings, and content flags</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'approved', 'flagged'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab === 'all' ? 'All Reviews' : tab}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-gray-500 font-medium">No reviews found matching filter</p>
          </div>
        ) : filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {review.customer.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900">{review.customer}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500">For <span className="font-bold">{review.vendor}</span> ({review.service})</p>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">{review.comment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-start">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize mr-2 ${
                  review.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {review.status}
                </span>
                {review.status === 'flagged' && (
                  <>
                    <button
                      onClick={() => updateReviewStatus(review.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all"
                    >
                      Keep Review
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review.id, 'deleted')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-all"
                    >
                      Delete Review
                    </button>
                  </>
                )}
                {review.status === 'approved' && (
                  <button
                    onClick={() => updateReviewStatus(review.id, 'flagged')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 transition-all"
                  >
                    Flag / Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
