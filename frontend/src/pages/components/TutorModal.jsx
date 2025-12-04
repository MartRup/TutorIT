import { useState, useEffect } from "react";

export default function TutorModal({ tutor, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    expertiseSubjects: "",
    hourlyRate: "",
    institution: "",
    rating: 0,
    reviews: 0,
    location: "",
    schedule: "",
    availability: "Available",
    experience: 0,
  });

  useEffect(() => {
    if (tutor) {
      setFormData({
        name: tutor.name || "",
        email: tutor.email || "",
        password: "", // Don't populate password for security
        expertiseSubjects: tutor.subjects ? tutor.subjects.join(", ") : "",
        hourlyRate: tutor.hourly || "",
        institution: tutor.institution || "",
        rating: tutor.rating || 0,
        reviews: tutor.reviews || 0,
        location: tutor.location || "",
        schedule: tutor.schedule || "",
        availability: tutor.availability || "Available",
        experience: tutor.experience || 0,
      });
    }
  }, [tutor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Transform data for backend
    const dataToSend = {
      ...formData,
      // Only include password if it's a new tutor or if password was changed
      ...(formData.password ? { password: formData.password } : {}),
    };
    
    onSave(dataToSend);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{tutor ? "Edit Tutor" : "Create New Tutor"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password {!tutor && "*"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={!tutor}
                placeholder={tutor ? "Leave blank to keep current" : ""}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 col-span-2">
              <label htmlFor="expertiseSubjects" className="block text-sm font-medium text-gray-700 mb-1">
                Expertise Subjects (comma-separated) *
              </label>
              <input
                type="text"
                id="expertiseSubjects"
                name="expertiseSubjects"
                value={formData.expertiseSubjects}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Math, Physics, Chemistry"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($) *</label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Online, New York, NY"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Weekdays, Evenings"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reviews" className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
              <input
                type="number"
                id="reviews"
                name="reviews"
                value={formData.reviews}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {tutor ? "Update Tutor" : "Create Tutor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
