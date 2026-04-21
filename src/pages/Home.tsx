import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Award, ChevronRight, Sparkles } from 'lucide-react';
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
        { icon: '🎯', title: 'Trusted Local Help', description: 'Deep knowledge of Kigali and local resources', color: 'from-blue-500 to-cyan-500' },
        { icon: '⚡', title: 'Saves Your Time', description: 'Focus on what matters most, we handle the rest', color: 'from-purple-500 to-pink-500' },
        { icon: '✨', title: 'Personalized Services', description: 'Tailored solutions for your unique needs', color: 'from-orange-500 to-red-500' },
    ];

    const stats = [
        { value: '500+', label: 'Happy Clients', icon: Star },
        { value: '98%', label: 'Satisfaction Rate', icon: Award },
        { value: '24/7', label: 'Support Available', icon: Clock },
        { value: '100%', label: 'Reliable Service', icon: Shield },
    ];

    return (
        <main className="overflow-hidden">
            {/* Hero Section with Gradient Background */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center z-10">
                    <div
                        className="animate-on-scroll"
                        id="hero"
                        style={{ visibility: isVisible['hero'] ? 'visible' : 'hidden' }}
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-primary/30">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-primary text-sm font-medium">Premium Concierge Service</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                                You focus on what matters,
                            </span>
                            <br />
                            <span className="text-white">we take care of the rest</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Professional support with the warmth of a friend — your personal concierge in Kigali
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleCTA}
                                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-black font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg overflow-hidden"
                            >
                                <span className="relative z-10">Request Custom Service</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <button
                                onClick={() => navigate('/services')}
                                className="inline-flex items-center gap-2 border-2 border-primary/50 text-primary hover:bg-primary/10 font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm"
                            >
                                <span>Explore Services</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-scroll"></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-black/50 backdrop-blur-sm border-y border-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="text-center group animate-on-scroll"
                                id={`stat-${idx}`}
                                style={{ visibility: isVisible[`stat-${idx}`] ? 'visible' : 'hidden' }}
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon className="w-8 h-8 text-primary" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us - Modern Cards */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="text-center mb-16 animate-on-scroll"
                        id="why-choose"
                        style={{ visibility: isVisible['why-choose'] ? 'visible' : 'hidden' }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Why Choose Us
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Experience excellence with our premium concierge services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {whyChooseUs.map((item, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-500 hover:transform hover:-translate-y-2 animate-on-scroll"
                                id={`why-${idx}`}
                                style={{ visibility: isVisible[`why-${idx}`] ? 'visible' : 'hidden' }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                                <div className="relative">
                                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Preview with Enhanced Cards */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="max-w-7xl mx-auto relative">
                    <div
                        className="text-center mb-16 animate-on-scroll"
                        id="services"
                        style={{ visibility: isVisible['services'] ? 'visible' : 'hidden' }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Our Featured Services
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Explore our core offerings designed to make your life easier
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {featuredServices.map((service, idx) => (
                            <div
                                key={service.id}
                                className="animate-on-scroll"
                                id={`service-${idx}`}
                                style={{ visibility: isVisible[`service-${idx}`] ? 'visible' : 'hidden' }}
                            >
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
                            className="group inline-flex items-center gap-2 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            <span>View All Services</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Reviews Section with enhanced styling */}
            <div
                className="animate-on-scroll"
                id="reviews"
                style={{ visibility: isVisible['reviews'] ? 'visible' : 'hidden' }}
            >
                <ReviewSection reviews={reviews} />
            </div>

            {/* Enhanced CTA Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"></div>
                <div className="absolute inset-0 bg-black/90"></div>

                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <div
                        className="animate-on-scroll"
                        id="cta"
                        style={{ visibility: isVisible['cta'] ? 'visible' : 'hidden' }}
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-primary text-sm font-medium">Limited Time Offer</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>

                        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                            Let your personal concierge handle your most challenging tasks while you focus on what truly matters.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleCTA}
                                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-black font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl text-lg overflow-hidden"
                            >
                                <span className="relative z-10">Request Service Now</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate('/guide')}
                                className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm"
                            >
                                <span>Explore Our Guide</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s linear infinite;
                }
                
                @keyframes scroll {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(8px); opacity: 0; }
                }
                
                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
                }
                
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
                
                .animate-on-scroll {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s ease-out;
                }
                
                .animate-on-scroll[style*="visibility: visible"] {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </main>
    );
}