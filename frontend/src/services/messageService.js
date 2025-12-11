// Message Service - Simulates API calls for messaging functionality

const BASE_URL = 'http://localhost:8080/api/messages';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all conversations for the logged-in user
export const getConversations = async () => {
  try {
    // Simulate API call delay
    await delay(500);

    // Return empty data - conversations will be created when students book sessions
    // In a real app, this would fetch conversations from the backend
    return {
      success: true,
      data: []
    };
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
    await delay(300);

    // Return empty messages - will be populated when real conversations exist
    return {
      success: true,
      data: []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch messages'
    };
  }
};

// Send a new message
export const sendMessage = async (conversationId, messageText) => {
  try {
    await delay(200);

    // In a real app, this would send the message to the backend
    const newMessage = {
      id: Date.now(), // Simple ID generation for demo
      sender: "Me",
      text: messageText,
      time: "Just now",
      isMe: true
    };

    return {
      success: true,
      data: newMessage
    };
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
  sendMessage
};