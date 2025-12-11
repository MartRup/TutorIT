import { useState, useEffect } from "react";
import {
  User,
  Camera,
  Save,
  X,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import tutorService from "../services/tutorService";
import Layout from "../components/Layout";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    education: "",
    yearsOfExperience: "",
    rating: "",
    hourlyRate: ""
  });
  const [subjects, setSubjects] = useState(["Mathematics", "Science"]);
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser();
      console.log("User data loaded:", userData);

      // Get user type from localStorage
      const type = localStorage.getItem('userType');
      setUserType(type);

      // Parse user data from the response
      const user = userData.user || {};

      // Split name into first and last name
      const nameParts = user.name ? user.name.split(' ') : [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const parsedUserData = {
        firstName: firstName,
        lastName: lastName,
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        education: user.education || "",
        yearsOfExperience: user.yearsOfExperience || "",
        rating: "",
        hourlyRate: ""
      };

      // If user is a tutor, load their rating and hourly rate
      if (type && type.toUpperCase() === 'TUTOR' && user.id) {
        try {
          const tutorData = await tutorService.getTutor(user.id);
          parsedUserData.rating = tutorData.rating || "";
          parsedUserData.hourlyRate = tutorData.hourlyRate || "";
        } catch (error) {
          console.error("Error loading tutor data:", error);
          // If tutor record doesn't exist yet, we'll create it when saving
          // For now, we just leave the fields empty
        }
      }

      setFormData(parsedUserData);

      // Load subjects if available
      if (user.subjects && Array.isArray(user.subjects)) {
        setSubjects(user.subjects);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setErrorMessage("Failed to load user data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setSubjects(subjects.filter(subject => subject !== subjectToRemove));
  };


  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Get current user data to get the actual ID
      const currentUserData = await userService.getCurrentUser();
      const userId = currentUserData.user?.id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      // If user is a tutor, save to tutor table
      if (userType && userType.toUpperCase() === 'TUTOR') {
        try {
          let updatedTutorData;
          
          try {
            // Try to get existing tutor data first
            const currentTutorData = await tutorService.getTutor(userId);
            
            // Prepare updated tutor data
            updatedTutorData = {
              ...currentTutorData,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              expertiseSubjects: subjects.join(', '),
              institution: formData.education,
              experience: parseInt(formData.yearsOfExperience) || 0,
              hourlyRate: formData.hourlyRate !== "" ? parseFloat(formData.hourlyRate) : (currentTutorData.hourlyRate || 0)
            };
          } catch (getTutorError) {
            // If tutor doesn't exist, create new tutor data
            updatedTutorData = {
              id: userId, // Use the same ID as the user
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              expertiseSubjects: subjects.join(', '),
              institution: formData.education,
              experience: parseInt(formData.yearsOfExperience) || 0,
              hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
              rating: 0.0,
              reviews: 0,
              location: "",
              schedule: "",
              availability: "",
              password: "" // Password should be handled separately
            };
          }

          await tutorService.updateTutor(userId, updatedTutorData);
          console.log("Tutor data updated successfully");
        } catch (tutorError) {
          console.error("Error updating tutor data:", tutorError);
          setErrorMessage("Failed to update tutor data. Please try again.");
          setLoading(false);
          return;
        }
      } else {
        // User is a student, save to student table
        try {
          const studentData = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            bio: formData.bio
          };

          await userService.updateUserProfile(userId, studentData);
          console.log("Student data updated successfully");
        } catch (studentError) {
          console.error("Error updating student data:", studentError);
          setErrorMessage("Failed to update student data. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Clear the file object from formData after successful save
      setFormData(prev => ({ ...prev, profilePicture: null }));

      // Reload user data to get the saved profile picture from database
      await loadUserData();

      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving changes:", error);
      setErrorMessage("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel logic here
    navigate('/dashboard');
  };

  return (
    <Layout activePage="settings">
      {/* Main Content */}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Settings</h2>
            <p className="text-gray-600">Manage your account settings and tutoring preferences.</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Main Container */}
          <div className="bg-blue-50 rounded-xl p-8 space-y-8">
            {/* Profile Information Section */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-6 w-6 text-gray-700" />
                <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
              </div>
              <p className="text-gray-600 mb-8">Update your personal information and profile details.</p>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BIO
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </section>

            {/* Education & Expertise Section - Only for tutors */}
            {userType && userType.toUpperCase() === 'TUTOR' && (
              <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Education & Expertise</h3>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Bachelor's in Mathematics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                {/* Hourly Rate field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (₱)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 500.00"
                  />
                  <p className="text-sm text-gray-500 mt-2">Set your hourly rate (price per hour). This will be displayed to students.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {subjects.map((subject) => (
                      <span
                        key={subject}
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm"
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(subject)}
                          className="hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubject();
                        }
                      }}
                      placeholder="Enter subject name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add subject</span>
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

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