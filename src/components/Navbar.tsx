import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';
import { getBackendSession, isBackendAdmin, logoutBackend } from '../utils/backendAuth';
import logo from '../assets/images/logo.png';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const backendSession = getBackendSession();
    const isBackendProvider = backendSession?.user?.role === 'PROVIDER';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        ...(isBackendProvider ? [{ path: '/provider', label: 'Provider' }] : []),
        ...(isBackendAdmin() ? [{ path: '/admin', label: 'Admin' }] : []),
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
                    ? 'bg-white/95 backdrop-blur-xl border-b border-border shadow-sm'
                    : 'bg-white/80 backdrop-blur-md border-b border-border/60'
            }`}
        >
            <div className="ykb-container">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src={logo}
                            alt="Your Kigali Bestie"
                            className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="font-semibold text-primary text-lg hidden sm:inline">
                            Your<span className="text-secondary">Kigali</span>Bestie
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex">
                            <div className="flex items-stretch">
                                {navLinks.map((link) => {
                                    const active = isActive(link.path);
                                    const isLast = link.path === navLinks[navLinks.length - 1]?.path;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            aria-current={active ? 'page' : undefined}
                                            className={`relative flex items-center px-3 text-sm font-semibold transition-colors duration-200 h-10 ${
                                                active
                                                    ? 'bg-secondary text-white'
                                                    : 'text-textSecondary hover:bg-surface/60 hover:text-primary'
                                            } ${
                                                isLast
                                                    ? ''
                                                    : 'after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-border'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

<button
                            onClick={handleBookNow}
                            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 text-sm shadow-gold"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Book Now</span>
                        </button>

                        {backendSession && (
                            <button
                                onClick={() => {
                                    logoutBackend();
                                    window.location.href = '/';
                                }}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 text-sm"
                            >
                                <span>Logout</span>
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-xl border border-border bg-white text-primary hover:bg-slate-50 transition-all duration-200"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
                    </button>
                </div>

                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="py-4 space-y-1 border-t border-border mt-2 bg-white">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                                    isActive(link.path)
                                        ? 'text-primary bg-secondary/10'
                                        : 'text-textSecondary hover:text-primary hover:bg-surface/60'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}

<button
                            onClick={handleBookNow}
                            className="w-full mt-3 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-gold"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Book Now</span>
                        </button>

                        {backendSession && (
                            <button
                                onClick={() => {
                                    logoutBackend();
                                    window.location.href = '/';
                                }}
                                className="w-full mt-3 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm"
                            >
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
