"use client";

import { useState } from "react";
import {
  Bell,
  User,
  Play,
  Users,
  MessageCircle,
  Settings,
  LayoutDashboard,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Sidebar Component (Duplicated for now) ---
function NavItem({ icon, label, onClick, isActive }) {
  return (
    <div 
      onClick={onClick} 
      className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${isActive ? 'text-blue-600 bg-blue-50 rounded-lg' : 'text-gray-800 hover:text-gray-600'}`}
    >
      {icon}
      <span className={`text-lg ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </div>
  );
}

// --- Dummy Data ---
const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Mathematics",
    status: "Online now",
    lastMessage: "Thanks for the calculus help! When can...",
    time: "10:30 AM",
    unread: 0,
    avatarColor: "bg-green-500"
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Physics",
    status: "Offline",
    lastMessage: "I'm still confused about quantum mech...",
    time: "Yesterday",
    unread: 1,
    avatarColor: "bg-gray-300"
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Chemistry",
    status: "Online now",
    lastMessage: "Perfect! The organic chemistry session...",
    time: "Yesterday",
    unread: 0,
    avatarColor: "bg-green-500"
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    role: "Statistics",
    status: "Offline",
    lastMessage: "Can we reschedule tomorrow's session",
    time: "Mon",
    unread: 0,
    avatarColor: "bg-gray-300"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Biology",
    status: "Online now",
    lastMessage: "The cell biology diagrams you shared...",
    time: "Mon",
    unread: 0,
    avatarColor: "bg-green-500"
  }
];

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    text: "Hi! I wanted to thank you for yesterday's calculus session. The way you explained derivatives finally made it click for me!",
    time: "10:30 AM",
    isMe: false
  },
  {
    id: 2,
    sender: "Me",
    text: "I'm so glad to hear that! Derivatives can be tricky at first, but once you understand the concept, everything else builds on it naturally.",
    time: "10:32 AM",
    isMe: true
  },
  {
    id: 3,
    sender: "Me",
    text: "Did you get a chance to work on the practice problems I sent you?",
    time: "10:32 AM",
    isMe: true
  },
  {
    id: 4,
    sender: "Sarah Johnson",
    text: "Yes! I completed most of them. I got stuck on problem 7 though. Could we go over it in our next session?",
    time: "10:45 AM",
    isMe: false
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    text: "Also, when would be a good time to schedule our next session? I'm free most afternoons this week.",
    time: "10:46 AM",
    isMe: false
  },
  {
    id: 6,
    sender: "Me",
    text: "Problem 7 involves the chain rule, which we can definitely review. How about Thursday at 2 PM?",
    time: "11:15 AM",
    isMe: true
  },
  {
    id: 7,
    sender: "Sarah Johnson",
    text: "Thanks for the calculus help! When can we schedule the next session?",
    time: "Just now",
    isMe: false
  }
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(1);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-60 border-r border-gray-200 p-6 flex flex-col">
        <h1 className="mb-8 text-2xl font-bold">
          <span className="text-blue-600">Tutor</span>
          <span>IT</span>
        </h1>

        <nav className="space-y-4 flex-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" onClick={() => navigate('/dashboard')} />
          <NavItem icon={<Play />} label="Sessions" />
          <NavItem icon={<Users />} label="Find Tutors" onClick={() => navigate('/find-tutors')} />
          
          <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
            <MessageCircle className="h-5 w-5" />
            Messages
          </button>
          
          <NavItem icon={<Settings />} label="Settings" onClick={() => navigate('/settings')} />
        </nav>
      </aside>

      {/* Messages Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Conversation List */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div 
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 hover:bg-white cursor-pointer transition-colors border-l-4 ${selectedConversation === conv.id ? 'bg-white border-blue-500' : 'border-transparent'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-gray-600">{conv.name.charAt(0)}</span>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${conv.status.includes('Online') ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{conv.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-gray-600">S</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Sarah Johnson</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Mathematics • Online now</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-gray-500">
              <Phone className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              <Video className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-700" />
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!msg.isMe && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600">S</span>
                    </div>
                  )}
                  <div>
                    <div 
                      className={`p-4 rounded-2xl ${
                        msg.isMe 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <p className={`text-xs text-gray-400 mt-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500"
              />
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
