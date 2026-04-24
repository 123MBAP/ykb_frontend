import { Star } from 'lucide-react';
import type { Review } from '../data/reviews';
import { appendJsonArrayItem, readJson } from '../utils/storage';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

interface ReviewSectionProps {
    reviews: Review[];
}

type StoredReview = Review & { createdAt: string };

export function ReviewSection({ reviews }: ReviewSectionProps) {
    const [storedReviews, setStoredReviews] = useState<StoredReview[]>([]);
    const [form, setForm] = useState({ author: '', title: '', rating: '5', text: '' });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setStoredReviews(readJson<StoredReview[]>('reviews', []));
    }, []);

    const allReviews = useMemo(() => {
        const seeded = reviews.map((r) => ({ ...r, createdAt: '' }));
        return [...storedReviews, ...seeded];
    }, [reviews, storedReviews]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const rating = Math.max(1, Math.min(5, Number(form.rating) || 5));
        const newReview: StoredReview = {
            id: Date.now(),
            author: form.author.trim(),
            title: form.title.trim(),
            rating,
            text: form.text.trim(),
            createdAt: new Date().toISOString(),
        };

        const next = appendJsonArrayItem<StoredReview>('reviews', newReview);
        setStoredReviews(next);
        setSubmitted(true);

        setTimeout(() => {
            setSubmitted(false);
            setForm({ author: '', title: '', rating: '5', text: '' });
        }, 800);
    };

    return (
        <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-black border-y border-primary/20">
            <div className="ykb-container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Join hundreds of satisfied clients who trust Your Kigali Bestie
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allReviews.map((review) => (
                        <div
                            key={review.id}
                            className="ykb-card ykb-card-hover p-7"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-serif font-semibold text-primary">{review.author}</h4>
                                    <p className="text-sm text-gray-500">{review.title}</p>
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 fill-primary text-primary"
                                    />
                                ))}
                            </div>

                            <p className="text-gray-300/80 leading-relaxed">{review.text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 max-w-2xl mx-auto">
                    <div className="ykb-surface p-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Leave a Review</h3>
                        <p className="text-gray-400 mb-6">This is a mocked form (saved in your browser for now).</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2" htmlFor="review-author">
                                    Your name
                                </label>
                                <input
                                    id="review-author"
                                    required
                                    className="ykb-field"
                                    value={form.author}
                                    onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                                    placeholder="e.g., Patrick"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2" htmlFor="review-title">
                                    Title
                                </label>
                                <input
                                    id="review-title"
                                    required
                                    className="ykb-field"
                                    value={form.title}
                                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g., Very helpful"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2" htmlFor="review-rating">
                                    Rating
                                </label>
                                <select
                                    id="review-rating"
                                    className="ykb-field"
                                    value={form.rating}
                                    onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option key={n} value={String(n)}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2" htmlFor="review-text">
                                    Review
                                </label>
                                <textarea
                                    id="review-text"
                                    required
                                    className="ykb-field min-h-[140px]"
                                    value={form.text}
                                    onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                                    placeholder="Write your experience..."
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full ykb-button-solid py-3 px-6 ${submitted ? 'opacity-70 cursor-not-allowed hover:bg-primary' : ''}`}
                                disabled={submitted}
                            >
                                {submitted ? 'Saved!' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
