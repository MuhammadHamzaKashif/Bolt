"use client"

import { Check, CheckCheck, Clock } from "lucide-react"
import { formatRelativeTime } from "../utils/formatDate"

/**
 * Message Bubble Component
 * Individual message display with status indicators
 */
function MessageBubble({ message, isOwn, showAvatar, participant }) {
  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <Clock className="w-3 h-3 text-muted-foreground" />
      case "sent":
        return <Check className="w-3 h-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-primary" />
      default:
        return null
    }
  }

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar ? (
          <img
            src={participant?.pfp || "/placeholder.svg?height=32&width=32&query=user+avatar"}
            alt={participant?.name}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"}`}>
        {/* Message Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl smooth-transition ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md hover:bg-muted/80"
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        </div>

        {/* Message Info */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-xs text-muted-foreground">{formatRelativeTime(message.createdAt)}</span>
          {isOwn && getStatusIcon()}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
