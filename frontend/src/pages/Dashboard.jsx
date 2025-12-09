"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Users, BookOpen, Star, Clock } from "lucide-react";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/status', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        
        if (!response.ok) {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };
    
    checkAuthStatus();
  }, [navigate]);
  return (
    <Layout activePage="dashboard">
      {/* Main section */}

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold">Welcome Back, User!</h2>
            <p className="text-gray-600">Here’s what’s going on today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Stat label="Total Sessions" icon={<Clock />} />
            <Stat label="Active Tutors" icon={<Users />} />
            <Stat label="Subjects Covered" icon={<BookOpen />} />
            <Stat label="Average Rating" icon={<Star />} />
          </div>

          {/* Active session */}
          <section className="rounded-lg bg-blue-100 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Play className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Active Session</h3>
            </div>
            <p className="text-gray-700">No active session at the moment.</p>
          </section>

          {/* Featured tutors */}
          <section className="rounded-lg bg-blue-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Featured Tutors</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Tutor name="John Doe" subject="Math" />
              <Tutor name="Sarah Lopez" subject="Science" />
              <Tutor name="Kevin Smith" subject="History" />
            </div>
          </section>
        </div>
      </Layout>
  );
};

function Stat({ label, icon }) {
  return (
    <div className="rounded-lg bg-blue-100 p-6">
      <div className="flex items-center gap-2 text-gray-700">
        <span className="text-sm font-semibold">{label}</span>
        {icon}
      </div>
      <p className="mt-4 text-gray-500 text-sm">No data</p>
    </div>
  );
}

function Tutor({ name, subject }) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
      <div className="h-20 bg-blue-200 rounded-md mb-3" />
      <h4 className="font-semibold">{name}</h4>
      <p className="text-gray-600 text-sm">{subject}</p>
    </div>
  );
}

/* Icons */

function Clock({ className }) {
  return (
    <svg className={className + " h-4 w-4"} viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function BookOpen({ className }) {
  return (
    <svg className={className + " h-4 w-4"} viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7h13" />
    </svg>
  );
}

function Star({ className }) {
  return (
    <svg className={className + " h-4 w-4"} viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
