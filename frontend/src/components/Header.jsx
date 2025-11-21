import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    <span className="text-blue-600">Tutor</span>
                    <span className="text-green-500">IT</span>
                </Link>

                <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
                    <Link to="/find-tutor" className="hover:text-blue-600 transition">Find a Tutor</Link>
                    <Link to="/become-tutor" className="hover:text-blue-600 transition">Become a Tutor</Link>
                    <Link to="/how-it-works" className="hover:text-blue-600 transition">How It Works</Link>
                </nav>

                <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded font-medium transition">
                    Sign Up/Sign In
                </Link>
            </div>
        </header>
    );
};

export default Header;
