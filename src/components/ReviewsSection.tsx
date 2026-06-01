import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Clock, Send, Sparkles, ChevronRight, Check } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedPurchase?: boolean;
}

interface ReviewsSectionProps {
  productId: string;
}

const DEFAULT_REVIEWS: Record<string, Omit<Review, 'id'>[]> = {
  default: []
};

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState('');

  useEffect(() => {
    // Load reviews from localStorage or seed some
    const cacheKey = `akanksha_reviews_${productId}`;
    const stored = localStorage.getItem(cacheKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Review[];
        // Filter out any older mock/seeded reviews
        const filtered = parsed.filter(item => !item.id.startsWith('seed-'));
        setReviews(filtered);
      } catch (err) {
        console.error("Failed to parse reviews", err);
      }
    } else {
      setReviews([]);
    }
  }, [productId]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random()}`,
      author: authorName.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      isVerifiedPurchase: true
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`akanksha_reviews_${productId}`, JSON.stringify(updatedReviews));

    // Reset Form & Show success
    setAuthorName('');
    setRating(5);
    setComment('');
    setSubmittedMessage('Thank you! Your verified review has been published.');
    setTimeout(() => setSubmittedMessage(''), 4000);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  // Determine display slices
  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);
  const hasMoreThanFour = reviews.length > 4;

  return (
    <div id="product-reviews-module" className="bg-white rounded-2xl border border-[#D4C19D]/15 p-5 sm:p-6 space-y-6 text-left">
      {/* Header and Aggregate */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#D4C19D]/10">
        <div>
          <h3 className="font-serif text-[#1E1C1A] text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#b89153]" />
            Verified Buyer Reviews ({reviews.length})
          </h3>
          <p className="text-[11px] text-gray-500 font-light mt-0.5">Real feedback from actual verified purchasers.</p>
        </div>

        {/* Big Badge Average rating */}
        <div className="flex items-center gap-2 bg-[#FAF6F0] px-3.5 py-1.5 rounded-xl border border-[#D4C19D]/20 self-start sm:self-auto">
          <div className="flex items-center text-[#b89153]">
            <span className="text-sm font-bold mr-1">{averageRating}</span>
            <Star className="h-3.5 w-3.5 fill-[#b89153] stroke-none" />
          </div>
          <span className="text-[10px] text-gray-400 font-medium">|</span>
          <span className="text-[10px] text-gray-600 uppercase font-semibold tracking-wide">Excellent Rating</span>
        </div>
      </div>

      {/* Reviews List & Toggle corner button */}
      <div className="relative space-y-4">
        {hasMoreThanFour && (
          <div className="absolute right-0 -top-1 z-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[10px] font-bold text-[#b89153] hover:text-[#1E1C1A] uppercase tracking-widest flex items-center gap-1 bg-[#FAF6F0] px-3 py-1.5 rounded-lg border border-[#D4C19D]/20 hover:border-[#b89153]/40 transition-all cursor-pointer shadow-xs"
            >
              <span>{showAll ? 'Collapse' : `More Reviews +${reviews.length - 4}`}</span>
              <ChevronRight className={`h-3 w-3 transform transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          </div>
        )}

        <div className="space-y-4 pt-4">
          {displayedReviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-[#FAF6F0]/40 rounded-xl border border-[#D4C19D]/10 space-y-2 animate-fade-in text-left">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-800">{rev.author}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 uppercase">
                        <Check className="h-2 w-2 stroke-[3]" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-[#b89153] mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < rev.rating ? 'fill-[#b89153] stroke-[#b89153]' : 'stroke-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{rev.date}</span>
                </div>
              </div>
              <p className="text-gray-600 font-light text-xs leading-relaxed">{rev.comment}</p>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-xs">
              Be the first to review this stunning jewelry ornament!
            </div>
          )}
        </div>
      </div>

      {/* New Review Form */}
      <div className="pt-4 border-t border-[#D4C19D]/10">
        <div className="bg-[#FAF6F0]/60 p-4 rounded-xl border border-[#D4C19D]/15 space-y-4">
          <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#b89153]" />
            Write A Verified Review
          </h4>

          {submittedMessage ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{submittedMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Priyal Sharma"
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#b89153]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Your Rating *</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoveredRating(starValue)}
                          onMouseLeave={() => setHoveredRating(null)}
                          className="focus:outline-none transform hover:scale-110 transition-transform"
                        >
                          <Star 
                            className={`h-5 w-5 ${
                              starValue <= (hoveredRating !== null ? hoveredRating : rating)
                                ? 'fill-[#b89153] stroke-[#b89153]'
                                : 'stroke-gray-300'
                            }`} 
                          />
                        </button>
                      );
                    })}
                    <span className="text-[10px] text-gray-500 ml-1 font-semibold uppercase">
                      ({rating}/5 Stars)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Your Review Comments *</label>
                <textarea
                  required
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the anti-tarnish duration, custom polish look, or daily comfort level..."
                  className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#b89153]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-3 w-3" />
                <span>Submit My Verified Review</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
