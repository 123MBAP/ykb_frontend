import { openWhatsApp } from '../utils/whatsapp';

interface ServiceCardProps {
    title: string;
    description: string;
}

export function ServiceCard({ title, description }: ServiceCardProps) {
    const handleRequest = () => {
        openWhatsApp(`Hello, I need help with ${title}`);
    };

    return (
        <div className="bg-dark-light border border-primary p-8 flex flex-col h-full hover:bg-black transition-colors">
            <h3 className="text-xl font-serif font-semibold text-primary mb-3">{title}</h3>
            <p className="text-gray-400 mb-6 flex-grow">{description}</p>
            <button
                onClick={handleRequest}
                className="inline-flex items-center justify-center space-x-2 bg-primary hover:bg-secondary text-black font-semibold py-2 px-4 transition-colors"
            >
                Request Service
            </button>
        </div>
    );
}
