import { Phone, Mail, MapPin, Heart,  Sparkles, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { path: '/', label: 'Home' },
        { path: '/services', label: 'Services' },
        { path: '/guide', label: 'Starter Guide' },
        { path: '/request', label: 'Request Service' },
    ];

    const serviceLinks = [
        { path: '/book-housing', label: 'Housing Assistance' },
        { path: '/book-translator', label: 'Translation Services' },
        { path: '/request?service=Event%20Planning', label: 'Event Planning' },
        { path: '/request?service=Errand%20Running', label: 'Errand Running' },
    ];

    return (
        <footer className="bg-gradient-to-b from-black to-gray-900 border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-black" />
                            </div>
                            <span className="font-semibold text-white text-lg">
                                Your<span className="text-primary">Kigali</span>Bestie
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Professional support with the warmth of a friend — your personal concierge in Kigali.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Shield className="w-4 h-4 text-primary" />
                            <span>100% Reliable Service</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            Services
                        </h4>
                        <ul className="space-y-2">
                            {serviceLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            Contact
                        </h4>
                        <div className="space-y-3">
                            <a
                                href="tel:+250798891543"
                                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm">+250 798 891 543</span>
                            </a>
                            <a
                                href="mailto:hello@yourkigalibestie.com"
                                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Mail className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm">hello@yourkigalibestie.com</span>
                            </a>
                            <div className="flex items-center gap-3 text-gray-400">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm">Kigali, Rwanda</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm">24/7 Support Available</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-gray-500 text-sm">
                            &copy; {currentYear} Your Kigali Bestie. All rights reserved.
                        </p>

                        {/* Made with love */}
                        <p className="text-gray-600 text-xs flex items-center gap-1">
                            Made with
                            <Heart className="w-3 h-3 text-primary" />
                            in Kigali
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}