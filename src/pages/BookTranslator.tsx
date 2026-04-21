import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Languages } from 'lucide-react';

interface FormData {
    language: string;
    duration: string;
}

export function BookTranslator() {
    const [formData, setFormData] = useState<FormData>({
        language: '',
        duration: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target as HTMLSelectElement | HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Translator booking form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            alert('Translation request submitted! We will contact you shortly.');
            setSubmitted(false);
            setFormData({ language: '', duration: '' });
        }, 500);
    };

    return (
        <main>
            {/* Header */}
            <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center space-x-3 mb-4">
                        <Languages className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                            Book a Translator
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400">
                        Professional translation services in English and French
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-light">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-black border border-primary p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Language Selection */}
                            <div>
                                <label htmlFor="language" className="block text-lg font-serif font-semibold text-primary mb-3">
                                    Which language do you need?
                                </label>
                                <select
                                    id="language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-primary bg-dark-light text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">Select a language</option>
                                    <option value="english">English</option>
                                    <option value="french">French</option>
                                    <option value="both">Both (English & French)</option>
                                </select>
                            </div>

                            {/* Duration */}
                            <div>
                                <label htmlFor="duration" className="block text-lg font-serif font-semibold text-primary mb-3">
                                    What is the duration needed?
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="duration"
                                            value="hourly"
                                            checked={formData.duration === 'hourly'}
                                            onChange={handleChange}
                                            required
                                            className="w-5 h-5 text-primary border-primary bg-dark-light"
                                        />
                                        <span className="text-gray-400 font-medium">Hourly</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="duration"
                                            value="weekly"
                                            checked={formData.duration === 'weekly'}
                                            onChange={handleChange}
                                            required
                                            className="w-5 h-5 text-primary border-primary bg-dark-light"
                                        />
                                        <span className="text-gray-400 font-medium">Weekly</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="duration"
                                            value="monthly"
                                            checked={formData.duration === 'monthly'}
                                            onChange={handleChange}
                                            required
                                            className="w-5 h-5 text-primary border-primary bg-dark-light"
                                        />
                                        <span className="text-gray-400 font-medium">Monthly</span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitted}
                                className={`w-full py-3 px-6 font-semibold text-black transition-colors ${submitted
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-primary hover:bg-secondary'
                                    }`}
                            >
                                {submitted ? 'Submitting...' : 'Book Translator Now'}
                            </button>
                        </form>
                    </div>

                    {/* Service Info */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black border border-primary p-6">
                            <h3 className="font-serif font-semibold text-primary mb-3">Why Our Translators?</h3>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>✓ Native speakers with cultural knowledge</li>
                                <li>✓ Professional and experienced</li>
                                <li>✓ Available for meetings, calls, and documents</li>
                                <li>✓ Flexible scheduling</li>
                            </ul>
                        </div>

                        <div className="bg-black border border-primary p-6">
                            <h3 className="font-serif font-semibold text-primary mb-3">What We Cover</h3>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>✓ Business meetings and negotiations</li>
                                <li>✓ Document translation</li>
                                <li>✓ Personal communications</li>
                                <li>✓ Administrative matters</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
