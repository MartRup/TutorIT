import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2'; // Import SweetAlert2

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Store user type and email in localStorage
                if (data.userType) {
                    localStorage.setItem('userType', data.userType);
                    localStorage.setItem('userEmail', email);
                }

                // Use SweetAlert2 for success message
                Swal.fire({
                    title: 'Success!',
                    text: `Welcome back, ${data.userType === 'student' ? 'Student' : 'Tutor'}!`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate("/sessions");
                });
            } else {
                // Use SweetAlert2 for error message
                Swal.fire({
                    title: 'Error!',
                    text: data.message || "Invalid Credentials",
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            // Use SweetAlert2 for error message
            Swal.fire({
                title: 'Error!',
                text: "An error occurred during login. Please try again.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col">
            <Header />

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-10">

                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-1">
                            <span className="text-blue-600">Tutor</span>
                            <span className="text-green-600">IT</span>
                        </h1>
                        <p className="text-gray-500 text-sm">Connect, Learn, Succeed</p>
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


                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 
                            font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>


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
     );
};

export default LoginPage;