import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, HelpCircle, Calendar, Home, Globe, ShoppingBag, Coffee, Car, Heart } from 'lucide-react';
import { useEffect, useState, type ReactNode, type MouseEvent } from 'react';

// ============== ServiceCard Component ==============
interface ServiceCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    count?: number;
    variant?: 'default' | 'compact' | 'featured';
    onRequest?: (serviceName: string) => void;
    className?: string;
    ctaText?: string;
    disabled?: boolean;
}

function ServiceCard({
    title,
    description,
    icon,
    count,
    variant = 'default',
    onRequest,
    className = '',
    ctaText = 'Request Service',
    disabled = false,
}: ServiceCardProps) {
    const navigate = useNavigate();

    const handleRequest = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (disabled) return;
        
        if (onRequest) {
            onRequest(title);
        } else {
            navigate(`/request?service=${encodeURIComponent(title)}`);
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'compact':
                return 'p-4';
            case 'featured':
                return 'p-6 border-primary/30 bg-gradient-to-br from-primary/10 via-white/5 to-secondary/10 shadow-xl shadow-primary/10';
            default:
                return 'p-6';
        }
    };

    const getIconStyles = () => {
        const baseStyles = "flex items-center justify-center transition-all duration-300";
        const sizeStyles = variant === 'compact' ? 'w-10 h-10 rounded-lg' : 'w-12 h-12 rounded-xl';
        
        if (icon) {
            return `${baseStyles} ${sizeStyles} bg-primary/10 text-primary group-hover:scale-110`;
        }
        
        return `${baseStyles} ${sizeStyles} bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110`;
    };

    return (
        <div
            className={`
                group relative rounded-2xl border border-white/10 
                transition-all duration-500 ease-out
                hover:-translate-y-2 hover:border-primary/40 
                hover:shadow-2xl hover:shadow-primary/20
                focus-within:ring-2 focus-within:ring-primary/50
                ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                ${getVariantStyles()}
                ${className}
            `}
            role="article"
            aria-disabled={disabled}
        >
            {/* Background effects container */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                {/* Glass morphism base */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br 
                    from-primary/0 via-primary/0 to-secondary/0 
                    group-hover:from-primary/10 group-hover:via-transparent group-hover:to-secondary/10 
                    transition-all duration-700" />
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r 
                    from-primary/0 via-primary/30 to-secondary/0 
                    opacity-0 group-hover:opacity-100 blur-xl 
                    transition-all duration-700" />
                
                {/* Subtle border shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                    bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    -translate-x-full group-hover:translate-x-full 
                    transition-transform duration-1000" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col h-full">
                {typeof count === 'number' && (
                    <div className="flex justify-center text-primary text-lg font-bold mb-4">
                        {count}
                    </div>
                )}

                {/* Icon section */}
                <div className={variant === 'compact' ? 'mb-3' : 'mb-4'}>
                    <div className={getIconStyles()}>
                        {icon || <Sparkles className={variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} />}
                    </div>
                </div>

                {/* Title */}
                <h3 className={`
                    font-semibold text-white mb-2 
                    group-hover:text-primary transition-colors duration-300
                    ${variant === 'compact' ? 'text-lg' : 'text-xl'}
                `}>
                    {title}
                </h3>

                {/* Description */}
                <p className={`
                    text-gray-400 leading-relaxed mb-4 flex-grow
                    ${variant === 'compact' ? 'text-xs' : 'text-sm'}
                `}>
                    {description}
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleRequest}
                    disabled={disabled}
                    className={`
                        inline-flex items-center gap-2 text-sm font-medium 
                        transition-all duration-300 group/btn
                        ${disabled 
                            ? 'text-gray-500 cursor-not-allowed' 
                            : 'text-primary hover:text-primary/80 hover:gap-3'
                        }
                    `}
                    aria-label={`Request ${title} service`}
                >
                    <span>{ctaText}</span>
                    <ArrowRight className={`
                        w-4 h-4 transition-all duration-300
                        ${!disabled && 'group-hover/btn:translate-x-1 group-hover/btn:scale-110'}
                    `} />
                </button>
            </div>
        </div>
    );
}

// ============== Services Page Types & Helpers ==============
type PublicService = {
    id: number;
    title: string;
    description: string;
};

type ServiceSlot = {
    service: PublicService | null;
    draft: { title: string; description: string };
    saving: boolean;
    error: string | null;
};

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000/api';

async function readApiErrorMessage(res: Response): Promise<string> {
    try {
        const data = (await res.json()) as any;
        const msg = data?.error?.message;
        if (typeof msg === 'string' && msg.trim().length > 0) return msg;
    } catch {
        // ignore
    }
    return `Request failed (${res.status})`;
}

function buildSlots(services: PublicService[]): ServiceSlot[] {
    const slots: ServiceSlot[] = [];
    for (let i = 0; i < 11; i++) {
        const service = services[i] ?? null;
        slots.push({
            service,
            draft: {
                title: service?.title ?? '',
                description: service?.description ?? '',
            },
            saving: false,
            error: null,
        });
    }
    return slots;
}

// Icon mapping for different service types
const getServiceIcon = (title: string): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
        'Personal Assistance': <Heart className="w-5 h-5" />,
        'Errand Running': <ShoppingBag className="w-5 h-5" />,
        'Event Planning': <Calendar className="w-5 h-5" />,
        'Housing Assistance': <Home className="w-5 h-5" />,
        'Translation Services': <Globe className="w-5 h-5" />,
        'Transportation': <Car className="w-5 h-5" />,
        'Concierge': <Coffee className="w-5 h-5" />,
    };
    return iconMap[title] || <Sparkles className="w-5 h-5" />;
};

// ============== Services Component ==============
export function Services() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

    const [slots, setSlots] = useState<ServiceSlot[]>(() => buildSlots([]));
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const filledCount = slots.reduce((acc, s) => (s.service ? acc + 1 : acc), 0);
    const isSetupMode = filledCount < 11;

    useEffect(() => {
        let mounted = true;
        const run = async () => {
            try {
                const res = await fetch(`${API_BASE}/services`);
                if (!res.ok) throw new Error('Failed to load services');
                const json = (await res.json()) as { services?: PublicService[] };
                const list = Array.isArray(json.services) ? json.services : [];
                if (!mounted) return;
                setSlots(buildSlots(list));
                setLoadError(null);
            } catch {
                if (!mounted) return;
                setLoadError('Backend not reachable — you can still fill the fields, but saving will fail until the API is running.');
                setSlots(buildSlots([]));
            }
        };
        run();
        return () => {
            mounted = false;
        };
    }, []);

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
    }, [slots.length]);

    const saveSlot = async (index: number) => {
        setSlots((prev) =>
            prev.map((s, i) => (i === index ? { ...s, saving: true, error: null } : s))
        );

        const slot = slots[index];
        const title = slot?.draft.title.trim();
        const description = slot?.draft.description.trim();

        if (!title || !description) {
            setSlots((prev) =>
                prev.map((s, i) =>
                    i === index ? { ...s, saving: false, error: 'Title and description are required.' } : s
                )
            );
            return;
        }

        try {
            if (!slot.service) {
                const res = await fetch(`${API_BASE}/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description }),
                });
                if (!res.ok) {
                    const msg = await readApiErrorMessage(res);
                    throw new Error(msg);
                }
                const json = (await res.json()) as { service?: PublicService };
                if (!json.service) throw new Error('Invalid response');

                setSlots((prev) =>
                    prev.map((s, i) =>
                        i === index
                            ? {
                                  ...s,
                                  service: json.service!,
                                  draft: { title: json.service!.title, description: json.service!.description },
                                  saving: false,
                                  error: null,
                              }
                            : s
                    )
                );
            } else {
                const res = await fetch(`${API_BASE}/services/${slot.service.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description }),
                });
                if (!res.ok) {
                    const msg = await readApiErrorMessage(res);
                    throw new Error(msg);
                }
                const json = (await res.json()) as { service?: PublicService };
                if (!json.service) throw new Error('Invalid response');

                setSlots((prev) =>
                    prev.map((s, i) =>
                        i === index
                            ? {
                                  ...s,
                                  service: json.service!,
                                  draft: { title: json.service!.title, description: json.service!.description },
                                  saving: false,
                                  error: null,
                              }
                            : s
                    )
                );
            }

            setExpandedIndex(null);
        } catch (err) {
            const message = err instanceof Error && err.message ? err.message : 'Could not save. Make sure the backend is running.';
            setSlots((prev) =>
                prev.map((s, i) =>
                    i === index ? { ...s, saving: false, error: message } : s
                )
            );
        }
    };

    return (
        <main className="bg-black min-h-screen pt-16">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
                <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
                
                <div 
                    className={`relative max-w-6xl mx-auto text-center animate-on-scroll ${isVisible['hero'] ? 'visible' : ''}`}
                    id="hero"
                >
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-gray-300 text-sm">What We Offer</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="text-white">Our</span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ml-3">
                            Services
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Comprehensive concierge solutions tailored to your needs in Kigali
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {loadError ? (
                        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-300/90">
                            {loadError}
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slots.map((slot, idx) => {
                            const isExpanded = expandedIndex === idx;
                            const displayTitle = slot.service?.title || `Service ${idx + 1}`;
                            const displayDescription = slot.service?.description || 'Click to add a title and description.';
                            const icon = getServiceIcon(slot.service?.title ?? displayTitle);
                            const count = idx + 1;

                            return (
                                <div
                                    key={`slot-${idx}`}
                                    className={`animate-on-scroll ${isVisible[`service-${idx}`] ? 'visible' : ''}`}
                                    id={`service-${idx}`}
                                    style={{ transitionDelay: `${idx * 80}ms` }}
                                >
                                    {isSetupMode ? (
                                        <>
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                className="cursor-pointer"
                                                onClick={() => setExpandedIndex((prev) => (prev === idx ? null : idx))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        setExpandedIndex((prev) => (prev === idx ? null : idx));
                                                    }
                                                }}
                                            >
                                                <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors">
                                                    <div className="flex justify-center text-primary text-lg font-bold mb-4">
                                                        {count}
                                                    </div>

                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                                {icon}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-bold text-white">{displayTitle}</h3>
                                                                <p className="text-sm text-gray-400 line-clamp-2">{displayDescription}</p>
                                                            </div>
                                                        </div>

                                                        <span className="text-xs rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1">
                                                            {slot.service ? 'Saved' : 'Empty'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div
                                                    className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor={`title-${idx}`}>
                                                                Service title
                                                            </label>
                                                            <input
                                                                id={`title-${idx}`}
                                                                value={slot.draft.title}
                                                                onChange={(e) =>
                                                                    setSlots((prev) =>
                                                                        prev.map((s, i) =>
                                                                            i === idx
                                                                                ? { ...s, draft: { ...s.draft, title: e.target.value }, error: null }
                                                                                : s
                                                                        )
                                                                    )
                                                                }
                                                                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-primary focus:outline-none transition-colors"
                                                                placeholder="e.g., Personal Assistance"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor={`desc-${idx}`}>
                                                                Description
                                                            </label>
                                                            <textarea
                                                                id={`desc-${idx}`}
                                                                value={slot.draft.description}
                                                                onChange={(e) =>
                                                                    setSlots((prev) =>
                                                                        prev.map((s, i) =>
                                                                            i === idx
                                                                                ? {
                                                                                      ...s,
                                                                                      draft: { ...s.draft, description: e.target.value },
                                                                                      error: null,
                                                                                  }
                                                                                : s
                                                                        )
                                                                    )
                                                                }
                                                                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-primary focus:outline-none transition-colors min-h-[120px]"
                                                                placeholder="Describe the service…"
                                                            />
                                                        </div>

                                                        {slot.error && (
                                                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
                                                                {slot.error}
                                                            </div>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => saveSlot(idx)}
                                                            disabled={slot.saving}
                                                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-black font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                                        >
                                                            {slot.saving ? 'Saving…' : 'Save Service'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : slot.service ? (
                                        <ServiceCard
                                            title={slot.service.title}
                                            description={slot.service.description}
                                            icon={getServiceIcon(slot.service.title)}
                                            count={count}
                                        />
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Custom Service CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <div 
                        className={`bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 p-6 md:p-12 text-center animate-on-scroll ${isVisible['cta'] ? 'visible' : ''}`}
                        id="cta"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <HelpCircle className="w-8 h-8 text-primary" />
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Don't see what you need?
                        </h2>
                        
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Can't find exactly what you're looking for? We offer custom services tailored to your specific needs. Get in touch with us today!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/request?service=' + encodeURIComponent('Service Provider Booking'))}
                                className="group inline-flex items-center justify-center gap-2 border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary font-medium py-3 px-6 rounded-xl transition-all duration-300"
                            >
                                <span>Book a Service Provider</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate('/request?service=' + encodeURIComponent('Custom Service'))}
                                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-black font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <span>Request Custom Service</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}