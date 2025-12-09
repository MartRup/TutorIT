"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronDown,
  Radio,
  Star,
  Users,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function BookSession() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("2 hours");
  const [sessionType, setSessionType] = useState("Online");
  const [note, setNote] = useState("");

  // Mock tutor data - in real app, this would come from route params or state
  const tutorData = {
    name: "Liam Ruperez",
    rating: 5,
    reviews: 56,
    ratePerHour: 69.00,
    platformFee: 10.00
  };

  const calculateTotal = () => {
    const hours = duration === "1 hour" ? 1 : duration === "2 hours" ? 2 : duration === "3 hours" ? 3 : 1;
    const subtotal = tutorData.ratePerHour * hours;
    return subtotal + tutorData.platformFee;
  };

  const hours = duration === "1 hour" ? 1 : duration === "2 hours" ? 2 : duration === "3 hours" ? 3 : 1;
  const subtotal = tutorData.ratePerHour * hours;
  const total = calculateTotal();

  return (
    <Layout activePage="find-tutors">
      {/* Main Content */}

        {/* Content Area */}
        <div className="flex-1 flex overflow-y-auto">
          {/* Left Section - Session Details */}
          <div className="flex-1 p-8">
            <button
              onClick={() => navigate('/find-tutors')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tutors</span>
            </button>

            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-8">Session Details</h2>

              {/* Date Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Time Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-10"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Duration Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Session Type Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type
                </label>
                <div className="relative">
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Note Textarea */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note for the Instructor (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What to focus on the subject?"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/find-tutors')}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle continue action
                    console.log('Continue booking...');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="w-80 border-l border-gray-200 p-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Tutor Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tutorData.name}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 text-yellow-400 fill-yellow-400" 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({tutorData.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Overview */}
            <div className="mb-6 pb-6 border-b border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{hours} hour(s)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Radio className="h-5 w-5 text-gray-500" />
                <span>(()) {sessionType}</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Rate per Hour</span>
                <span>${tutorData.ratePerHour.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Duration</span>
                <span>{hours} Hour(s)</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Platform Fee</span>
                <span>${tutorData.platformFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-red-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
  );
}

