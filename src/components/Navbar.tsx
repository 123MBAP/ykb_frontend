import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/guide', label: 'Starter Guide' },
        { path: '/services', label: 'Services' },
        { path: '/book-housing', label: 'Book Housing' },
        { path: '/book-translator', label: 'Book Translator' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-black border-b border-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary flex items-center justify-center text-black font-bold text-sm">
                            YKB
                        </div>
                        <span className="font-serif font-bold text-primary text-lg hidden sm:inline">
                            Your Kigali Bestie
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-300 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden inline-flex items-center justify-center p-2"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-primary" />
                        ) : (
                            <Menu className="w-6 h-6 text-primary" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2 border-t border-primary">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="block px-4 py-2 text-gray-300 hover:bg-dark-light hover:text-primary transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
