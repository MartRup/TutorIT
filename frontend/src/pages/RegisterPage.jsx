import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Swal from 'sweetalert2'; // Import SweetAlert2

const RegisterPage = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('student'); // 'student' or 'tutor'
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        institution: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            // Use SweetAlert2 for error message
            Swal.fire({
                title: 'Error!',
                text: 'Passwords do not match',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setLoading(false);
            return;
        }

        try {
            let url = '';
            let body = {};

            if (userType === 'student') {
                url = 'http://localhost:8080/api/auth/register/student';
                body = {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password,
                    age: 20 // Default age
                };
            } else {
                url = 'http://localhost:8080/api/auth/register/tutor';
                body = {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password,
                    institution: formData.institution || 'Not specified',
                    expertiseSubjects: '',
                    hourlyRate: 0.0
                };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.success) {
                // After successful registration, automatically log in the user
                try {
                    const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            email: formData.email,
                            password: formData.password
                        }),
                    });

                    const loginData = await loginResponse.json();

                    if (loginData.success) {
                        // Store user type and email in localStorage
                        localStorage.setItem('userType', userType);
                        localStorage.setItem('userEmail', formData.email);

                        // Use SweetAlert2 for success message
                        Swal.fire({
                            title: 'Success!',
                            text: `Welcome to TutorIT, ${userType === 'student' ? 'Student' : 'Tutor'}!`,
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            navigate('/sessions');
                        });
                    } else {
                        // Registration successful but auto-login failed, redirect to login
                        Swal.fire({
                            title: 'Success!',
                            text: 'Account created successfully! Please log in.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            navigate('/login');
                        });
                    }
                } catch (loginError) {
                    console.error('Auto-login error:', loginError);
                    // Registration successful but auto-login failed, redirect to login
                    Swal.fire({
                        title: 'Success!',
                        text: 'Account created successfully! Please log in.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/login');
                    });
                }
            } else {
                // Use SweetAlert2 for error message
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Registration failed',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Use SweetAlert2 for error message
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred during registration. Please try again.',
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

                    <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>

                    {/* User Type Toggle */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setUserType('student')}
                            className={`flex-1 py-3 px-4 rounded-lg border text-center transition-colors ${userType === 'student'
                                ? 'bg-blue-100 border-blue-200 text-blue-800'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="font-bold text-sm">Student</div>
                            <div className="text-xs text-gray-500">Looking for tutoring</div>
                        </button>
                        <button
                            onClick={() => setUserType('tutor')}
                            className={`flex-1 py-3 px-4 rounded-lg border text-center transition-colors ${userType === 'tutor'
                                ? 'bg-blue-100 border-blue-200 text-blue-800'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="font-bold text-sm">Tutor</div>
                            <div className="text-xs text-gray-500">Offering tutoring</div>
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Institution - Only for Tutors */}
                        {userType === 'tutor' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                                <input
                                    type="text"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., University of the Philippines"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Must be at least 8 characters with a number and special character
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="text-xs text-center text-gray-500 mt-4">
                            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6 disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>


                        <div className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Log In
                            </Link>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
