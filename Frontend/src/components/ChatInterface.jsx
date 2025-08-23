"use client"

import { useState, useEffect, useRef } from "react"
import { Send, ImageIcon, Smile, MoreVertical, Phone, Video } from "lucide-react"
import MessageBubble from "./MessageBubble"
import { messagesAPI } from "../services/api"
import { formatRelativeTime } from "../utils/formatDate"

/**
 * Chat Interface Component
 * Real-time messaging interface with rich features
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to GET /api/messages/:conversationId endpoint
 * - Implement real-time message updates with WebSocket
 * - Message status tracking (sent, delivered, read)
 * - Typing indicators
 * - File/image upload functionality
 */
function ChatInterface({ conversation, onSendMessage, currentUserId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)

  useEffect(() => {
    loadMessages()
  }, [conversation.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      // BACKEND INTEGRATION: Fetch conversation messages
      const response = await messagesAPI.getMessages(conversation.id)
      setMessages(response.data.messages || mockMessages)
    } catch (error) {
      console.error("Failed to load messages:", error)
      setMessages(mockMessages)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || sending) return

    const messageContent = newMessage.trim()
    setNewMessage("")
    setSending(true)

    try {
      const messageData = {
        content: messageContent,
        type: "text",
      }

      // Optimistically add message to UI
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        senderId: currentUserId,
        createdAt: new Date().toISOString(),
        type: "text",
        status: "sending",
      }

      setMessages((prev) => [...prev, tempMessage])

      // Send message to backend
      const sentMessage = await onSendMessage(messageData)

      // Replace temp message with real message
      setMessages((prev) => prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg)))
    } catch (error) {
      console.error("Failed to send message:", error)
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== `temp-${Date.now()}`))
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src={otherParticipant?.pfp || "/placeholder.svg?height=40&width=40&query=user+avatar"}
            alt={otherParticipant?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-border"
          />
          <div>
            <h2 className="font-semibold text-foreground">@{otherParticipant?.name}</h2>
            <p className="text-sm text-muted-foreground">
              {isTyping ? "Typing..." : `Active ${formatRelativeTime(conversation.updatedAt)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible">
            <Phone className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible">
            <Video className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Start the conversation</h3>
            <p className="text-muted-foreground">Send a message to @{otherParticipant?.name}</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].senderId !== message.senderId ||
                  new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 300000 // 5 minutes
                }
                participant={
                  message.senderId === currentUserId
                    ? { pfp: "/placeholder.svg", name: "You" }
                    : otherParticipant
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          {/* Attachment Button */}
          <button
            type="button"
            className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible flex-shrink-0"
          >
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message @${otherParticipant?.name}...`}
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition resize-none max-h-32"
              disabled={sending}
            />

            {/* Emoji Button */}
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent/10 rounded-full smooth-transition"
            >
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded-full smooth-transition hover:scale-105 focus-visible flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

// Mock messages for development
const mockMessages = [
  {
    id: "msg1",
    content: "Hey! How are you doing?",
    senderId: "user1",
    createdAt: "2024-01-15T10:00:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "msg2",
    content: "I'm doing great! Just saw your latest post, amazing shot! 📸",
    senderId: "current_user",
    createdAt: "2024-01-15T10:05:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "msg3",
    content: "Thank you so much! That means a lot coming from you 😊",
    senderId: "user1",
    createdAt: "2024-01-15T10:10:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "msg4",
    content: "Where was that taken? The lighting is incredible!",
    senderId: "current_user",
    createdAt: "2024-01-15T10:15:00Z",
    type: "text",
    status: "delivered",
  },
]

export default ChatInterface
