"use client"

import { useState } from "react"
import { Bell, User, BookOpen, Play, Users, MessageCircle, Settings, LayoutDashboard } from "lucide-react"
import { useNavigate } from "react-router-dom"

const TutorCard = ({
  name,
  institution,
  rating,
  reviews,
  hourly,
  subjects,
  location,
  schedule,
  availability,
  experience,
}) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      {/* Profile Section */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h3 className="font-bold text-black">{name}</h3>
            <span className="text-blue-600">✓</span>
          </div>
          <p className="text-sm text-gray-600">{institution}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-yellow-400">★★★★★</div>
        <span className="text-sm text-gray-600">({reviews} reviews)</span>
      </div>

      {/* Hourly Rate */}
      <p className="font-bold text-blue-600 mb-3">${hourly}/hour</p>

      {/* Subjects */}
      <div className="flex flex-wrap gap-2 mb-4">
        {subjects.map((subject) => (
          <span
            key={subject}
            className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded"
          >
            {subject}
          </span>
        ))}
      </div>

      {/* Location and Schedule */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <span>📍 {location}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700">{schedule}</span>
          <span
            className={
              availability === "Available"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {availability}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <span>👤 {experience} years experience</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition">
          Book Session
        </button>

        <button className="flex-1 border-2 border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-50 transition">
          Message
        </button>
      </div>
    </div>
  )
}

function NavItem({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:text-gray-600 cursor-pointer">
      {icon}
      <span className="text-lg">{label}</span>
    </div>
  );
}

export default function FindTutorsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const tutors = [
    {
      name: "Joseph Valmera",
      institution: "San Jose Recoletos",
      rating: 5,
      reviews: 127,
      hourly: 45,
      subjects: ["Calculus", "Linear Algebra", "Statistics"],
      location: "Boston, MA • Online",
      schedule: "Weekdays, Evenings",
      availability: "Available",
      experience: 8,
    },
    {
      name: "Raymart Banico",
      institution: "Cebu Institute of Technology (CEIT)",
      rating: 5,
      reviews: 89,
      hourly: 50,
      subjects: ["Python", "Java", "Data Structures"],
      location: "San Francisco, CA • Online",
      schedule: "Weekends, Evenings",
      availability: "Limited",
      experience: 5,
    },
    {
      name: "Liam Ruperez",
      institution: "L.A. English Literature, NYU",
      rating: 5,
      reviews: 56,
      hourly: 35,
      subjects: ["Essay Writing", "Literature"],
      location: "San Francisco, CA • Online",
      schedule: "Weekends, Evenings",
      availability: "Limited",
      experience: 5,
    },
    {
      name: "Tutor 4",
      institution: "Physics Institute",
      rating: 5,
      reviews: 92,
      hourly: 40,
      subjects: ["Physics", "Quantum Mechanics", "Astronomy"],
      location: "Los Angeles, CA • Online",
      schedule: "Weekdays, Afternoons",
      availability: "Available",
      experience: 10,
    },
    {
      name: "Tutor 5",
      institution: "History Department",
      rating: 5,
      reviews: 71,
      hourly: 38,
      subjects: ["World History", "US History", "Political Science"],
      location: "Chicago, IL • Online",
      schedule: "Weekdays, Evenings",
      availability: "Limited",
      experience: 6,
    },
    {
      name: "Tutor 6",
      institution: "Economics School",
      rating: 5,
      reviews: 64,
      hourly: 42,
      subjects: ["Business", "Economics", "Finance"],
      location: "Remote Only • Online",
      schedule: "Weekdays, Evenings",
      availability: "Available",
      experience: 7,
    },
    {
      name: "Tutor 7",
      institution: "Science Academy",
      rating: 5,
      reviews: 85,
      hourly: 44,
      subjects: ["Chemistry", "Biology", "Organic Chemistry"],
      location: "Berkeley, CA • Hybrid",
      schedule: "Weekdays, Afternoons",
      availability: "Available",
      experience: 8,
    },
    {
      name: "Tutor 8",
      institution: "Creative Arts Institute",
      rating: 5,
      reviews: 68,
      hourly: 36,
      subjects: ["Creative Writing", "Poetry", "Fiction"],
      location: "New York, NY • Online",
      schedule: "Weekdays, Mornings",
      availability: "Limited",
      experience: 6,
    },
    {
      name: "Tutor 9",
      institution: "Languages Center",
      rating: 5,
      reviews: 79,
      hourly: 32,
      subjects: ["Spanish", "French", "ESL"],
      location: "Austin, TX • Hybrid",
      schedule: "Weekdays, Evenings",
      availability: "Available",
      experience: 4,
    },
    {
      name: "Tutor 10",
      institution: "Technology Institute",
      rating: 5,
      reviews: 93,
      hourly: 48,
      subjects: ["Circuits", "Electronics", "Engineering"],
      location: "Atlanta, GA • Online",
      schedule: "Weekends Only",
      availability: "Limited",
      experience: 9,
    },
    {
      name: "Tutor 11",
      institution: "Music Theory School",
      rating: 5,
      reviews: 61,
      hourly: 40,
      subjects: ["Piano", "Music Theory", "Composition"],
      location: "New York, NY • Hybrid",
      schedule: "Afternoons, Evenings",
      availability: "Available",
      experience: 5,
    },
    {
      name: "Tutor 12",
      institution: "Research Methods Center",
      rating: 5,
      reviews: 72,
      hourly: 43,
      subjects: ["Psychology", "Research Methods", "Statistics"],
      location: "Ann Arbor, MI • Online",
      schedule: "Weekdays, Mornings",
      availability: "Available",
      experience: 11,
    },
  ]

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 p-6">
        <h1 className="mb-8 text-2xl font-bold">
          <span className="text-blue-600">Tutor</span>
          <span>IT</span>
        </h1>

        <nav className="space-y-4">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" onClick={() => navigate('/dashboard')} />
          <NavItem icon={<Play />} label="Sessions" />

          <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
            <Users className="h-5 w-5" />
            Find Tutors
          </button>

          <NavItem icon={<MessageCircle />} label="Messages" onClick={() => navigate('/messages')} />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <div className="flex gap-6">
            <Bell className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-600" />
            <User className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-600" />
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-6">
            Find Your Perfect Tutor
          </h1>

          {/* Search */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Search by subject, skill, or tutor name..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded lg focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition">
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none">
              <option>Subject</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none">
              <option>Availability</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none">
              <option>Location</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none">
              <option>More Filters</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Showing 12 of 48 tutors</p>
            <p className="text-gray-600">Sort by:</p>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {tutors.map((tutor, index) => (
            <TutorCard key={index} {...tutor} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-6">
          <button className="border-2 border-blue-600 text-blue-600 font-semibold py-2 px-8 rounded hover:bg-blue-50 transition">
            Load More Tutors
          </button>

          <div className="flex gap-2">
            <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold">
              1
            </button>
            <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition font-semibold">
              2
            </button>
            <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition font-semibold">
              3
            </button>
            <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition font-semibold">
              4
            </button>

            <span className="px-2 py-1 text-gray-600">...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
