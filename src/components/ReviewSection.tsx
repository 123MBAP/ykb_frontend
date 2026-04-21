import { Star } from 'lucide-react';
import type { Review } from '../data/reviews';

interface ReviewSectionProps {
    reviews: Review[];
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black border-y border-primary">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Join hundreds of satisfied clients who trust Your Kigali Bestie
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-dark-light border border-primary p-6 hover:bg-black transition-colors"
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

                            <p className="text-gray-400 leading-relaxed">{review.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
