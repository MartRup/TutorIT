import { useState, useEffect } from "react";
import {
  Bell,
  User,
  Play,
  Users,
  MessageCircle,
  Settings,
  LayoutDashboard,
  BookOpen,
  Search,
  Camera,
  Save,
  X,
  Plus,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    education: "",
    yearsOfExperience: "",
    profilePicture: null
  });
  const [subjects, setSubjects] = useState(["Mathematics", "Science"]);
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser();
      console.log("User data loaded:", userData);
      
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
        yearsOfExperience: user.yearsOfExperience || ""
      };
      
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Please select a valid image file (JPEG, JPG, GIF, or PNG)");
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size exceeds 2MB limit");
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      setPreviewImage(URL.createObjectURL(file));
      setSuccessMessage("Profile picture selected successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      // In a real implementation, you would get the actual user ID
      // For now, we'll use a mock ID
      const userId = 1;
      
      // Upload profile picture using userService
      const response = await userService.uploadProfilePicture(userId, file);
      console.log("Profile picture uploaded:", response);
      
      // Return the URL of the uploaded image
      return response.imageUrl || URL.createObjectURL(file);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      // Upload profile picture if selected
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        try {
          profilePictureUrl = await uploadProfilePicture(formData.profilePicture);
          console.log("Profile picture uploaded:", profilePictureUrl);
        } catch (uploadError) {
          console.error("Error uploading profile picture:", uploadError);
          setErrorMessage("Failed to upload profile picture. Other changes will still be saved.");
          // Continue with saving other data even if picture upload fails
        }
      }
      
      // Prepare user data for saving
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        education: formData.education,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0
      };
      
      // In a real implementation, you would get the actual user ID
      // For now, we'll use a mock ID
      const userId = 1;
      
      // Save user data to backend
      const response = await userService.updateUserProfile(userId, userData);
      console.log("User data saved:", response);
      
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
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-200 p-6">
        <h1 className="mb-8 text-2xl font-bold">
          <span className="text-blue-600">Tutor</span>
          <span>IT</span>
        </h1>

        <nav className="space-y-4">
          <NavItem 
            icon={<Home />} 
            label="Dashboard" 
            onClick={() => navigate('/dashboard')} 
          />
          <NavItem 
            icon={<Play />} 
            label="Sessions" 
            onClick={() => navigate('/sessions')} 
          />
          <NavItem 
            icon={<Users />} 
            label="Find Tutors" 
            onClick={() => navigate('/find-tutors')} 
          />
          <NavItem 
            icon={<BookOpen />} 
            label="Subjects" 
            onClick={() => navigate('/subjects')} 
          />
          <NavItem 
            icon={<MessageCircle />} 
            label="Messages" 
            onClick={() => navigate('/messages')} 
          />
          <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-600">Tutor</span>
            <span>IT</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutors, subjects, and sessions"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-80"
              />
            </div>
          </div>
        </header>

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
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-6 w-6 text-gray-700" />
                  <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                </div>
                <p className="text-gray-600 mb-6">Update your personal information and profile details.</p>

                {/* Profile Picture Section */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="inline-block">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/gif,image/png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-picture"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('profile-picture').click()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="h-4 w-4 text-gray-700" />
                        <span className="text-gray-700 font-medium">Change Photo</span>
                      </button>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

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

              {/* Education & Expertise Section */}
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
      </main>
    </div>
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