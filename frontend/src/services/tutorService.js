// Tutor service for making HTTP requests to the backend
const API_BASE_URL = 'http://localhost:8080';

class TutorService {
  async getTutors() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tutors`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  }

  async getTutor(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tutors/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tutor with id ${id}:`, error);
      throw error;
    }
  }

  async createTutor(tutorData) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/tutors`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(tutorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  }

  async updateTutor(id, tutorData) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/tutors/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(tutorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating tutor with id ${id}:`, error);
      throw error;
    }
  }

  async updateTutorRating(id, rating) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/tutors/${id}/rating`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(rating),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating tutor rating for id ${id}:`, error);
      throw error;
    }
  }

  async deleteTutor(id) {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/tutors/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.status === 204;
    } catch (error) {
      console.error(`Error deleting tutor with id ${id}:`, error);
      throw error;
    }
  }
}

const tutorService = new TutorService();
export default tutorService;