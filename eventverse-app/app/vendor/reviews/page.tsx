'use client';

const mockReviews = [
  { id: 1, customer: 'Vikram Patel', service: 'Wedding Photography', rating: 5, date: '2026-07-10', comment: 'Absolutely fantastic work! Every photo was a masterpiece. The photographer was professional, creative, and captured every precious moment perfectly. Highly recommend!', avatar: 'V' },
  { id: 2, customer: 'Sunita Rao', service: 'Pre-Wedding Shoot', rating: 5, date: '2026-06-28', comment: 'Loved the experience! Very professional and made us feel comfortable throughout the shoot. The photos came out stunning.', avatar: 'S' },
  { id: 3, customer: 'Deepak Kumar', service: 'Birthday Photography', rating: 4, date: '2026-06-15', comment: 'Great work overall. Photos were delivered on time and quality was very good. Would book again.', avatar: 'D' },
  { id: 4, customer: 'Pooja Nair', service: 'Wedding Photography', rating: 5, date: '2026-05-30', comment: 'Best wedding photographer in the city! Captured all emotions beautifully. The candid shots were our favorite.', avatar: 'P' },
  { id: 5, customer: 'Arjun Sharma', service: 'Pre-Wedding Shoot', rating: 3, date: '2026-05-10', comment: 'Good service, but delivery was slightly delayed. Photos were nice though.', avatar: 'A' },
];

const ratingDist = [
  { stars: 5, count: 22, pct: 69 },
  { stars: 4, count: 7, pct: 22 },
  { stars: 3, count: 2, pct: 6 },
  { stars: 2, count: 1, pct: 3 },
  { stars: 1, count: 0, pct: 0 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
    </div>
  );
}

export default function VendorReviewsPage() {
  const avgRating = (mockReviews.reduce((a, r) => a + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews ⭐</h1>
        <p className="text-gray-500 mt-1">See what your customers are saying about your services</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-8 flex-wrap">
          <div className="text-center">
            <p className="text-6xl font-bold text-gray-900">{avgRating}</p>
            <StarRating rating={Math.round(Number(avgRating))} />
            <p className="text-sm text-gray-500 mt-2">{mockReviews.length} total reviews</p>
          </div>
          <div className="flex-1 min-w-48 space-y-2">
            {ratingDist.map(({ stars, count, pct }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{stars}★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {mockReviews.map(review => (
          <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#8A1C2C] text-[#FAF0E0] font-sans flex items-center justify-center font-bold text-lg flex-shrink-0">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <div>
                    <p className="font-bold text-gray-900">{review.customer}</p>
                    <p className="text-sm text-gray-500">{review.service}</p>
                  </div>
                  <p className="text-sm text-gray-400">{review.date}</p>
                </div>
                <StarRating rating={review.rating} />
                <p className="text-gray-700 mt-3 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
