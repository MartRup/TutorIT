"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Users, BookOpen, Star, Clock, Loader2 } from "lucide-react";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalSessions: 0,
      activeTutors: 0,
      subjectsCovered: 0,
      averageRating: 0
    },
    activeSession: null,
    featuredTutors: []
  });

  useEffect(() => {
    // Check if user is logged in and fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Check auth status
        const authResponse = await fetch('http://localhost:8080/api/auth/status', {
          method: 'GET',
          credentials: 'include',
        });

        if (!authResponse.ok) {
          navigate('/login');
          return;
        }

        const authData = await authResponse.json();
        setUserData(authData);

        // Fetch dashboard statistics - handle 403 gracefully
        try {
          const statsResponse = await fetch('http://localhost:8080/api/dashboard/stats', {
            method: 'GET',
            credentials: 'include',
          });

          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setDashboardData(prev => ({ ...prev, stats }));
          } else {
            console.log('Dashboard stats endpoint not available (403), using defaults');
          }
        } catch (err) {
          console.log('Error fetching dashboard stats:', err);
        }

        // Fetch active session - handle 403 gracefully
        try {
          const activeSessionResponse = await fetch('http://localhost:8080/api/sessions/active', {
            method: 'GET',
            credentials: 'include',
          });

          if (activeSessionResponse.ok) {
            const activeSession = await activeSessionResponse.json();
            setDashboardData(prev => ({ ...prev, activeSession }));
          } else {
            console.log('Active session endpoint not available (403), using defaults');
          }
        } catch (err) {
          console.log('Error fetching active session:', err);
        }

        // Fetch featured tutors - handle 403 gracefully
        try {
          const tutorsResponse = await fetch('http://localhost:8080/api/tutors/featured', {
            method: 'GET',
            credentials: 'include',
          });

          if (tutorsResponse.ok) {
            const tutors = await tutorsResponse.json();
            setDashboardData(prev => ({ ...prev, featuredTutors: tutors }));
          } else {
            console.log('Featured tutors endpoint not available (403), using defaults');
          }
        } catch (err) {
          console.log('Error fetching featured tutors:', err);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Still set loading to false so user can see the page
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <Layout activePage="dashboard">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="dashboard">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold">
            Welcome Back{userData?.name ? `, ${userData.name}` : ''}!
          </h2>
          <p className="text-gray-600">Here's what's going on today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Stat
            label="Total Sessions"
            value={dashboardData.stats.totalSessions}
            icon={<CustomClock />}
          />
          <Stat
            label="Active Tutors"
            value={dashboardData.stats.activeTutors}
            icon={<Users />}
          />
          <Stat
            label="Subjects Covered"
            value={dashboardData.stats.subjectsCovered}
            icon={<CustomBookOpen />}
          />
          <Stat
            label="Average Rating"
            value={dashboardData.stats.averageRating ? dashboardData.stats.averageRating.toFixed(1) : 'N/A'}
            icon={<CustomStar />}
          />
        </div>

        {/* Active session */}
        <section className="rounded-lg bg-blue-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Play className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Active Session</h3>
          </div>
          {dashboardData.activeSession ? (
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold">{dashboardData.activeSession.subject}</h4>
              <p className="text-gray-600 text-sm">
                with {dashboardData.activeSession.tutorName}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Started: {new Date(dashboardData.activeSession.startTime).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-700">No active session at the moment.</p>
          )}
        </section>

        {/* Featured tutors */}
        <section className="rounded-lg bg-blue-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Featured Tutors</h3>
          </div>

          {dashboardData.featuredTutors.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {dashboardData.featuredTutors.map((tutor) => (
                <Tutor
                  key={tutor.id}
                  name={tutor.name}
                  subject={tutor.subject}
                  rating={tutor.rating}
                  imageUrl={tutor.imageUrl}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No featured tutors available at the moment.</p>
          )}
        </section>
      </div>
    </Layout>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-lg bg-blue-100 p-6">
      <div className="flex items-center gap-2 text-gray-700">
        <span className="text-sm font-semibold">{label}</span>
        {icon}
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function Tutor({ name, subject, rating, imageUrl }) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-20 w-full object-cover rounded-md mb-3"
        />
      ) : (
        <div className="h-20 bg-blue-200 rounded-md mb-3 flex items-center justify-center">
          <Users className="h-8 w-8 text-blue-400" />
        </div>
      )}
      <h4 className="font-semibold">{name}</h4>
      <p className="text-gray-600 text-sm">{subject}</p>
      {rating && (
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}

/* Icons */

function CustomClock({ className }) {
  return (
    <svg className={className + " h-4 w-4"} viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function CustomBookOpen({ className }) {
  return (
    <svg className={className + " h-4 w-4"} viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7h13" />
    </svg>
  );
}

function CustomStar({ className }) {
  return (
    <svg className={className + " h-4 w-4"} viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
