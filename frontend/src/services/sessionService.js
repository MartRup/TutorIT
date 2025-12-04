// Session service for making HTTP requests to the backend
const API_BASE_URL = 'http://localhost:8080';

class SessionService {
  async getSessions() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tutoring-sessions`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  async getSession(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tutoring-sessions/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching session with id ${id}:`, error);
      throw error;
    }
  }

  async createSession(sessionData) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/tutoring-sessions`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(sessionData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async updateSession(id, sessionData) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/tutoring-sessions/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(sessionData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating session with id ${id}:`, error);
      throw error;
    }
  }

  async deleteSession(id) {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/tutoring-sessions/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.status === 204;
    } catch (error) {
      console.error(`Error deleting session with id ${id}:`, error);
      throw error;
    }
  }
}

const sessionService = new SessionService();
export default sessionService;