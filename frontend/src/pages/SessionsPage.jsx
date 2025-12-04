"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  User,
  Play,
  Users,
  MessageCircle,
  Settings,
  LayoutDashboard,
  Calendar,
  Clock,
  MoreHorizontal,
  Star,
  Plus,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import sessionService from "../services/sessionService";
import SessionModal from "./components/SessionModal";

export default function SessionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getSessions();
      setSessions(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sessions");
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await sessionService.deleteSession(sessionId);
      fetchSessions();
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const handleOpenModal = (session = null) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
    setIsModalOpen(false);
  };

  const handleSaveSession = async (sessionData) => {
    try {
      if (selectedSession) {
        await sessionService.updateSession(selectedSession.sessionId, sessionData);
      } else {
        await sessionService.createSession(sessionData);
      }
      fetchSessions();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving session:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <aside className="w-56 border-r border-gray-200 p-6 flex flex-col">
          <h1 className="mb-8 text-2xl font-bold">
            <span className="text-blue-600">Tutor</span>
            <span>IT</span>
          </h1>

          <nav className="space-y-4 flex-1">
            <NavItem 
              icon={<LayoutDashboard />} 
              label="Dashboard" 
              onClick={() => navigate('/dashboard')} 
            />
            
            <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
              <Play className="h-5 w-5" />
              Sessions
            </button>
            
            <NavItem 
              icon={<Users />} 
              label="Find Tutors" 
              onClick={() => navigate('/find-tutors')} 
            />
            <NavItem 
              icon={<MessageCircle />} 
              label="Messages" 
              onClick={() => navigate('/messages')} 
            />
            <NavItem 
              icon={<User />} 
              label="Students" 
              onClick={() => navigate('/students')} 
            />
            <NavItem 
              icon={<Settings />} 
              label="Settings" 
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <aside className="w-56 border-r border-gray-200 p-6 flex flex-col">
          <h1 className="mb-8 text-2xl font-bold">
            <span className="text-blue-600">Tutor</span>
            <span>IT</span>
          </h1>

          <nav className="space-y-4 flex-1">
            <NavItem 
              icon={<LayoutDashboard />} 
              label="Dashboard" 
              onClick={() => navigate('/dashboard')} 
            />
            
            <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
              <Play className="h-5 w-5" />
              Sessions
            </button>
            
            <NavItem 
              icon={<Users />} 
              label="Find Tutors" 
              onClick={() => navigate('/find-tutors')} 
            />
            <NavItem 
              icon={<MessageCircle />} 
              label="Messages" 
              onClick={() => navigate('/messages')} 
            />
            <NavItem 
              icon={<User />} 
              label="Students" 
              onClick={() => navigate('/students')} 
            />
            <NavItem 
              icon={<Settings />} 
              label="Settings" 
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Sessions</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchSessions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {isModalOpen && (
        <SessionModal
          session={selectedSession}
          onClose={handleCloseModal}
          onSave={handleSaveSession}
        />
      )}
      {/* Sidebar - Duplicated from Dashboard/FindTutors */}
      <aside className="w-56 border-r border-gray-200 p-6 flex flex-col">
        <h1 className="mb-8 text-2xl font-bold">
          <span className="text-blue-600">Tutor</span>
          <span>IT</span>
        </h1>

        <nav className="space-y-4 flex-1">
          <NavItem 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            onClick={() => navigate('/dashboard')} 
          />
          
          <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
            <Play className="h-5 w-5" />
            Sessions
          </button>
          
          <NavItem 
            icon={<Users />} 
            label="Find Tutors" 
            onClick={() => navigate('/find-tutors')} 
          />
          <NavItem 
            icon={<MessageCircle />} 
            label="Messages" 
            onClick={() => navigate('/messages')} 
          />
          <NavItem 
            icon={<User />} 
            label="Students" 
            onClick={() => navigate('/students')} 
          />
          <NavItem 
            icon={<Settings />} 
            label="Settings" 
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-gray-200 px-8 py-4 gap-6 sticky top-0 bg-white z-10">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Session
            </button>
            <Bell className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900" />
            <User className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900" />
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Sessions</h1>
            <p className="text-gray-600">Manage your active, upcoming, and completed tutoring sessions.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            <TabButton 
              active={activeTab === "active"} 
              onClick={() => setActiveTab("active")}
              label="Active & Upcoming"
            />
            <TabButton 
              active={activeTab === "completed"} 
              onClick={() => setActiveTab("completed")}
              label="Completed"
            />
            <TabButton 
              active={activeTab === "history"} 
              onClick={() => setActiveTab("history")}
              label="Session History"
            />
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === "active" && <ActiveUpcomingContent sessions={sessions} onEdit={handleOpenModal} onDelete={handleDeleteSession} />}
            {activeTab === "completed" && <CompletedContent sessions={sessions} onEdit={handleOpenModal} onDelete={handleDeleteSession} />}
            {activeTab === "history" && <HistoryContent sessions={sessions} onEdit={handleOpenModal} onDelete={handleDeleteSession} />}
          </div>
        </div>
      </main>
    </div>
  );
}

/* Components */

function NavItem({ icon, label, onClick }) {
  return (
    <div 
      onClick={onClick} 
      className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:text-gray-600 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
    >
      {icon}
      <span className="text-lg">{label}</span>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm transition-colors relative ${
        active 
          ? "text-blue-600 bg-blue-50 rounded-t-lg border-b-2 border-blue-600" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg"
      }`}
    >
      {label}
    </button>
  );
}

function ActiveUpcomingContent({ sessions, onEdit, onDelete }) {
  // Filter sessions based on status
  const activeSessions = sessions.filter(session => 
    session.status === "active" || session.status === "live"
  );
  
  const upcomingSessions = sessions.filter(session => 
    session.status === "scheduled" || session.status === "upcoming"
  );

  return (
    <>
      {/* Active Sessions */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-green-600">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-semibold">Active Sessions</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Currently running tutoring sessions</p>

        <div className="space-y-6">
          {activeSessions.length > 0 ? (
            activeSessions.map((session) => (
              <ActiveSessionCard 
                key={session.sessionId}
                session={session}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active sessions at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <Calendar className="w-5 h-5" />
          <h2 className="font-semibold">Upcoming Sessions</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Your scheduled tutoring sessions</p>

        <div className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <UpcomingSessionCard 
                key={session.sessionId}
                session={session}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming sessions scheduled</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ActiveSessionCard({ session, onEdit, onDelete }) {
  const { sessionId, tutorName, subject, topic, dateTime, duration, status, isScheduled } = session;

  return (
    <div className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tutorName || "Unknown Tutor"}</h3>
            <p className="text-sm text-blue-600">{subject || "Unknown Subject"}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isScheduled ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
        }`}>
          {status}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900">{topic || "No topic specified"}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Started at {dateTime ? new Date(dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {duration || 0} min
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          {isScheduled ? <Play className="w-4 h-4" /> : null}
          {isScheduled ? "Start Session" : "Join Session"}
        </button>
        <button 
          onClick={() => onEdit(session)}
          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onDelete(sessionId)}
          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function UpcomingSessionCard({ session, onEdit, onDelete }) {
  const { sessionId, tutorName, subject, topic, dateTime, duration } = session;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{tutorName || "Unknown Tutor"}</h3>
          <p className="text-sm text-gray-600">{subject || "Unknown Subject"}</p>
          <p className="text-sm font-medium text-gray-900 mt-1">{topic || "No topic specified"}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{dateTime ? new Date(dateTime).toLocaleDateString() : "N/A"}, {dateTime ? new Date(dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A"}</p>
          <p className="text-sm text-gray-500">{duration || 0} min</p>
        </div>
        <button 
          onClick={() => onEdit(session)}
          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onDelete(sessionId)}
          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function CompletedContent({ sessions, onEdit, onDelete }) {
  const completedSessions = sessions.filter(session => 
    session.status === "completed"
  );

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900">Completed Sessions</h2>
        <p className="text-sm text-gray-500">Your recently completed tutoring sessions with feedback</p>
      </div>

      <div className="space-y-4">
        {completedSessions.length > 0 ? (
          completedSessions.map((session) => (
            <CompletedSessionCard 
              key={session.sessionId}
              session={session}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No completed sessions yet</p>
          </div>
        )}
      </div>
    </section>
  );
}

function CompletedSessionCard({ session, onEdit, onDelete }) {
  const { sessionId, tutorName, subject, topic, rating, feedback, dateTime, duration } = session;

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tutorName || "Unknown Tutor"}</h3>
            <p className="text-sm text-gray-600">{subject || "Unknown Subject"}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{topic || "No topic specified"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm text-gray-500">{dateTime ? new Date(dateTime).toLocaleDateString() : "N/A"}</p>.
            <p className="text-sm text-gray-500">{duration || 0} min</p>
          </div>
          <button 
            onClick={() => onEdit(session)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(sessionId)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">({rating || 0}/5)</span>
      </div>
      
      <p className="text-sm text-gray-600 italic">"{feedback || "No feedback provided"}"</p>
    </div>
  );
}

function HistoryContent({ sessions, onEdit, onDelete }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-gray-900">Session History</h2>
          <p className="text-sm text-gray-500">All your tutoring sessions</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search sessions..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.sessionId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{session.tutorName || "Unknown Tutor"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.subject || "Unknown Subject"}</div>
                    <div className="text-sm text-gray-500">{session.topic || "No topic"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.dateTime ? new Date(session.dateTime).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.duration || 0} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      session.status === "completed" ? "bg-green-100 text-green-800" :
                      session.status === "active" || session.status === "live" ? "bg-blue-100 text-blue-800" :
                      session.status === "scheduled" || session.status === "upcoming" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {session.status || "unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(session)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(session.sessionId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Session History</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            You don't have any sessions yet. Schedule a session with a tutor to get started.
          </p>
        </div>
      )}
    </section>
  );
}