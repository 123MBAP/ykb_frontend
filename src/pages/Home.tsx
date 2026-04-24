import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Award, ChevronRight, Sparkles, Calendar, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { ReviewSection } from '../components/ReviewSection';
import { openWhatsApp } from '../utils/whatsapp';
import { services } from '../data/services';
import { reviews } from '../data/reviews';
import { useEffect, useState } from 'react';

export function Home() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    setIsVisible(prev => ({ ...prev, [entry.target.id]: entry.isIntersecting }));
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleCTA = () => {
        openWhatsApp('Hello, I would like to request a custom service');
    };

    const featuredServices = services.slice(0, 3);
    
    const whyChooseUs = [
        { icon: MapPin, title: 'Trusted Local Help', description: 'Deep knowledge of Kigali and local resources', color: 'bg-emerald-500/10 text-emerald-400' },
        { icon: Clock, title: 'Saves Your Time', description: 'Focus on what matters most, we handle the rest', color: 'bg-blue-500/10 text-blue-400' },
        { icon: Sparkles, title: 'Personalized Services', description: 'Tailored solutions for your unique needs', color: 'bg-amber-500/10 text-amber-400' },
    ];

    const stats = [
        { value: '500+', label: 'Happy Clients', icon: Star },
        { value: '98%', label: 'Satisfaction Rate', icon: Award },
        { value: '24/7', label: 'Support Available', icon: Clock },
        { value: '100%', label: 'Reliable Service', icon: Shield },
    ];

    const benefits = [
        { icon: ShoppingBag, title: 'Errand Running', description: 'Shopping, bill payments, document delivery and more' },
        { icon: Calendar, title: 'Event Planning', description: 'From intimate gatherings to large celebrations' },
        { icon: Truck, title: 'Personal Assistance', description: 'Dedicated support for your daily tasks and needs' },
    ];

    return (
        <main className="bg-black">
            {/* Hero Section - Clean & Minimal */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Subtle Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className={`animate-on-scroll ${isVisible['hero'] ? 'visible' : ''}`} id="hero">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-gray-300 text-sm">Premium Concierge Service</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            <span className="text-white">You focus on</span>
                            <br />
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                what matters
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Professional support with the warmth of a friend — your personal concierge in Kigali
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleCTA}
                                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                <span>Request Service</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate('/services')}
                                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/5 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
                            >
                                <span>View All Services</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-bounce" />
                    </div>
                </div>
            </section>

            {/* Stats Section - Clean Numbers */}
            <section className="py-12 border-t border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us - Simple 3-Column */}
            <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
                <div className="ykb-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            Why Choose Us
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Experience excellence with our premium concierge services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {whyChooseUs.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Services */}
            <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white/5">
                <div className="ykb-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            Featured Services
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Explore our core offerings designed to make your life easier
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {featuredServices.map((service) => (
                            <div key={service.id}>
                                <ServiceCard
                                    title={service.title}
                                    description={service.description}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/services')}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            <span>View All Services</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Benefits / What We Do - Clean Grid */}
            <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
                <div className="ykb-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            What We Do
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Comprehensive support for your daily life in Kigali
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((item, idx) => (
                            <div key={idx} className="flex gap-5 p-6 rounded-2xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Purpose, Mission, Vision - Clean Cards */}
            <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white/5">
                <div className="ykb-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            Our Purpose
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Built to bring ease, trust, and a little luxury to everyday life in Kigali
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-black/40 rounded-2xl p-8 border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-2">Our Mission</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                To ease the weight of modern life in Kigali with hands-on support and trusted local connections.
                            </p>
                        </div>
                        <div className="bg-black/40 rounded-2xl p-8 border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-2">Our Vision</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                To redefine lifestyle services in Rwanda by creating a concierge culture rooted in ease, friendship, trust and luxury.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <ReviewSection reviews={reviews} />

            {/* CTA Section - Clean & Simple */}
            <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Let your personal concierge handle your most challenging tasks while you focus on what truly matters.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleCTA}
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-6 rounded-full transition-all duration-300"
                        >
                            <span>Request Service Now</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/guide')}
                            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/5 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
                        >
                            <span>Explore Our Guide</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}