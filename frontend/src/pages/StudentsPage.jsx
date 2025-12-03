"use client";

import { useState, useEffect } from "react";
import { Bell, User, BookOpen, Play, Users, MessageCircle, Settings, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NavItem({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:text-gray-600 cursor-pointer">
      {icon}
      <span className="text-lg">{label}</span>
    </div>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ name: "", age: "" });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch all students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentStudent({ name: "", age: "" });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.deleteStudent(id);
        fetchStudents(); // Refresh the list
      } catch (err) {
        setError("Failed to delete student");
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateStudent(currentStudent.id, currentStudent);
      } else {
        await api.createStudent(currentStudent);
      }
      setShowForm(false);
      fetchStudents(); // Refresh the list
    } catch (err) {
      setError(isEditing ? "Failed to update student" : "Failed to create student");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent(prev => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || "" : value
    }));
  };

  if (loading) {
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
            <NavItem icon={<Play />} label="Sessions" onClick={() => navigate('/sessions')} />
            <NavItem icon={<Users />} label="Find Tutors" onClick={() => navigate('/find-tutors')} />
            <NavItem icon={<MessageCircle />} label="Messages" onClick={() => navigate('/messages')} />
            <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
              <User className="h-5 w-5" />
              Students
            </button>
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

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
          <NavItem icon={<Play />} label="Sessions" onClick={() => navigate('/sessions')} />
          <NavItem icon={<Users />} label="Find Tutors" onClick={() => navigate('/find-tutors')} />
          <NavItem icon={<MessageCircle />} label="Messages" onClick={() => navigate('/messages')} />
          <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
            <User className="h-5 w-5" />
            Students
          </button>
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

        {/* Page Title and Controls */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-black">Students Management</h1>
            <button 
              onClick={handleCreate}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Add New Student
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </div>

        {/* Students Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? "Edit Student" : "Add New Student"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentStudent.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={currentStudent.age}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}