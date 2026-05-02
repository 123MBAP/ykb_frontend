import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface ServiceCardProps {
    title: string;
    description: string;
    icon?: ReactNode;
    count?: number;
}

export function ServiceCard({ title, description, icon, count }: ServiceCardProps) {
    const navigate = useNavigate();

    const handleRequest = () => {
        navigate(`/request?service=${encodeURIComponent(title)}`);
    };

    return (
        <article className="group relative h-full overflow-hidden rounded-lg border border-border bg-white p-4 transition-colors duration-200 hover:border-secondary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-transparent to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {typeof count === 'number' ? (
                <div className="absolute right-3 top-3 z-20 rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {count}
                </div>
            ) : null}

            <div className={`relative z-10 flex h-full flex-col ${typeof count === 'number' ? 'pt-4' : ''}`}>
                <div className="mb-3">
                    {icon ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors duration-200 group-hover:border-secondary/30">
                            {icon}
                        </div>
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface transition-colors duration-200 group-hover:border-secondary/30">
                            <Sparkles className="h-5 w-5 text-secondary" />
                        </div>
                    )}
                </div>

                <h3 className="mb-1 text-base font-semibold text-primary transition-colors duration-200 group-hover:text-secondary">
                    {title}
                </h3>

                <p className="mb-3 flex-grow text-sm leading-relaxed text-textSecondary">
                    {description}
                </p>

                <button
                    onClick={handleRequest}
                    className="inline-flex items-center gap-2 self-start rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-gold transition-colors duration-200 hover:bg-[#c49b2f] focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                    <span>Request Service</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
        </article>
    );
}
