"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronDown,
  MapPin,
  User,
  Check
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import Swal from 'sweetalert2';

export default function BookSession() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get tutor data from navigation state or use default
  const tutorFromState = location.state?.tutor;
  const tutorData = tutorFromState || {
    tutorId: 1,
    name: "Dr. Jennifer Martinez",
    rating: 4.9,
    reviews: 127,
    hourly: 45.00,
    subjects: ["Mathematics"]
  };

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Form data
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "1 hour",
    sessionType: "Online",
    notes: ""
  });

  // Payment data
  const [paymentData, setPaymentData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  // Calculate costs
  const getHours = () => {
    return parseInt(formData.duration.split(" ")[0]);
  };

  const getSubtotal = () => {
    return tutorData.hourly * getHours();
  };

  const getPlatformFee = () => {
    return getSubtotal() * 0.10; // 10% platform fee
  };

  const getTotal = () => {
    return getSubtotal() + getPlatformFee();
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      const digits = value.replace(/\D/g, '');
      formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    } else if (field === 'expiryDate') {
      // Check for backspace on the slash
      const oldVal = paymentData.expiryDate;
      if (oldVal && oldVal.length === 3 && oldVal.endsWith('/') && value.length === 2) {
        formattedValue = value;
      } else {
        const digits = value.replace(/\D/g, '');
        if (digits.length >= 2) {
          formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
        } else {
          formattedValue = digits;
        }
      }
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData(prev => ({ ...prev, [field]: formattedValue }));
  };

  // Validation
  const validateStep1 = () => {
    if (!formData.date || !formData.time) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please select both date and time',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!paymentData.cardholderName || !paymentData.cardNumber ||
      !paymentData.expiryDate || !paymentData.cvv) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all payment details',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }
    return true;
  };

  // Navigation handlers
  const handleContinue = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 3 && !validateStep3()) return;

    // On step 3 (payment), complete the booking
    if (currentStep === 3) {
      handleCompleteBooking();
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteBooking = async () => {
    try {
      // Get current user info first
      const userResponse = await fetch('http://localhost:8080/api/auth/status', {
        method: 'GET',
        credentials: 'include',
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user information');
      }

      const userData = await userResponse.json();
      console.log('Current user data:', userData);
      console.log('Available fields:', Object.keys(userData));

      // Try to get student ID from various possible field names
      const studentId = userData.userId || userData.id || userData.user_id || userData.studentId;
      const studentName = userData.name || userData.username || userData.fullName || userData.email || 'Student';

      console.log('Extracted studentId:', studentId);
      console.log('Extracted studentName:', studentName);

      if (!studentId) {
        alert('❌ ERROR: Could not get student ID from user data.\n\nUser data: ' + JSON.stringify(userData, null, 2));
        throw new Error('Could not get student ID from user data. Please make sure you are logged in.');
      }

      // Prepare session data for backend
      const sessionDateTime = new Date(`${formData.date}T${formData.time}`);

      const sessionData = {
        // Student information
        studentId: studentId,
        studentName: studentName,
        // Tutor information
        tutorId: tutorData.tutorId,
        tutorName: tutorData.name,
        // Session details
        subject: tutorData.subjects?.[0] || 'General',
        topic: formData.notes || 'General tutoring session',
        dateTime: sessionDateTime.toISOString(),
        duration: parseInt(formData.duration.split(' ')[0]) * 60, // Convert hours to minutes
        sessionType: formData.sessionType,
        notes: formData.notes,
        price: getTotal(),
        status: 'scheduled',
        paymentStatus: 'paid',
        paymentDetails: {
          cardholderName: paymentData.cardholderName,
          lastFourDigits: paymentData.cardNumber.slice(-4),
          amount: getTotal()
        }
      };

      console.log('Booking session with data:', sessionData);

      // Send booking to backend
      const response = await fetch('http://localhost:8080/api/tutoring-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sessionData),
      });

      console.log('Booking response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Booking failed with response:', errorText);
        const errorData = errorText ? JSON.parse(errorText) : {};
        throw new Error(errorData.message || `Failed to book session (${response.status})`);
      }

      const createdSession = await response.json();
      console.log('✅ Session created successfully:', createdSession);
      console.log('Session ID:', createdSession.sessionId || createdSession.id);

      // Show success alert
      await Swal.fire({
        title: 'Booking Successful!',
        text: 'Your tutoring session has been scheduled successfully.',
        icon: 'success',
        confirmButtonText: 'Great!'
      });

      // Move to confirmation step
      setCurrentStep(4);

    } catch (error) {
      console.error('Error booking session:', error);

      // Show detailed error alert

      Swal.fire({
        title: 'Booking Failed',
        text: error.message || 'There was an error booking your session. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleViewSessions = () => {
    // Navigate to sessions page and force a refresh
    navigate('/sessions', { state: { refresh: true } });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Layout activePage="find-tutors">
      <div className="flex-1 flex overflow-y-auto">
        {/* Left Section - Main Content */}
        <div className="flex-1 p-8 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <button
              onClick={() => navigate('/find-tutors')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tutors</span>
            </button>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8 max-w-md mx-auto">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step < currentStep
                      ? 'bg-blue-600 text-white'
                      : step === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-12 h-1 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div>
              {/* Step 1: Session Details */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Session Details</h2>
                  <p className="text-gray-600 mb-6">Choose your preferred date, time, and session format</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleFormChange('date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleFormChange('time', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <select
                        value={formData.duration}
                        onChange={(e) => handleFormChange('duration', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="3 hours">3 hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                      <select
                        value={formData.sessionType}
                        onChange={(e) => handleFormChange('sessionType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="Online">Online</option>
                        <option value="In-Person">In-Person</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleFormChange('notes', e.target.value)}
                        placeholder="What would you like to focus on?"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => navigate('/find-tutors')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Review Session Details */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Review Session Details</h2>
                  <p className="text-gray-600 mb-6">Please verify all information before proceeding to payment</p>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold">{formatDate(formData.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-semibold">{formatTime(formData.time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold">{formData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session Type</span>
                      <span className="font-semibold">{formData.sessionType}</span>
                    </div>
                    {formData.notes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Notes</span>
                        <span className="font-semibold text-right max-w-xs">{formData.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
                  <p className="text-gray-600 mb-6">Enter your card details to complete the booking</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={paymentData.cardholderName}
                        onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Complete Booking
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Session Booked Successfully!</h2>
                    <p className="text-gray-600">
                      Your session with {tutorData.name} has been confirmed. A confirmation email has been sent to your email address.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-8">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tutor</span>
                      <span className="font-semibold">{tutorData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold">{formatDate(formData.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-semibold">{formatTime(formData.time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-semibold text-blue-600">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleViewSessions}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View My Sessions
                    </button>
                    <button
                      onClick={() => navigate('/find-tutors')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back to Tutors
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-96 border-l border-gray-200 p-8 bg-gray-50">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          {/* Tutor Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{tutorData.name}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600">
                    {tutorData.rating} ({tutorData.reviews})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Details */}
          {formData.date && (
            <div className="mb-6 pb-6 border-b border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{formatDate(formData.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{formatTime(formData.time) || '01:11'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{formData.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{formData.sessionType}</span>
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Rate per hour</span>
              <span>${tutorData.hourly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Duration</span>
              <span>{formData.duration}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Platform Fee (10%)</span>
              <span>${getPlatformFee().toFixed(2)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-blue-600">${getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
