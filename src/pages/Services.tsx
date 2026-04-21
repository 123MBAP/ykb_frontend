import { ServiceCard } from '../components/ServiceCard';
import { services } from '../data/services';

export function Services() {
    return (
        <main>
            {/* Header */}
            <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Our Services
                    </h1>
                    <p className="text-xl text-gray-400">
                        Comprehensive concierge solutions tailored to your needs
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-light">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                title={service.title}
                                description={service.description}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Info */}
            <section className="bg-black border-t border-primary py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-6">
                        Don't see what you need?
                    </h2>
                    <p className="text-lg text-gray-400 mb-8">
                        Can't find exactly what you're looking for? We offer custom services tailored to your specific needs. Get in touch!
                    </p>
                    <button
                        onClick={() => window.location.href = 'https://wa.me/250798891543?text=' + encodeURIComponent('I need a custom service not listed in your offerings')}
                        className="inline-flex items-center space-x-2 bg-primary hover:bg-secondary text-black font-semibold py-3 px-8 transition-colors"
                    >
                        <span>Request Custom Service</span>
                    </button>
                </div>
            </section>
        </main>
    );
}
