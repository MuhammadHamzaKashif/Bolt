"use client"

import { useState } from "react"
import { Heart, MessageCircle, Play } from "lucide-react"

/**
 * Post Grid Component
 * Displays user posts in a responsive grid layout
 * Supports different content types (posts, bolts, saved)
 */
function PostGrid({ posts, type = "posts" }) {
  const [hoveredPost, setHoveredPost] = useState(null)



  let filteredPosts = posts
  if (type === "posts") {
    filteredPosts = posts.filter((p) => p.type === "post")
  } else if (type === "bolts") {
    filteredPosts = posts.filter((p) => p.type === "bolt")
  } else if (type === "saved") {
    filteredPosts = posts.filter((p) => p.isSaved)
  }



  if (!filteredPosts || filteredPosts.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
          {type === "bolts" ? (
            <Play className="w-10 h-10 text-muted-foreground" />
          ) : (
            <Heart className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            {type === "posts" && "No posts yet"}
            {type === "bolts" && "No bolts yet"}
            {type === "saved" && "No saved posts"}
          </h3>
          <p className="text-muted-foreground mt-1">
            {type === "posts" && "Share your first moment!"}
            {type === "bolts" && "Create your first bolt!"}
            {type === "saved" && "Save posts you love to see them here"}
          </p>
        </div>
      </div>
    )
  }

return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {filteredPosts.map((post) => (
        <div
          key={post._id || post.id}
          className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group"
          onMouseEnter={() => setHoveredPost(post._id || post.id)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          {/* Media (image or video thumbnail) */}
          <img
            src={post.mediaPaths[0] || "/placeholder.svg?height=300&width=300&query=post+image"}
            alt="Post"
            className="w-full h-full object-cover group-hover:scale-105 smooth-transition duration-700"
          />

          {/* Bolt indicator */}
          {post.type === "bolt" && (
            <div className="absolute top-2 right-2">
              <div className="p-1 bg-black/50 rounded-full">
                <Play className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          {hoveredPost === (post._id || post.id) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-6 animate-fade-in">
              <div className="flex items-center gap-1 text-white">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-medium">{post.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <MessageCircle className="w-5 h-5 fill-current" />
                <span className="font-medium">{post.comments?.length || 0}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PostGrid