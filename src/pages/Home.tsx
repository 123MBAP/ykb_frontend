import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Award, ChevronRight, Sparkles, Calendar, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { ReviewSection } from '../components/ReviewSection';
import { openWhatsApp } from '../utils/whatsapp';
import { reviews } from '../data/reviews';
import { fetchPublicServices, type PublicService } from '../data/registrationServices';
import { services as fallbackServices } from '../data/services';
import { useEffect, useState } from 'react';

export function Home() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
    const [publicServices, setPublicServices] = useState<PublicService[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible((prev) => ({ ...prev, [entry.target.id]: entry.isIntersecting }));
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let mounted = true;

        const loadServices = async () => {
            try {
                const mergedServices = await fetchPublicServices();
                if (!mounted) return;
                setPublicServices(mergedServices);
            } catch {
                if (!mounted) return;
                setPublicServices([]);
            }
        };

        loadServices();

        return () => {
            mounted = false;
        };
    }, []);

    const handleCTA = () => {
        openWhatsApp('Hello, I would like to request a custom service');
    };

    const featuredServices = (publicServices.length > 0 ? publicServices : fallbackServices).slice(0, 3);

    const whyChooseUs = [
        {
            icon: MapPin,
            title: 'Trusted Local Help',
            description: 'Deep knowledge of Kigali and local resources',
            color: 'bg-emerald-500/10 text-emerald-700',
        },
        {
            icon: Clock,
            title: 'Saves Your Time',
            description: 'Focus on what matters most, we handle the rest',
            color: 'bg-blue-500/10 text-blue-700',
        },
        {
            icon: Sparkles,
            title: 'Personalized Services',
            description: 'Tailored solutions for your unique needs',
            color: 'bg-amber-500/10 text-amber-700',
        },
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
        <main className="bg-white text-gray-900">
            <section className="relative overflow-hidden border-b border-border bg-white pt-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(212,175,55,0.08),_transparent_30%)]" />
                <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl" />

                <div className="ykb-container relative py-12 text-center sm:py-14 lg:py-16">
                    <div className={`animate-on-scroll ${isVisible.hero ? 'visible' : ''}`} id="hero">

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-5xl">
                            You focus on
                            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                what matters
                            </span>
                        </h1>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-textSecondary md:text-base">
                            Professional support with the warmth of a friend your personal concierge in Kigali.
                        </p>

                        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                            <button onClick={handleCTA} className="ykb-button-primary">
                                <span>Request Service</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                            <button onClick={() => navigate('/services')} className="ykb-button-outline">
                                <span>View All Services</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pb-6 text-center">
                    <div className="mx-auto flex h-8 w-5 items-center justify-center rounded-full border border-border bg-white shadow-sm">
                        <div className="mt-1 h-2 w-1 animate-bounce rounded-full bg-secondary" />
                    </div>
                </div>
            </section>

            <section className="border-b border-border bg-surface/50 py-6">
                <div className="ykb-container">
                    <div className="overflow-hidden rounded-lg border border-border bg-border">
                        <div className="grid grid-cols-2 gap-px md:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="bg-white p-4 text-center">
                                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
                                        <stat.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                                    <div className="mt-0.5 text-xs text-textSecondary">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="ykb-section">
                <div className="ykb-container">
                    <div className="ykb-section-heading mb-6">
                        <h2 className="ykb-section-title">Why Choose Us</h2>
                        <p className="ykb-section-subtitle">Experience excellence with our premium concierge services.</p>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-border bg-border">
                        <div className="grid grid-cols-1 gap-px md:grid-cols-3">
                            {whyChooseUs.map((item) => (
                                <div key={item.title} className="group bg-white p-5 transition-colors hover:bg-surface/60">
                                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-1 text-base font-semibold text-primary transition-colors group-hover:text-secondary">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-textSecondary">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="ykb-section border-y border-border bg-surface/50">
                <div className="ykb-container">
                    <div className="ykb-section-heading mb-6">
                        <h2 className="ykb-section-title">Featured Services</h2>
                        <p className="ykb-section-subtitle">Explore our core offerings designed to make your life easier.</p>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-3">
                        {featuredServices.map((service) => (
                            <ServiceCard key={service.id} title={service.title} description={service.description} />
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/services')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-300 hover:text-secondary"
                        >
                            <span>View All Services</span>
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            <section className="ykb-section">
                <div className="ykb-container">
                    <div className="ykb-section-heading mb-6">
                        <h2 className="ykb-section-title">What We Do</h2>
                        <p className="ykb-section-subtitle">Comprehensive support for your daily life in Kigali.</p>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-border bg-border">
                        <div className="grid grid-cols-1 gap-px md:grid-cols-3">
                        {benefits.map((item) => (
                            <div
                                key={item.title}
                                className="flex gap-3 bg-white p-5 transition-colors hover:bg-surface/60"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="mb-1 text-base font-semibold text-primary">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-textSecondary">{item.description}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="ykb-section border-y border-border bg-surface/50">
                <div className="ykb-container">
                    <div className="ykb-section-heading mb-6">
                        <h2 className="ykb-section-title">Our Purpose</h2>
                        <p className="ykb-section-subtitle">
                            Built to bring ease, trust, and a little luxury to everyday life in Kigali.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-border bg-border">
                        <div className="grid grid-cols-1 gap-px md:grid-cols-2">
                            <div className="bg-white p-5">
                                <h3 className="mb-1 text-base font-semibold text-primary">Our Mission</h3>
                                <p className="text-sm leading-relaxed text-textSecondary">
                                    To ease the weight of modern life in Kigali with hands-on support and trusted local connections.
                                </p>
                            </div>
                            <div className="bg-white p-5">
                                <h3 className="mb-1 text-base font-semibold text-primary">Our Vision</h3>
                                <p className="text-sm leading-relaxed text-textSecondary">
                                    To redefine lifestyle services in Rwanda by creating a concierge culture rooted in ease, friendship,
                                    trust and luxury.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ReviewSection reviews={reviews} />

            <section className="ykb-section">
                <div className="ykb-container">
                    <div className="rounded-lg border border-border bg-white p-5 text-center md:p-6">
                        <h2 className="text-2xl font-semibold text-primary md:text-3xl">Ready to Get Started?</h2>
                        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-textSecondary md:text-base">
                            Let your personal concierge handle your most challenging tasks while you focus on what truly matters.
                        </p>

                        <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
                            <button onClick={handleCTA} className="ykb-button-primary">
                                <span>Request Service Now</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                            <button onClick={() => navigate('/guide')} className="ykb-button-outline">
                                <span>Explore Our Guide</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
