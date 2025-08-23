"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react"
import { formatRelativeTime } from "../utils/formatDate"

/**
 * Post Card Component
 * Elegant post display with interactions and animations
 * Much more sophisticated than the basic sample design
 */
function PostCard({ post, currentUserId, onLike, className = "", style = {} }) {
  const [showComments, setShowComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const isLiked = post.likes?.includes(currentUserId);
//   console.log(isLiked)

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    await onLike()

    // Add a small delay for the animation
    setTimeout(() => setIsLiking(false), 300)
  }

  return (
    <article className={`post-card ${className}`} style={style}>
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/profile/${post.user.name}`} className="flex items-center gap-3 group">
          <img
            src={post.user.pfp || "/placeholder.svg?height=40&width=40&query=user+avatar"}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-border group-hover:border-primary/50 smooth-transition"
          />
          <div>
            <p className="font-semibold text-foreground group-hover:text-primary smooth-transition">
              @{post.user.name}
            </p>
            <p className="text-sm text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </Link>

        <button className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Post Content */}
      {post.caption && <p className="text-foreground mb-4 leading-relaxed">{post.caption}</p>}

      {/* Post Image */}
      {post.mediaPaths && (
        <div className="mb-4 rounded-xl overflow-hidden bg-muted">
          <img
            src={post.mediaPaths[0] || "/placeholder.svg"}
            alt="Post content"
            className="w-full h-auto object-cover hover:scale-105 smooth-transition duration-700"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 p-2 rounded-full smooth-transition hover:bg-red-500/10 focus-visible ${
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            } ${isLiking ? "animate-heartbeat" : ""}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{post.likes.length}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 p-2 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 smooth-transition focus-visible"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </button>

          {/* Share Button */}
          <button className="p-2 rounded-full text-muted-foreground hover:text-green-500 hover:bg-green-500/10 smooth-transition focus-visible">
            <Share className="w-5 h-5" />
          </button>
        </div>

        {/* Bookmark Button */}
        <button className="p-2 rounded-full text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 smooth-transition focus-visible">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border space-y-3 animate-slide-up">
          <div className="text-sm text-muted-foreground">Comments coming soon...</div>
        </div>
      )}
    </article>
  )
}

export default PostCard
