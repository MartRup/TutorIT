"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Share,
  MessageSquare,
  Users,
  Settings,
  Hand,
  MoreVertical,
  Maximize2
} from "lucide-react";
import Layout from "../components/Layout";
import sessionService from "../services/sessionService";

import Swal from 'sweetalert2';

export default function SessionRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("participants");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Session Details
        const sessionData = await sessionService.getSession(sessionId);
        
        // Handling for legacy sessions: If studentName is missing, fetch it
        if (!sessionData.studentName && sessionData.studentId) {
            try {
                const studentResponse = await fetch(`http://localhost:8080/students/${sessionData.studentId}`, {
                    credentials: 'include'
                });
                if (studentResponse.ok) {
                    const studentData = await studentResponse.json();
                    sessionData.studentName = studentData.name || studentData.username || "Student";
                }
            } catch (innerErr) {
                console.warn("Could not fetch student details", innerErr);
            }
        }

        setSession(sessionData);

        // 2. Fetch Current User Details to determine role
        const authResponse = await fetch('http://localhost:8080/api/auth/status', {
            credentials: 'include'
        });
        
        if (authResponse.ok) {
            const userData = await authResponse.json();
            setCurrentUser(userData);
        }

      } catch (err) {
        console.error("Error loading session room:", err);
        setError("Failed to load session details.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);

  const fetchMessages = async (convId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/messages/conversations/${convId}/messages`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setMessages(data.data);
                }
            }
        } catch (err) {
            console.error("Fetch messages failed", err);
        }
  };

  useEffect(() => {
    const setupChat = async () => {
        try {
            let convId = null;
            const isRoleTutor = currentUser.role === 'tutor';
            
            if (isRoleTutor) {
                // Tutor: Find conversation by student email
                let studentEmail = null;
                if (session.studentId) {
                     // Always fetch student email to be safe
                     const sRes = await fetch(`http://localhost:8080/students/${session.studentId}`, { credentials: 'include' });
                     if (sRes.ok) {
                         const sData = await sRes.json();
                         studentEmail = sData.email;
                     }
                }

                if (studentEmail) {
                    const convRes = await fetch('http://localhost:8080/api/messages/conversations', { credentials: 'include' });
                    if (convRes.ok) {
                        const convData = await convRes.json();
                        if (convData.success) {
                            const match = convData.data.find(c => c.studentEmail === studentEmail);
                            if (match) convId = match.id;
                        }
                    }
                }
            } else {
                // Student: Create/Get conversation
                // session.tutorId might be string, backend expects number in JSON? 
                // MessageController does Long.valueOf(request.get("tutorId").toString()) so string is fine.
                const res = await fetch('http://localhost:8080/api/messages/conversations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        tutorId: session.tutorId,
                        tutorName: session.tutorName,
                        tutorSubject: session.subject
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) convId = data.data.id;
                }
            }

            if (convId) {
                setConversationId(convId);
            }
        } catch (err) {
            console.error("Chat setup failed", err);
        }
    };

    if (session && currentUser) {
        setupChat();
    }
  }, [session, currentUser]);

  useEffect(() => {
        let interval;
        if (conversationId) {
            fetchMessages(conversationId);
            interval = setInterval(() => fetchMessages(conversationId), 3000);
        }
        return () => clearInterval(interval);
  }, [conversationId]);

  const handleEndSession = async () => {
    const result = await Swal.fire({
        title: 'End Session?',
        text: "Are you sure you want to end and complete this session?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, complete it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            // Update session status to 'room_completed' to indicate the call is done
            // We must send the FULL session object because the backend update method overwrites all fields.
            const updatedSession = { ...session, status: "room_completed" };
            await sessionService.updateSession(sessionId, updatedSession);

            if (currentUser?.role === 'tutor') {
                await Swal.fire({
                    title: 'Session Completed!',
                    text: 'The session has been marked as completed. Your compensation has been processed and credited to your account.',
                    icon: 'success',
                    confirmButtonText: 'Go to Dashboard'
                });
                navigate("/tutor-sessions");
            } else {
                await Swal.fire({
                    title: 'Session Ended',
                    text: 'Thank you for attending the session!',
                    icon: 'success',
                    confirmButtonText: 'Back to Sessions'
                });
                navigate("/student-sessions");
            }
        } catch (err) {
             console.error("Error ending session:", err);
             Swal.fire({
                title: 'Error',
                text: 'Failed to update session status. Please try again.',
                icon: 'error'
             });
        }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Connecting to session...</p>
        </div>
      </div>
    );
  }

  if (error || !session || !currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unavailable</h2>
            <p className="text-gray-500 mb-6">{error || "Session or user information not found."}</p>
            <button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                Back to Dashboard
            </button>
        </div>
      </div>
    );
  }

  // Determine who is "Remote" (the person I'm looking at)
  const isTutor = currentUser.role === 'tutor';
  
  // If I am the tutor, I see the student. If I am the student, I see the tutor.
  const remoteUser = {
    name: isTutor ? session.studentName : session.tutorName,
    role: isTutor ? "Student" : "Tutor",
    initials: (isTutor ? session.studentName : session.tutorName)?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "??"
  };

  const myInitials = (currentUser.name || currentUser.username || "Me").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const subject = session.subject || "General";
  const topic = session.topic || "Tutoring Session";



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    try {
        const res = await fetch(`http://localhost:8080/api/messages/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ messageText: newMessage })
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                setNewMessage("");
                fetchMessages(conversationId); // Refresh immediately
            }
        }
    } catch (err) {
        console.error("Send message failed", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg 
              className="w-6 h-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold text-gray-900">{subject}</h1>
            <div className="flex items-center gap-2">
                 <p className="text-sm text-gray-500">{topic}</p>
                 <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">Session #{sessionId}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleEndSession}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Phone className="w-4 h-4 rotate-[135deg]" />
          End Session
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Section - Video Area (Showing the REMOTE USER) */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Main Video Source */}
          <div className="flex-1 bg-cyan-50 rounded-2xl relative flex flex-col items-center justify-center border border-gray-200 shadow-sm">
            {/* Live Badge */}
            <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
              Live
            </div>

            {/* Profile Avatar/Video Placeholder */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4 bg-gray-200">
                {/* Placeholder Image or User Icon if no image */}
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-4xl text-gray-600 font-bold">{remoteUser.initials}</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{remoteUser.name}</h2>
              <div className="flex items-center justify-center gap-2">
                <p className="text-gray-500">{isVideoOn ? "Camera is on" : "Camera is off"}</p>
                {isMicOn ? <Mic className="w-4 h-4 text-gray-500" /> : <MicOff className="w-4 h-4 text-red-500" />}
              </div>
              <p className="text-sm text-blue-600 font-medium mt-1">{remoteUser.role}</p>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="bg-cyan-50 rounded-2xl p-4 flex items-center justify-between border border-gray-200 shadow-sm h-20">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                    <div className="w-full h-full flex items-center justify-center bg-gray-400">
                        <span className="text-sm font-bold text-white">{remoteUser.initials}</span>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{remoteUser.name}</h3>
                    <p className="text-sm text-gray-500">{subject}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-gray-500">
                <Users className="w-4 h-4" /> 
                <span className="text-sm">{session.duration || 60} min session</span>
             </div>
          </div>

          {/* Controls Bar */}
          <div className="flex justify-center gap-4 py-2">
            <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-blue-600 text-white shadow-lg' : 'bg-red-100 text-red-600'}`}
            >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOn ? 'bg-blue-600 text-white shadow-lg' : 'bg-red-100 text-red-600'}`}
            >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors">
                <Share className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors">
                <Hand className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors">
                <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section - Sidebar */}
        <div className="w-80 bg-white rounded-2xl border border-gray-200 flex flex-col shadow-sm">
          {/* Sidebar Tabs */}
          <div className="flex p-2 gap-2 border-b border-gray-100">
            <button 
                onClick={() => setActiveTab("participants")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'participants' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Users className="w-4 h-4" />
                Participants
            </button>
            <button 
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <MessageSquare className="w-4 h-4" />
                Chat
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'participants' && (
                <div className="flex-1 p-4 overflow-y-auto">
                   <h3 className="font-bold text-gray-900 mb-4">2 Participants</h3>
                   
                   <div className="space-y-4">
                       {/* Remote User (The person we are talking to) */}
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-500">{remoteUser.initials}</span> 
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{remoteUser.name}</p>
                                <p className="text-xs text-gray-500">{remoteUser.role}</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       </div>

                       {/* Local User (Me) */}
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                                {myInitials}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">You (you)</p>
                                <p className="text-xs text-gray-500">{isTutor ? "Tutor" : "Student"}</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       </div>
                   </div>
                </div>
            )}
            
            {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col h-full">
                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-400 mt-10">
                                <p>No messages yet.</p>
                                <p className="text-xs">Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            />
                            <button 
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="absolute right-1 top-1 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
