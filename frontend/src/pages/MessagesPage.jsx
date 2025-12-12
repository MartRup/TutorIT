"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Send,
  MessageCircle,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getConversations, getMessages, sendMessage, deleteMessage, reactToMessage } from "../services/messageService";
import tutorService from "../services/tutorService";
import Layout from "../components/Layout";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load conversations and tutors on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load tutors first
        const tutorData = await tutorService.getTutors();
        const transformedTutors = tutorData.map(tutor => ({
          tutorId: tutor.tutorId,
          name: tutor.name || "Unknown Tutor",
          email: tutor.email,
          institution: tutor.institution || "Not specified",
          rating: tutor.rating || 0,
          reviews: tutor.reviews || 0,
          hourly: tutor.hourlyRate || 0,
          subjects: tutor.expertiseSubjects ? tutor.expertiseSubjects.split(',').map(s => s.trim()) : [],
          location: tutor.location || "Not specified",
          schedule: tutor.schedule || "Not specified",
          availability: tutor.availability || "Unknown",
          experience: tutor.experience || 0,
        }));
        setTutors(transformedTutors);

        // Then load conversations
        const result = await getConversations();
        if (result.success) {
          setConversations(result.data);
          if (result.data.length > 0) {
            setSelectedConversation(result.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;

      try {
        const result = await getMessages(selectedConversation);
        if (result.success) {
          setCurrentMessages(result.data);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() === "" || !selectedConversation) return;

    setSending(true);
    try {
      const result = await sendMessage(selectedConversation, messageInput);
      if (result.success) {
        setCurrentMessages([...currentMessages, result.data]);
        setMessageInput("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const result = await deleteMessage(messageId);
      console.log('Delete result:', result);
      if (result.success) {
        // Update the message in the current messages list
        setCurrentMessages(currentMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, isDeleted: true, text: 'This message was deleted' }
            : msg
        ));
      } else {
        alert(`Failed to delete message: ${result.message || result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert(`Failed to delete message: ${error.message}`);
    }
  };

  const handleReactToMessage = async (messageId, reaction) => {
    try {
      const result = await reactToMessage(messageId, reaction);
      if (result.success) {
        // Update the message with the new reaction
        setCurrentMessages(currentMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, reaction: result.data.reaction }
            : msg
        ));
      }
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessageInput(messageInput + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
    '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
    '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
    '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
    '🤢', '🤮', '🤧', '🥵', '🥶', '😎', '🤓', '🧐',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
    '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💬',
    '👀', '🔥', '⭐', '✨', '🎉', '🎊', '🎈', '🎁'
  ];

  const selectedConvData = conversations.find(conv => conv.id === selectedConversation);

  if (loading) {
    return (
      <Layout activePage="messages">
        <div className="w-full flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading messages...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="messages">
      {/* Messages Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Conversation List */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                // Find matching tutor for this conversation
                const matchingTutor = tutors.find(tutor => tutor.tutorId === conv.tutorId);

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 hover:bg-white cursor-pointer transition-colors border-l-4 ${selectedConversation === conv.id ? 'bg-white border-blue-500' : 'border-transparent'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-gray-600">{conv.name.charAt(0)}</span>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${conv.status.includes('Online') ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-semibold text-gray-900 truncate text-left">{conv.name}</h3>
                          <span className="text-xs text-gray-500">{conv.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1 text-left">{conv.lastMessage}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{conv.role}</span>
                          {conv.unread > 0 && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                              {conv.unread}
                            </span>
                          )}
                          {/* Display tutor rating if available */}
                          {matchingTutor && matchingTutor.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-yellow-500">★</span>
                              <span className="text-xs text-gray-600">{matchingTutor.rating} ({matchingTutor.reviews})</span>
                            </div>
                          )}
                          {/* Display hourly rate if available */}
                          {matchingTutor && (
                            <span className="text-xs text-blue-600 font-medium">${matchingTutor.hourly}/hr</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty state when no conversations exist
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">
                  You haven't booked any tutoring sessions yet. Book a session with a tutor to start messaging!
                </p>
                <button
                  onClick={() => navigate('/find-tutors')}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Find Tutors
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white h-screen max-h-screen overflow-hidden">
            {/* Chat Header */}
            <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-gray-600">{selectedConvData?.name.charAt(0)}</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${selectedConvData?.status.includes('Online') ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedConvData?.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${selectedConvData?.status.includes('Online') ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span>{selectedConvData?.role} • {selectedConvData?.status}</span>
                  </div>
                  {/* Display tutor details if available */}
                  {selectedConvData && (() => {
                    const matchingTutor = tutors.find(tutor => tutor.tutorId === selectedConvData.tutorId);
                    return matchingTutor ? (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{matchingTutor.institution}</span>
                        <span>•</span>
                        <span>${matchingTutor.hourly}/hr</span>
                        {matchingTutor.rating > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span>{matchingTutor.rating} ({matchingTutor.reviews} reviews)</span>
                            </div>
                          </>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-500">
                <Phone className="w-5 h-5 cursor-pointer hover:text-gray-700" />
                <Video className="w-5 h-5 cursor-pointer hover:text-gray-700" />
                <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!msg.isMe && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600">{msg.sender.charAt(0)}</span>
                      </div>
                    )}
                    <div className="relative group">
                      <div
                        className={`p-4 rounded-2xl ${msg.isMe
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          } ${msg.isDeleted ? 'italic opacity-60' : ''}`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        
                        {/* Delete button - only show for own messages that aren't deleted */}
                        {msg.isMe && !msg.isDeleted && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500 rounded"
                            title="Delete message"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      {/* Reactions */}
                      {!msg.isDeleted && (
                        <div className="flex items-center gap-2 mt-2">
                          {/* Quick reaction buttons */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {['❤️', '👍', '😂', '😮'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReactToMessage(msg.id, emoji)}
                                className={`text-sm hover:scale-125 transition-transform ${
                                  msg.reaction === emoji ? 'scale-125' : ''
                                }`}
                                title="React"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                          
                          {/* Display current reaction */}
                          {msg.reaction && (
                            <div 
                              onClick={() => handleReactToMessage(msg.id, msg.reaction)}
                              className="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-sm cursor-pointer hover:bg-gray-50"
                            >
                              {msg.reaction}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <p className={`text-xs text-gray-400 mt-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500"
                  disabled={sending}
                />
                
                {/* Emoji picker button */}
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  
                  {/* Emoji Picker Popup */}
                  {showEmojiPicker && (
                    <div 
                      ref={emojiPickerRef}
                      className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-h-64 overflow-y-auto z-50"
                    >
                      <div className="mb-2 text-sm font-semibold text-gray-700">Pick an emoji</div>
                      <div className="grid grid-cols-8 gap-2">
                        {commonEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className={`p-2 text-white rounded-lg transition-colors ${sending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={!messageInput.trim() || sending}
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          // Empty state when no conversation is selected
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-500">Select a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}