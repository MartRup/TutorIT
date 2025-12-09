// User service for making HTTP requests to the backend
const API_BASE_URL = 'http://localhost:8080';

class UserService {
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/current-user`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.authenticated) {
        throw new Error('User not authenticated');
      }
      
      return data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, userData) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/students/${userId}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating user profile with id ${userId}:`, error);
      throw error;
    }
  }

  async updateUserSubjects(userId, subjects) {
    try {
      // This would be a separate endpoint for updating subjects
      // For now, we'll include subjects in the user data
      console.log('Updating subjects for user:', userId, subjects);
      return { success: true };
    } catch (error) {
      console.error(`Error updating subjects for user with id ${userId}:`, error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;