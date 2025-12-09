"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  User,
  Play,
  Users,
  MessageCircle,
  Settings,
  LayoutDashboard,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getConversations, getMessages, sendMessage } from "../services/messageService";

// --- Sidebar Component (Duplicated for now) ---
function NavItem({ icon, label, onClick, isActive }) {
  return (
    <div 
      onClick={onClick} 
      className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${isActive ? 'text-blue-600 bg-blue-50 rounded-lg' : 'text-gray-800 hover:text-gray-600'}`}
    >
      {icon}
      <span className={`text-lg ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </div>
  );
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        const result = await getConversations();
        if (result.success) {
          setConversations(result.data);
          if (result.data.length > 0) {
            setSelectedConversation(result.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
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

  const selectedConvData = conversations.find(conv => conv.id === selectedConversation);

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <div className="w-full flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-60 border-r border-gray-200 p-6 flex flex-col">
        <h1 className="mb-8 text-2xl font-bold">
          <span className="text-blue-600">Tutor</span>
          <span>IT</span>
        </h1>

        <nav className="space-y-4 flex-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" onClick={() => navigate('/dashboard')} />
          <NavItem icon={<Play />} label="Sessions" onClick={() => navigate('/sessions')} />
          <NavItem icon={<Users />} label="Find Tutors" onClick={() => navigate('/find-tutors')} />
          
          <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 text-left font-semibold text-white flex items-center gap-3">
            <MessageCircle className="h-5 w-5" />
            Messages
          </button>
          
          <NavItem icon={<User />} label="Students" onClick={() => navigate('/students')} />
          <NavItem icon={<Settings />} label="Settings" onClick={() => navigate('/settings')} />
        </nav>
      </aside>

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
            {conversations.map((conv) => (
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
                      <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{conv.role}</span>
                      {conv.unread > 0 && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white">
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
                    <div>
                      <div 
                        className={`p-4 rounded-2xl ${
                          msg.isMe 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500"
                  disabled={sending}
                />
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
                  <Smile className="w-5 h-5" />
                </button>
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
    </div>
  );
}