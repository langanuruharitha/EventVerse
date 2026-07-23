'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Star, User, MessageSquare } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

interface Review {
  id: string;
  rating: number;
  title: string;
  review_text: string;
  created_at: string;
  users: {
    email: string;
  };
}

export default function ProductReviews({ productId }: { productId: string }) {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
    checkUser();
  }, [productId]);

  const checkUser = async () => {
    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: newRating,
          title: newTitle,
          review_text: newReviewText,
        })
      });
      
      if (res.ok) {
        toast('Review submitted successfully!', 'success');
        setNewTitle('');
        setNewReviewText('');
        setNewRating(5);
        setShowForm(false);
        fetchReviews();
      } else {
        toast('Failed to submit review.', 'error');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast('An error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg mt-12"></div>;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <Button 
          onClick={() => {
            if (!user) router.push('/auth/signin');
            else setShowForm(!showForm);
          }}
          variant="outline"
          className="gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8 bg-purple-50 border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-lg">Write your review</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                required
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Brief summary of your review"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea
                required
                value={newReviewText}
                onChange={e => setNewReviewText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="What did you like or dislike?"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Card>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">{review.title}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{review.review_text}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{review.users?.email?.split('@')[0] || 'Customer'}</span>
                    <span>•</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
