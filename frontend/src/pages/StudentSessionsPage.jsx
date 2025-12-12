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
    XCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import sessionService from "../services/sessionService";
import Layout from "../components/Layout";

export default function StudentSessionsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("upcoming");
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        checkUserRole();
        fetchSessions();

        // Refresh sessions when the page becomes visible (e.g., after booking)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchSessions();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Check if we need to refresh based on navigation state
    useEffect(() => {
        if (location.state?.refresh) {
            console.log('Refreshing sessions after booking...');
            // Add a small delay to ensure backend has processed the session
            setTimeout(() => {
                fetchSessions();
            }, 300);
            // Clear the state to prevent repeated refreshes
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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

            // Redirect tutors to tutor sessions page
            if (data.role === 'tutor') {
                navigate('/tutor-sessions');
            }
        } catch (error) {
            console.error('Error checking user role:', error);
            navigate('/login');
        }
    };

    const fetchSessions = async () => {
        try {
            setLoading(true);
            console.log('Fetching sessions from API...');

            const response = await fetch('http://localhost:8080/api/tutoring-sessions', {
                method: 'GET',
                credentials: 'include',
            });

            console.log('Sessions API response status:', response.status);

            if (!response.ok) {
                if (response.status === 404 || response.status === 403) {
                    // No sessions found or not authorized - show empty state
                    console.log('No sessions available or not authorized');
                    setSessions([]);
                    setError(null);
                    setLoading(false);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched sessions:', data);
            setSessions(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching sessions:", err);
            // Don't show error screen, just show empty state
            setSessions([]);
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSession = async (sessionId) => {
        if (!window.confirm('Are you sure you want to cancel this session?')) {
            return;
        }

        try {
            await sessionService.deleteSession(sessionId);
            fetchSessions();
        } catch (err) {
            console.error("Error canceling session:", err);
            alert('Failed to cancel session. Please try again.');
        }
    };

    const handleJoinSession = (sessionId) => {
        navigate(`/session/${sessionId}`);
    };

    const handleRateSession = async (sessionId, rating, feedback) => {
        try {
            await sessionService.updateSession(sessionId, { rating, feedback, status: 'completed' });
            fetchSessions();
        } catch (err) {
            console.error("Error rating session:", err);
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

    if (error) {
        return (
            <Layout activePage="sessions">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Sessions</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={fetchSessions}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const upcomingSessions = sessions.filter(s =>
        s.status === 'scheduled' || s.status === 'upcoming' || s.status === 'active'
    );
    const completedSessions = sessions.filter(s => s.status === 'completed');

    console.log('Total sessions:', sessions.length);
    console.log('Upcoming sessions:', upcomingSessions.length, upcomingSessions);
    console.log('Completed sessions:', completedSessions.length, completedSessions);

    return (
        <Layout activePage="sessions">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Learning Sessions</h1>
                    <p className="text-gray-600">Manage your tutoring sessions and track your progress</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <StatCard
                        icon={<Calendar className="h-5 w-5 text-blue-600" />}
                        label="Upcoming Sessions"
                        value={upcomingSessions.length}
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                        label="Completed Sessions"
                        value={completedSessions.length}
                        bgColor="bg-green-50"
                    />
                    <StatCard
                        icon={<Clock className="h-5 w-5 text-purple-600" />}
                        label="Total Hours"
                        value={sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60}
                        suffix="hrs"
                        bgColor="bg-purple-50"
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
                            onJoin={handleJoinSession}
                            onCancel={handleCancelSession}
                        />
                    )}
                    {activeTab === "completed" && (
                        <CompletedSessionsTab
                            sessions={completedSessions}
                            onRate={handleRateSession}
                        />
                    )}
                </div>

                {/* Book New Session Button */}
                <button
                    onClick={() => navigate('/find-tutors')}
                    className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all hover:shadow-xl"
                >
                    <Plus className="h-5 w-5" />
                    Book New Session
                </button>
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
                {typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}
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
            {count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );
}

function UpcomingSessionsTab({ sessions, onJoin, onCancel }) {
    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Sessions</h3>
                <p className="text-gray-500 mb-6">You don't have any scheduled sessions yet.</p>
                <button
                    onClick={() => window.location.href = '/find-tutors'}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Find a Tutor
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <UpcomingSessionCard
                    key={session.sessionId}
                    session={session}
                    onJoin={onJoin}
                    onCancel={onCancel}
                />
            ))}
        </div>
    );
}

function UpcomingSessionCard({ session, onJoin, onCancel }) {
    const sessionDate = new Date(session.dateTime);
    const isToday = sessionDate.toDateString() === new Date().toDateString();
    const canJoin = session.status === 'active' || isToday;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {session.tutorName?.charAt(0) || 'T'}
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-lg text-gray-900">{session.tutorName || 'Unknown Tutor'}</h3>
                        <p className="text-blue-600 font-medium">{session.subject || 'Unknown Subject'}</p>
                        <p className="text-gray-600 text-sm mt-1">{session.topic || 'No topic specified'}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {session.status === 'active' ? 'Live Now' : 'Scheduled'}
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
            </div>

            <div className="flex gap-3 justify-end">
                {canJoin && (
                    <button
                        onClick={() => onJoin(session.sessionId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Video className="h-4 w-4" />
                        Join Session
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

function CompletedSessionsTab({ sessions, onRate }) {
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
                <CompletedSessionCard
                    key={session.sessionId}
                    session={session}
                    onRate={onRate}
                />
            ))}
        </div>
    );
}

function CompletedSessionCard({ session, onRate }) {
    const sessionDate = new Date(session.dateTime);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-lg text-gray-900">{session.tutorName || 'Unknown Tutor'}</h3>
                        <p className="text-blue-600 font-medium">{session.subject || 'Unknown Subject'}</p>
                        <p className="text-gray-500 text-sm mt-1">{session.topic || 'No topic specified'}</p>
                    </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Completed
                </span>
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

            {/* Rating */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-5 w-5 ${star <= (session.rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                                }`}
                        />
                    ))}
                    {session.rating && (
                        <span className="text-sm text-gray-600 ml-2">({session.rating}/5)</span>
                    )}
                </div>
                {session.feedback && (
                    <p className="text-sm text-gray-600 italic">"{session.feedback}"</p>
                )}
            </div>
        </div>
    );
}
