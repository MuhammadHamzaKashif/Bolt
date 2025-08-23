"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { messagesAPI } from "../services/api"
import ConversationList from "../components/ConversationList"
import ChatInterface from "../components/ChatInterface"
import NewMessageModal from "../components/NewMessageModal"
import { MessageCircle, Plus, Search, Loader2 } from "lucide-react"

/**
 * Messages Page Component
 * Comprehensive messaging system with conversations and chat interface
 * Much more sophisticated than basic messaging apps
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to GET /api/messages/conversations endpoint
 * - Implement real-time messaging with WebSocket/Socket.IO
 * - Message delivery and read status tracking
 * - File/image sharing in messages
 * - Message search and filtering
 * - Push notifications for new messages
 */
function Messages() {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    loadConversations()

    // Check if we need to start a new conversation (from profile page)
    if (location.state?.startConversation) {
      handleStartConversation(location.state.startConversation)
    }
  }, [location.state])

  const loadConversations = async () => {
    try {
      // BACKEND INTEGRATION: Fetch user's conversations
      const response = await messagesAPI.getConversations()
      setConversations(response.data.conversations || mockConversations)
    } catch (error) {
      console.error("Failed to load conversations:", error)
      // Use mock data for development
      setConversations(mockConversations)
    } finally {
      setLoading(false)
    }
  }

  const handleStartConversation = async (targetUser) => {
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find((conv) => conv.participants.some((p) => p.id === targetUser.id))

      if (existingConversation) {
        setActiveConversation(existingConversation)
        return
      }

      // BACKEND INTEGRATION: Start new conversation
      const response = await messagesAPI.startConversation(targetUser.id)
      const newConversation = response.data.conversation

      setConversations((prev) => [newConversation, ...prev])
      setActiveConversation(newConversation)
    } catch (error) {
      console.error("Failed to start conversation:", error)
    }
  }

  const handleSendMessage = async (conversationId, messageData) => {
    try {
      // BACKEND INTEGRATION: Send message
      const response = await messagesAPI.sendMessage({
        conversationId,
        ...messageData,
      })

      const newMessage = response.data.message

      // Update conversation with new message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: newMessage,
                updatedAt: newMessage.createdAt,
              }
            : conv,
        ),
      )

      return newMessage
    } catch (error) {
      console.error("Failed to send message:", error)
      throw error
    }
  }

  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.id !== user?.id)
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl overflow-hidden flex">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-display font-bold text-foreground">Messages</h1>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full smooth-transition hover:scale-105 focus-visible"
              aria-label="New message"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {searchQuery ? "No conversations found" : "No messages yet"}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery ? "Try a different search term" : "Start a conversation with someone!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg smooth-transition"
                >
                  Send Message
                </button>
              )}
            </div>
          ) : (
            <ConversationList
              conversations={filteredConversations}
              activeConversation={activeConversation}
              onSelectConversation={setActiveConversation}
              currentUserId={user?.id}
            />
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 hidden md:flex">
        {activeConversation ? (
          <ChatInterface
            conversation={activeConversation}
            onSendMessage={(messageData) => handleSendMessage(activeConversation.id, messageData)}
            currentUserId={user?.id}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold gradient-text mb-2">Welcome to Messages</h2>
            <p className="text-muted-foreground mb-6">Select a conversation to start chatting</p>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg smooth-transition hover:scale-105"
            >
              Start New Conversation
            </button>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <NewMessageModal onClose={() => setShowNewMessageModal(false)} onStartConversation={handleStartConversation} />
      )}
    </div>
  )
}

// Mock data for development
const mockConversations = [
  {
    id: "conv1",
    participants: [
      {
        id: "user1",
        name: "alice_photos",
        pfp: "/woman-photographer.png",
      },
      {
        id: "current_user",
        name: "current_user",
        pfp: "/placeholder.svg",
      },
    ],
    lastMessage: {
      id: "msg1",
      content: "Hey! Love your latest post 📸",
      senderId: "user1",
      createdAt: "2024-01-15T14:30:00Z",
      type: "text",
    },
    updatedAt: "2024-01-15T14:30:00Z",
    unreadCount: 2,
  },
  {
    id: "conv2",
    participants: [
      {
        id: "user2",
        name: "travel_mike",
        pfp: "/man-traveler.png",
      },
      {
        id: "current_user",
        name: "current_user",
        pfp: "/placeholder.svg",
      },
    ],
    lastMessage: {
      id: "msg2",
      content: "Thanks for the follow! Where was that sunset photo taken?",
      senderId: "current_user",
      createdAt: "2024-01-15T12:15:00Z",
      type: "text",
    },
    updatedAt: "2024-01-15T12:15:00Z",
    unreadCount: 0,
  },
]

export default Messages
