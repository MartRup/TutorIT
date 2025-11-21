import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Mail, Lock } from 'lucide-react';

const HARD_USER = "User123@gmail.com";
const HARD_PASSWORD = "Password123";

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === HARD_USER && password === HARD_PASSWORD) {
            alert("Login Successful!");
            navigate("/dashboard"); // 🔥 Redirect to dashboard
        } else {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col">
            <Header />

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-10">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-blue-600 mb-2">TutorIT</h1>
                    </div>

                    {/* FORM */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm 
                                        focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm 
                                        focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>

                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 
                            font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* OR Continue with */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or continue with</span>
                            </div>
                        </div>

                        {/* OAuth buttons */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="oauth-btn">Google</button>
                            <button className="oauth-btn">GitHub</button>
                        </div>

                        {/* Register Link */}
                        <div className="mt-6 text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Register now
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
