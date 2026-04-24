import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ServiceCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    count?: number;
}

export function ServiceCard({ title, description, icon, count }: ServiceCardProps) {
    const navigate = useNavigate();

    const handleRequest = () => {
        navigate(`/request?service=${encodeURIComponent(title)}`);
    };

    return (
        <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
            {/* Keep hover overlays clipped to the card shape */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:via-transparent group-hover:to-secondary/5 transition-all duration-500" />

                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/20 to-secondary/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
            </div>

            {typeof count === 'number' ? (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 text-primary text-lg font-bold">
                    {count}
                </div>
            ) : null}

            <div className={`relative z-10 p-6 flex flex-col h-full ${typeof count === 'number' ? 'pt-10' : ''}`}>
                {/* Icon */}
                <div className="mb-4">
                    {icon ? (
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-grow">
                    {description}
                </p>

                {/* Button */}
                <button
                    onClick={handleRequest}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/btn"
                >
                    <span>Request Service</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
            </div>
        </div>
    );
}