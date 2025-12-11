"use client"

import { useState, useEffect } from "react"
import { User, BookOpen, Plus, Edit, Trash2, Bell, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import tutorService from "../services/tutorService"
import TutorModal from "./components/TutorModal"
import Layout from "../components/Layout"

const TutorCard = ({
  tutorId,
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
  onEdit,
  onDelete,
  onBookSession,
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
        <div className="flex text-yellow-400">
          {'★'.repeat(Math.floor(rating))}
          {'☆'.repeat(5 - Math.floor(rating))}
        </div>
        <span className="text-sm text-gray-600">({reviews} reviews)</span>
      </div>

      {/* Hourly Rate */}
      <p className="font-bold text-blue-600 mb-3">${hourly}/hour</p>

      {/* Subjects */}
      <div className="flex flex-wrap gap-2 mb-4">
        {subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded"
            >
              {subject}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500 italic">No subjects listed</span>
        )}
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
        {onBookSession && (
          <button
            onClick={onBookSession}
            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Book Session
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit({ tutorId, name, institution, rating, reviews, hourly, subjects, location, schedule, availability, experience })}
            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(tutorId)}
            className="flex-1 border-2 border-red-600 text-red-600 font-semibold py-2 px-4 rounded hover:bg-red-50 transition flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default function FindTutorsPage() {
  const [tutors, setTutors] = useState([])
  const [filteredTutors, setFilteredTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchTutors()
  }, [])

  // Filter tutors whenever search query or filters change
  useEffect(() => {
    filterTutors()
  }, [searchQuery, subjectFilter, availabilityFilter, tutors])

  const fetchTutors = async () => {
    try {
      setLoading(true)
      const data = await tutorService.getTutors()
      // Transform the data to match the expected format using REAL backend fields
      const transformedTutors = data.map(tutor => ({
        tutorId: tutor.tutorId,
        name: tutor.name || "Unknown Tutor",
        email: tutor.email,
        institution: tutor.institution || "Not specified",
        rating: tutor.rating || 0,
        reviews: tutor.reviews || 0,
        hourly: tutor.hourlyRate || 0,
        subjects: tutor.expertiseSubjects ? tutor.expertiseSubjects.split(',').map(s => s.trim()) : [],
        location: tutor.location || "Not specified",
        schedule: tutor.schedule || "Not specified",
        availability: tutor.availability || "Unknown",
        experience: tutor.experience || 0,
      }))
      setTutors(transformedTutors)
      setFilteredTutors(transformedTutors)
      setError(null)
    } catch (err) {
      setError("Failed to fetch tutors")
      console.error("Error fetching tutors:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterTutors = () => {
    let filtered = [...tutors]

    // Search filter: search in name and subjects
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tutor => {
        const nameMatch = tutor.name.toLowerCase().includes(query)
        const subjectMatch = tutor.subjects.some(subject =>
          subject.toLowerCase().includes(query)
        )
        return nameMatch || subjectMatch
      })
    }

    // Subject filter
    if (subjectFilter) {
      filtered = filtered.filter(tutor =>
        tutor.subjects.some(subject =>
          subject.toLowerCase() === subjectFilter.toLowerCase()
        )
      )
    }

    // Availability filter
    if (availabilityFilter) {
      filtered = filtered.filter(tutor =>
        tutor.availability.toLowerCase() === availabilityFilter.toLowerCase()
      )
    }

    setFilteredTutors(filtered)
  }

  const handleOpenModal = (tutor = null) => {
    setSelectedTutor(tutor)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedTutor(null)
    setIsModalOpen(false)
  }

  const handleSaveTutor = async (tutorData) => {
    try {
      if (selectedTutor) {
        await tutorService.updateTutor(selectedTutor.tutorId, tutorData)
      } else {
        await tutorService.createTutor(tutorData)
      }
      fetchTutors()
      handleCloseModal()
    } catch (err) {
      console.error("Error saving tutor:", err)
      alert("Failed to save tutor. Please try again.")
    }
  }

  const handleDeleteTutor = async (tutorId) => {
    if (window.confirm("Are you sure you want to delete this tutor?")) {
      try {
        await tutorService.deleteTutor(tutorId)
        fetchTutors()
      } catch (err) {
        console.error("Error deleting tutor:", err)
        alert("Failed to delete tutor. Please try again.")
      }
    }
  }

  if (loading) {
    return (
      <Layout activePage="find-tutors">
        {/* Main Content */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading tutors...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout activePage="find-tutors">
        {/* Main Content */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Tutors</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchTutors}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout activePage="find-tutors">
      {isModalOpen && (
        <TutorModal
          tutor={selectedTutor}
          onClose={handleCloseModal}
          onSave={handleSaveTutor}
        />
      )}

      {/* Main Content */}
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <div className="flex gap-6">
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Tutor
            </button>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">All Subjects</option>
              {[...new Set(tutors.flatMap(tutor => tutor.subjects))].sort().map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">All Availability</option>
              {[...new Set(tutors.map(tutor => tutor.availability))].sort().map((availability, index) => (
                <option key={index} value={availability}>{availability}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Showing {filteredTutors.length} tutors</p>
            <p className="text-gray-600">Sort by:</p>
          </div>
        </div>

        {/* Tutors Grid */}
        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 mb-8">
            {filteredTutors.map((tutor) => (
              <TutorCard
                key={tutor.tutorId}
                {...tutor}
                onEdit={handleOpenModal}
                onDelete={handleDeleteTutor}
                onBookSession={() => navigate('/book-session')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tutors Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || subjectFilter || availabilityFilter
                ? "No tutors match your search criteria. Try adjusting your filters."
                : "There are currently no tutors available."}
            </p>
            {!searchQuery && !subjectFilter && !availabilityFilter && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Tutor
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredTutors.length > 0 && (
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
        )}
      </div>
    </Layout>
  )
}
