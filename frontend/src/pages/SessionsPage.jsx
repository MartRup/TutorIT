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
  Calendar,
  Clock,
  MoreHorizontal,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SessionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="flex h-screen bg-white">
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
        <header className="flex items-center justify-end border-b border-gray-200 px-8 py-4 gap-6 sticky top-0 bg-white z-10">
          <Bell className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900" />
          <User className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900" />
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
            {activeTab === "active" && <ActiveUpcomingContent />}
            {activeTab === "completed" && <CompletedContent />}
            {activeTab === "history" && <HistoryContent />}
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

function ActiveUpcomingContent() {
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
          <ActiveSessionCard 
            tutorName="Sarah Johnson"
            subject="Mathematics"
            topic="Calculus - Derivatives"
            startTime="2:00 PM"
            duration="45 min"
            status="Live"
          />
          <ActiveSessionCard 
            tutorName="Mike Chen"
            subject="Physics"
            topic="Quantum Mechanics"
            startTime="3:30 PM"
            duration="60 min"
            status="Scheduled"
            isScheduled={true}
          />
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
          <UpcomingSessionCard 
            tutorName="David Kim"
            subject="Computer Science"
            topic="Data Structures - Trees"
            date="Tomorrow"
            time="10:00 AM"
            duration="60 min"
          />
          <UpcomingSessionCard 
            tutorName="Rachel Green"
            subject="English Literature"
            topic="Shakespeare Analysis"
            date="Tomorrow"
            time="2:00 PM"
            duration="90 min"
          />
        </div>
      </section>
    </>
  );
}

function ActiveSessionCard({ tutorName, subject, topic, startTime, duration, status, isScheduled }) {
  return (
    <div className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tutorName}</h3>
            <p className="text-sm text-blue-600">{subject}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isScheduled ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
        }`}>
          {status}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900">{topic}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Started at {startTime}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {duration}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          {isScheduled ? <Play className="w-4 h-4" /> : null}
          {isScheduled ? "Start Session" : "Join Session"}
        </button>
        {!isScheduled && (
          <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors">
            Pause
          </button>
        )}
        {isScheduled && (
          <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Message
          </button>
        )}
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function UpcomingSessionCard({ tutorName, subject, topic, date, time, duration }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{tutorName}</h3>
          <p className="text-sm text-gray-600">{subject}</p>
          <p className="text-sm font-medium text-gray-900 mt-1">{topic}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{date}, {time}</p>
        <p className="text-sm text-gray-500">{duration}</p>
      </div>
    </div>
  );
}

function CompletedContent() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900">Completed Sessions</h2>
        <p className="text-sm text-gray-500">Your recently completed tutoring sessions with feedback</p>
      </div>

      <div className="space-y-4">
        <CompletedSessionCard 
          tutorName="Emma Davis"
          subject="Chemistry"
          topic="Organic Chemistry - Reactions"
          rating={5}
          feedback="Excellent explanation of complex reactions!"
          date="Yesterday"
          duration="90 min"
        />
        <CompletedSessionCard 
          tutorName="Alex Rodriguez"
          subject="Statistics"
          topic="Probability Distributions"
          rating={4}
          feedback="Very helpful session, cleared up my confusion."
          date="2 days ago"
          duration="60 min"
        />
        <CompletedSessionCard 
          tutorName="Lisa Wang"
          subject="Biology"
          topic="Cell Biology - Mitosis"
          rating={5}
          feedback="Great visual explanations and examples!"
          date="3 days ago"
          duration="75 min"
        />
      </div>
    </section>
  );
}

function CompletedSessionCard({ tutorName, subject, topic, rating, feedback, date, duration }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tutorName}</h3>
            <p className="text-sm text-gray-600">{subject}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{topic}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{date}</p>
          <p className="text-sm text-gray-500">{duration}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">({rating}/5)</span>
      </div>
      
      <p className="text-sm text-gray-600 italic">"{feedback}"</p>
    </div>
  );
}

function HistoryContent() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Session History</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        Session history will be displayed here. Filter by date, subject, or student.
      </p>
    </section>
  );
}
