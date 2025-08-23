"use client"

import { formatRelativeTime } from "../utils/formatDate"

/**
 * Conversation List Component
 * Displays list of conversations with last message and unread indicators
 */
function ConversationList({ conversations, activeConversation, onSelectConversation, currentUserId }) {
  return (
    <div className="space-y-1 p-2">
      {conversations.map((conversation) => {
        const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)
        const isActive = activeConversation?.id === conversation.id

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-3 rounded-xl smooth-transition text-left ${
              isActive
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-accent/5 border border-transparent hover:border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <img
                  src={otherParticipant?.pfp || "/placeholder.svg?height=48&width=48&query=user+avatar"}
                  alt={otherParticipant?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                />
                {/* Online Status Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-semibold truncate ${
                      isActive ? "text-primary" : "text-foreground"
                    } ${conversation.unreadCount > 0 ? "font-bold" : ""}`}
                  >
                    @{otherParticipant?.name}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatRelativeTime(conversation.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm truncate ${
                      conversation.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {conversation.lastMessage?.senderId === currentUserId && "You: "}
                    {conversation.lastMessage?.content || "No messages yet"}
                  </p>

                  {/* Unread Badge */}
                  {conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default ConversationList
