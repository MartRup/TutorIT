"use client";

import {
  Bell,
  User,
  Play,
  Users,
  MessageCircle,
  Settings
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-200 p-6">
        <h1 className="mb-8 text-2xl font-bold">
          <span className="text-blue-600">Tutor</span>
          <span>T</span>
        </h1>

        <nav className="space-y-4">
          <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white">
            Dashboard
          </button>

          <NavItem icon={<Play />} label="Sessions" />
          <NavItem icon={<Users />} label="Find Tutors" />
          <NavItem icon={<MessageCircle />} label="Messages" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
      </aside>

      {/* Main section */}
      <main className="flex-1">
        <header className="flex items-center justify-end border-b border-gray-200 px-8 py-4 gap-6">
          <Bell className="h-6 w-6 text-gray-700" />
          <User className="h-6 w-6 text-gray-700" />
        </header>

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
      </main>
    </div>
  );
}

/* Components that feel more hand-written */

function NavItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:text-gray-600 cursor-pointer">
      {icon}
      <span className="text-lg">{label}</span>
    </div>
  );
}

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
