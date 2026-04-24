import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Phone } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';
import { isBackendAdmin } from '../utils/backendAuth';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/services', label: 'Services' },
        { path: '/guide', label: 'Guide' },
        { path: '/request', label: 'Request' },
        { path: '/profile', label: 'Profile' },
        { path: '/subscribe', label: 'Subscribe' },
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register' },
        { path: '/book-housing', label: 'Housing' },
        { path: '/book-translator', label: 'Translator' },
        ...(isBackendAdmin()
            ? [
                  { path: '/admin', label: 'Admin' },
              ]
            : []),
    ];

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const handleBookNow = () => {
        openWhatsApp('Hello, I would like to book a service');
    };

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
                    : 'bg-black/50 backdrop-blur-sm border-b border-white/5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-semibold text-white text-lg hidden sm:inline">
                            Your<span className="text-primary">Kigali</span>Bestie
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive(link.path)
                                        ? 'text-primary bg-primary/10'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        
                        {/* CTA Button */}
                        <button
                            onClick={handleBookNow}
                            className="ml-4 flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-medium px-4 py-2 rounded-lg transition-all duration-200 text-sm"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Book Now</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="w-5 h-5 text-white" />
                        ) : (
                            <Menu className="w-5 h-5 text-white" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="py-4 space-y-1 border-t border-white/10 mt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive(link.path)
                                        ? 'text-primary bg-primary/10'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        
                        {/* Mobile CTA Button */}
                        <button
                            onClick={handleBookNow}
                            className="w-full mt-3 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-black font-medium px-4 py-2.5 rounded-lg transition-all duration-200 text-sm"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Book Now</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}