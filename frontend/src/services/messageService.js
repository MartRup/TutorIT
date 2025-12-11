// Message Service - Real API calls for messaging functionality

const BASE_URL = 'http://localhost:8080/api/messages';

// Get all conversations for the logged-in user
export const getConversations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/conversations`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch conversations'
    };
  }
};

// Get messages for a specific conversation
export const getMessages = async (conversationId) => {
  try {
    const response = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch messages'
    };
  }
};

// Create a new conversation with a tutor
export const createConversation = async (tutorData) => {
  try {
    const response = await fetch(`${BASE_URL}/conversations`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tutorId: tutorData.tutorId,
        tutorName: tutorData.name,
        tutorSubject: tutorData.subjects && tutorData.subjects.length > 0 ? tutorData.subjects[0] : 'Tutor'
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create conversation'
    };
  }
};

// Send a new message
export const sendMessage = async (conversationId, messageText) => {
  try {
    const response = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageText: messageText
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to send message'
    };
  }
};

export default {
  getConversations,
  getMessages,
  sendMessage,
  createConversation
};