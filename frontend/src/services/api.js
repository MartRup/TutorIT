// API service for making HTTP requests to the backend
const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  async getStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async getStudent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching student with id ${id}:`, error);
      throw error;
    }
  }

  async createStudent(studentData) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(id, studentData) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating student with id ${id}:`, error);
      throw error;
    }
  }

  async deleteStudent(id) {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.status === 204;
    } catch (error) {
      console.error(`Error deleting student with id ${id}:`, error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;