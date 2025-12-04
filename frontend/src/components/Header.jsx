import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in by making a request to a protected endpoint
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/auth/status', {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                });
                
                setIsLoggedIn(response.ok);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };
        
        checkAuthStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggedIn(false);
            window.location.href = '/';
        }
    };

    return (
        <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    <span className="text-blue-600">Tutor</span>
                    <span className="text-green-500">IT</span>
                </Link>

                {isLoggedIn ? (
                    // Navigation for logged in users
                    <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
                        <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <Link to="/find-tutors" className="hover:text-blue-600 transition">Find Tutors</Link>
                        <Link to="/students" className="hover:text-blue-600 transition">Students</Link>
                        <button onClick={handleLogout} className="hover:text-blue-600 transition">Logout</button>
                    </nav>
                ) : (
                    // Navigation for guests
                    <>
                        <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
                            <Link to="/find-tutor" className="hover:text-blue-600 transition">Find a Tutor</Link>
                            <Link to="/become-tutor" className="hover:text-blue-600 transition">Become a Tutor</Link>
                            <Link to="/how-it-works" className="hover:text-blue-600 transition">How It Works</Link>
                        </nav>

                        <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded font-medium transition">
                            Sign Up/Sign In
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
