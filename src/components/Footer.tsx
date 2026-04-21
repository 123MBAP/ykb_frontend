import { Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black border-t border-primary py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-primary pb-8">
                    {/* Branding */}
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-primary mb-2">Your Kigali Bestie</h3>
                        <p className="text-gray-400 text-sm">
                            Providing services nobody talks about
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-serif font-semibold text-primary mb-4">Contact</h4>
                        <a
                            href="tel:+250798891543"
                            className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            <span>+250 798 891 543</span>
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif font-semibold text-primary mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="/services" className="hover:text-primary transition-colors">Services</a></li>
                            <li><a href="/guide" className="hover:text-primary transition-colors">Starter Guide</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2024 Your Kigali Bestie. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
