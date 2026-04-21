import { useState, type FormEvent } from 'react';
import { Home, MapPin, DollarSign } from 'lucide-react';

interface FormData {
    type: string;
    location: string;
    rooms: string;
    budget: string;
}

export function BookHousing() {
    const [formData, setFormData] = useState<FormData>({
        type: '',
        location: '',
        rooms: '',
        budget: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Housing booking form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            alert('Request submitted successfully! We will contact you soon.');
            setSubmitted(false);
            setFormData({ type: '', location: '', rooms: '', budget: '' });
        }, 500);
    };

    return (
        <main>
            {/* Header */}
            <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center space-x-3 mb-4">
                        <Home className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                            Book Your Housing
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400">
                        Let us help you find the perfect place to stay in Kigali
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-light">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-black border border-primary p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Housing Type */}
                            <div>
                                <label htmlFor="type" className="block text-lg font-serif font-semibold text-primary mb-3">
                                    What type of housing are you looking for?
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-primary bg-dark-light text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">Select an option</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="airbnb">Airbnb</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-lg font-serif font-semibold text-primary mb-3">
                                    Preferred Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-primary" />
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g., Kigali City Center, Kacyiru, Remera"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-primary bg-dark-light text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Rooms */}
                            <div>
                                <label htmlFor="rooms" className="block text-lg font-serif font-semibold text-primary mb-3">
                                    Number of Bedrooms
                                </label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 w-5 h-5 text-primary" />
                                    <input
                                        type="number"
                                        id="rooms"
                                        name="rooms"
                                        value={formData.rooms}
                                        onChange={handleChange}
                                        placeholder="e.g., 1, 2, 3"
                                        min="1"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-primary bg-dark-light text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <label htmlFor="budget" className="block text-lg font-serif font-semibold text-primary mb-3">
                                    Monthly Budget (RWF)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-primary" />
                                    <input
                                        type="text"
                                        id="budget"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="e.g., 500000 - 1000000"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-primary bg-dark-light text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
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
                                {submitted ? 'Submitting...' : 'Submit Housing Request'}
                            </button>
                        </form>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 bg-black border border-primary p-6">
                        <h3 className="font-serif font-semibold text-primary mb-3">What happens next?</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>✓ We receive your housing preferences</li>
                            <li>✓ Our team searches for matching properties</li>
                            <li>✓ We contact you within 24 hours with options</li>
                            <li>✓ We help with viewings and negotiations</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}
