import { useState, useEffect } from "react";

export default function SessionModal({ session, onClose, onSave }) {
  const [formData, setFormData] = useState({
    tutorName: "",
    subject: "",
    topic: "",
    dateTime: "",
    duration: "",
    status: "scheduled",
  });

  useEffect(() => {
    if (session) {
      setFormData({
        tutorName: session.tutorName || "",
        subject: session.subject || "",
        topic: session.topic || "",
        dateTime: session.dateTime ? new Date(session.dateTime).toISOString().slice(0, 16) : "",
        duration: session.duration || "",
        status: session.status || "scheduled",
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">{session ? "Edit Session" : "Create New Session"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tutorName" className="block text-sm font-medium text-gray-700 mb-1">Tutor Name</label>
            <input
              type="text"
              id="tutorName"
              name="tutorName"
              value={formData.tutorName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
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
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
