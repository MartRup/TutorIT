// Message Service - Simulates API calls for messaging functionality

const BASE_URL = 'http://localhost:8080/api/messages';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all conversations for the logged-in user
export const getConversations = async () => {
  try {
    // Simulate API call delay
    await delay(500);
    
    // Return mock data - in a real app this would come from an API
    return {
      success: true,
      data: [
        {
          id: 1,
          tutorId: 1,
          name: "Sarah Johnson",
          role: "Mathematics",
          status: "Online now",
          lastMessage: "Thanks for the calculus help! When can...",
          time: "10:30 AM",
          unread: 0,
          avatarColor: "bg-green-500"
        },
        {
          id: 2,
          tutorId: 2,
          name: "Mike Chen",
          role: "Physics",
          status: "Offline",
          lastMessage: "I'm still confused about quantum mech...",
          time: "Yesterday",
          unread: 1,
          avatarColor: "bg-gray-300"
        },
        {
          id: 3,
          tutorId: 3,
          name: "Emma Davis",
          role: "Chemistry",
          status: "Online now",
          lastMessage: "Perfect! The organic chemistry session...",
          time: "Yesterday",
          unread: 0,
          avatarColor: "bg-green-500"
        },
        {
          id: 4,
          tutorId: 4,
          name: "Alex Rodriguez",
          role: "Statistics",
          status: "Offline",
          lastMessage: "Can we reschedule tomorrow's session",
          time: "Mon",
          unread: 0,
          avatarColor: "bg-gray-300"
        },
        {
          id: 5,
          tutorId: 5,
          name: "Lisa Wang",
          role: "Biology",
          status: "Online now",
          lastMessage: "The cell biology diagrams you shared...",
          time: "Mon",
          unread: 0,
          avatarColor: "bg-green-500"
        }
      ]
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
    
    // Mock data for different conversations
    const messagesByConversation = {
      1: [
        {
          id: 1,
          sender: "Sarah Johnson",
          text: "Hi! I wanted to thank you for yesterday's calculus session. The way you explained derivatives finally made it click for me!",
          time: "10:30 AM",
          isMe: false
        },
        {
          id: 2,
          sender: "Me",
          text: "I'm so glad to hear that! Derivatives can be tricky at first, but once you understand the concept, everything else builds on it naturally.",
          time: "10:32 AM",
          isMe: true
        },
        {
          id: 3,
          sender: "Me",
          text: "Did you get a chance to work on the practice problems I sent you?",
          time: "10:32 AM",
          isMe: true
        },
        {
          id: 4,
          sender: "Sarah Johnson",
          text: "Yes! I completed most of them. I got stuck on problem 7 though. Could we go over it in our next session?",
          time: "10:45 AM",
          isMe: false
        },
        {
          id: 5,
          sender: "Sarah Johnson",
          text: "Also, when would be a good time to schedule our next session? I'm free most afternoons this week.",
          time: "10:46 AM",
          isMe: false
        },
        {
          id: 6,
          sender: "Me",
          text: "Problem 7 involves the chain rule, which we can definitely review. How about Thursday at 2 PM?",
          time: "11:15 AM",
          isMe: true
        },
        {
          id: 7,
          sender: "Sarah Johnson",
          text: "Thanks for the calculus help! When can we schedule the next session?",
          time: "Just now",
          isMe: false
        }
      ],
      2: [
        {
          id: 1,
          sender: "Mike Chen",
          text: "Hello! I'm still having trouble with quantum mechanics concepts. Can we schedule another session soon?",
          time: "9:15 AM",
          isMe: false
        },
        {
          id: 2,
          sender: "Me",
          text: "Sure thing! I'm available this Friday at 3 PM. Would that work for you?",
          time: "9:30 AM",
          isMe: true
        }
      ],
      3: [
        {
          id: 1,
          sender: "Emma Davis",
          text: "The organic chemistry session was great! The diagrams really helped me visualize the reactions.",
          time: "Yesterday",
          isMe: false
        }
      ],
      4: [
        {
          id: 1,
          sender: "Alex Rodriguez",
          text: "Hi there! I need to reschedule our session tomorrow due to a family emergency.",
          time: "Mon",
          isMe: false
        },
        {
          id: 2,
          sender: "Me",
          text: "No problem at all. Just let me know when works better for you.",
          time: "Mon",
          isMe: true
        }
      ],
      5: [
        {
          id: 1,
          sender: "Lisa Wang",
          text: "The cell biology diagrams you shared were incredibly helpful for my exam prep!",
          time: "Mon",
          isMe: false
        }
      ]
    };
    
    return {
      success: true,
      data: messagesByConversation[conversationId] || []
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