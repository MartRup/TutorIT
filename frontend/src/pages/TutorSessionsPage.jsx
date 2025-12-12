"use client";

import { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    Star,
    Plus,
    Edit,
    Video,
    User,
    Play,
    Loader2,
    BookOpen,
    CheckCircle,
    XCircle,
    Users,
    DollarSign,
    TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import sessionService from "../services/sessionService";
import Layout from "../components/Layout";
import Swal from 'sweetalert2';

export default function TutorSessionsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("upcoming");
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [stats, setStats] = useState({
        totalSessions: 0,
        totalStudents: 0,
        totalEarnings: 0,
        averageRating: 0
    });

    useEffect(() => {
        checkUserRole();
        fetchSessions();
        fetchStats();
    }, []);

    const checkUserRole = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/status', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                navigate('/login');
                return;
            }

            const data = await response.json();
            setUserRole(data.role);

            // Redirect students to student sessions page
            if (data.role === 'student') {
                navigate('/sessions');
            }
        } catch (error) {
            console.error('Error checking user role:', error);
            navigate('/login');
        }
    };

    const fetchSessions = async () => {
        try {
            setLoading(true);
            console.log('Fetching tutor sessions from API...');

            const response = await fetch('http://localhost:8080/api/tutoring-sessions', {
                method: 'GET',
                credentials: 'include',
            });

            console.log('Tutor sessions API response status:', response.status);

            if (!response.ok) {
                if (response.status === 404 || response.status === 403) {
                    // No sessions found or not authorized - show empty state
                    console.log('No tutor sessions available or not authorized');
                    setSessions([]);
                    setError(null);
                    setLoading(false);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched tutor sessions:', data);
            setSessions(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching tutor sessions:", err);
            // Don't show error screen, just show empty state
            setSessions([]);
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            console.log('Fetching tutor stats from /api/tutors/stats...');
            const response = await fetch('http://localhost:8080/api/tutors/stats', {
                method: 'GET',
                credentials: 'include',
            });

            console.log('Stats API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched tutor stats:', data);
                setStats(data);
            } else {
                const errorText = await response.text();
                console.log('Tutor stats endpoint error:', response.status, errorText);
            }
        } catch (err) {
            console.error('Error fetching tutor stats:', err);
        }
    };

    const handleStartSession = (sessionId) => {
        navigate(`/session/${sessionId}`);
    };

    const handleCancelSession = async (sessionId) => {
        const result = await Swal.fire({
            title: 'Cancel Session?',
            text: 'Are you sure you want to cancel this tutoring session? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, cancel it',
            cancelButtonText: 'No, keep it'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await fetch(`http://localhost:8080/api/tutoring-sessions/${sessionId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            
            await Swal.fire({
                title: 'Cancelled!',
                text: 'The session has been cancelled successfully.',
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
            
            fetchSessions();
            fetchStats();
        } catch (err) {
            console.error("Error canceling session:", err);
            await Swal.fire({
                title: 'Error!',
                text: 'Failed to cancel session. Please try again.',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    const handleCompleteSession = async (sessionId) => {
        try {
            await fetch(`http://localhost:8080/api/tutoring-sessions/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: 'completed' }),
            });
            fetchSessions();
            fetchStats();
        } catch (err) {
            console.error("Error completing session:", err);
        }
    };

    if (loading) {
        return (
            <Layout activePage="sessions">
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </Layout>
        );
    }

    const upcomingSessions = sessions.filter(s =>
        s.status === 'scheduled' || s.status === 'upcoming' || s.status === 'active'
    );
    const completedSessions = sessions.filter(s => s.status === 'completed' || s.status === 'room_completed');

    console.log('[TUTOR] Total sessions:', sessions.length);
    console.log('[TUTOR] Upcoming sessions:', upcomingSessions.length, upcomingSessions);
    console.log('[TUTOR] Completed sessions:', completedSessions.length, completedSessions);

    return (
        <Layout activePage="sessions">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Teaching Sessions</h1>
                    <p className="text-gray-600">Manage your tutoring sessions and track your performance</p>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<Calendar className="h-5 w-5 text-blue-600" />}
                        label="Total Sessions"
                        value={stats.totalSessions}
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        icon={<Users className="h-5 w-5 text-green-600" />}
                        label="Total Students"
                        value={stats.totalStudents}
                        bgColor="bg-green-50"
                    />
                    <StatCard
                        icon={<DollarSign className="h-5 w-5 text-purple-600" />}
                        label="Total Earnings"
                        value={`$${stats.totalEarnings || 0}`}
                        bgColor="bg-purple-50"
                    />
                    <StatCard
                        icon={<Star className="h-5 w-5 text-yellow-600" />}
                        label="Average Rating"
                        value={stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                        suffix={stats.averageRating ? '/5' : ''}
                        bgColor="bg-yellow-50"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <TabButton
                        active={activeTab === "upcoming"}
                        onClick={() => setActiveTab("upcoming")}
                        label="Upcoming Sessions"
                        count={upcomingSessions.length}
                    />
                    <TabButton
                        active={activeTab === "completed"}
                        onClick={() => setActiveTab("completed")}
                        label="Completed Sessions"
                        count={completedSessions.length}
                    />
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === "upcoming" && (
                        <UpcomingSessionsTab
                            sessions={upcomingSessions}
                            onStart={handleStartSession}
                            onCancel={handleCancelSession}
                        />
                    )}
                    {activeTab === "completed" && (
                        <CompletedSessionsTab
                            sessions={completedSessions}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
}

// Components
function StatCard({ icon, label, value, suffix = "", bgColor }) {
    return (
        <div className={`${bgColor} rounded-xl p-6`}>
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
                {value}
                {suffix && <span className="text-lg text-gray-600 ml-1">{suffix}</span>}
            </p>
        </div>
    );
}

function TabButton({ active, onClick, label, count }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${active
                ? "text-blue-600 bg-blue-50 rounded-t-lg border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg"
                }`}
        >
            {label}
            {count !== undefined && count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );
}

function UpcomingSessionsTab({ sessions, onStart, onCancel }) {
    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Sessions</h3>
                <p className="text-gray-500 mb-2">You don't have any scheduled sessions yet.</p>
                <p className="text-gray-400 text-sm">Sessions will appear here when students book with you.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <TutorUpcomingSessionCard
                    key={session.sessionId}
                    session={session}
                    onStart={onStart}
                    onCancel={onCancel}
                />
            ))}
        </div>
    );
}

function TutorUpcomingSessionCard({ session, onStart, onCancel }) {
    const sessionDate = new Date(session.dateTime);
    const isToday = sessionDate.toDateString() === new Date().toDateString();
    const canStart = session.status === 'active' || isToday;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                        {session.studentName?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">{session.studentName || 'Unknown Student'}</h3>
                        <p className="text-blue-600 font-medium">{session.subject || 'Unknown Subject'}</p>
                        <p className="text-gray-600 text-sm mt-1">{session.topic || 'No topic specified'}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {session.status === 'active' ? 'Ready to Start' : 'Scheduled'}
                </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{sessionDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration || 0} min</span>
                </div>
                {session.price && (
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>${session.price}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                {canStart && (
                    <button
                        onClick={() => onStart(session.sessionId)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Play className="h-4 w-4" />
                        Start Session
                    </button>
                )}
                <button
                    onClick={() => onCancel(session.sessionId)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function CompletedSessionsTab({ sessions }) {
    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Sessions</h3>
                <p className="text-gray-500">Your completed sessions will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <TutorCompletedSessionCard
                    key={session.sessionId}
                    session={session}
                />
            ))}
        </div>
    );
}

function TutorCompletedSessionCard({ session }) {
    const sessionDate = new Date(session.dateTime);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">{session.studentName || 'Unknown Student'}</h3>
                        <p className="text-gray-600 font-medium">{session.subject || 'Unknown Subject'}</p>
                        <p className="text-gray-500 text-sm mt-1">{session.topic || 'No topic specified'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 block mb-2">
                        Completed
                    </span>
                    {session.price && (
                        <span className="text-green-600 font-semibold">${session.price}</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{sessionDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration || 0} min</span>
                </div>
            </div>

            {/* Student Rating */}
            {session.rating && (
                <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">Student Rating:</p>
                    <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-5 w-5 ${star <= session.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({session.rating}/5)</span>
                    </div>
                    {session.feedback && (
                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">"{session.feedback}"</p>
                    )}
                </div>
            )}
        </div>
    );
}

function AnalyticsTab({ sessions, stats }) {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalHours = completedSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60;

    // Calculate subject distribution
    const subjectStats = {};
    completedSessions.forEach(session => {
        const subject = session.subject || 'Unknown';
        if (!subjectStats[subject]) {
            subjectStats[subject] = { count: 0, totalRating: 0, ratingCount: 0 };
        }
        subjectStats[subject].count++;
        if (session.rating) {
            subjectStats[subject].totalRating += session.rating;
            subjectStats[subject].ratingCount++;
        }
    });

    return (
        <div className="space-y-6">
            {/* Performance Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Performance Overview
                </h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Total Teaching Hours</p>
                        <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)} hrs</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {sessions.length > 0
                                ? ((completedSessions.length / sessions.length) * 100).toFixed(0)
                                : 0}%
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Average Session Length</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {completedSessions.length > 0
                                ? (totalHours * 60 / completedSessions.length).toFixed(0)
                                : 0} min
                        </p>
                    </div>
                </div>
            </div>

            {/* Subject Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Subject Breakdown
                </h3>
                <div className="space-y-4">
                    {Object.entries(subjectStats).map(([subject, data]) => (
                        <div key={subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">{subject}</h4>
                                <p className="text-sm text-gray-600">{data.count} sessions</p>
                            </div>
                            <div className="text-right">
                                {data.ratingCount > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium">
                                            {(data.totalRating / data.ratingCount).toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {Object.keys(subjectStats).length === 0 && (
                        <p className="text-center text-gray-500 py-8">No data available yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
