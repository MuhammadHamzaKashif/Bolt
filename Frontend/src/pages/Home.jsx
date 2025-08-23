"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { postsAPI } from "../services/api"
import PostCard from "../components/PostCard"
import CreatePostModal from "../components/CreatePostModal"
import SearchResults from "../components/SearchResults"
import { Plus, Loader2, RefreshCw } from "lucide-react"

/**
 * Home Page Component
 * Features an elegant posts feed with create post functionality
 * Much more sophisticated than the basic sample design
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to GET /api/posts endpoint for feed data
 * - Implement infinite scroll pagination
 * - Real-time updates for new posts
 * - Post creation with image/video upload
 * - Like/unlike functionality with optimistic updates
 * - Comment system with nested replies
 */
function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const { user } = useAuth()

//   console.log(user.name)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      // BACKEND INTEGRATION: Fetch posts from API
      const response = await postsAPI.getPosts(1, 20)
      const posts = (response.data.posts || []).filter((p) => p.type === "post")
      setPosts(posts)
    } catch (error) {
      console.error("Failed to load posts:", error)
      // Use mock data for development
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadPosts()
    setRefreshing(false)
  }

  const handleCreatePost = async (formData) => {
    try {
      // BACKEND INTEGRATION: Create new post
      const response = await postsAPI.createPost(formData)
      const newPost = response.data.post

      // Add new post to the beginning of the feed
      setPosts((prev) => [newPost, ...prev])
      setShowCreateModal(false)
    } catch (error) {
      console.error("Failed to create post:", error)
    }
  }

  const handleLikePost = async (postId) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
              }
            : post,
        ),
      )

      // BACKEND INTEGRATION: Toggle like on server
      await postsAPI.toggleLike(postId)
    } catch (error) {
      console.error("Failed to toggle like:", error)
      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((post) =>
          (post._id || post.id) === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likesCount: post.isLiked ? post.likesCount + 1 : post.likesCount - 1,
              }
            : post,
        ),
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your feed...</p>
        </div>
      </div>
    )
  }

//   console.log(posts)

  return (
    <div className="space-y-6 py-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="text-3xl font-display font-bold gradient-text">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Discover amazing moments from your community</p>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex-1 flex items-center justify-center gap-2 p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl smooth-transition hover:scale-[1.02] focus-visible"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Share a moment</span>
        </button>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-4 bg-card hover:bg-accent/10 border border-border rounded-xl smooth-transition hover:scale-105 focus-visible"
          aria-label="Refresh feed"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search Results */}
      {showSearchResults && <SearchResults results={searchResults} onClose={() => setShowSearchResults(false)} />}

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Plus className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold">No posts yet</h3>
              <p className="text-muted-foreground mt-1">Be the first to share a moment!</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg smooth-transition"
            >
              Create your first post
            </button>
          </div>
        ) : (
          posts.map((post, index) => (
            <PostCard
              key={post._id || post.id || index}
              post={post}
              currentUserId={user._id}
              onLike={() => handleLikePost(post._id || post.id)}
              className={`animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePost} />}
    </div>
  )
}

// Mock data for development
const mockPosts = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "alice_photos",
      pfp: "/woman-photographer.png",
    },
    content: "Caught this amazing sunset at the beach today! Nature never fails to amaze me 🌅",
    image: "/sunset-beach-palms.png",
    createdAt: "2024-01-15T18:30:00Z",
    likesCount: 42,
    commentsCount: 8,
    isLiked: false,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "travel_mike",
      pfp: "/man-traveler.png",
    },
    content: "Coffee and code - the perfect combination for a productive morning ☕️",
    image: "/coffee-laptop-workspace.png",
    createdAt: "2024-01-15T09:15:00Z",
    likesCount: 28,
    commentsCount: 5,
    isLiked: true,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "foodie_sarah",
      pfp: "/woman-chef-preparing-food.png",
    },
    content: "Homemade pasta night! Nothing beats fresh ingredients and good company 🍝",
    image: "/homemade-pasta-italian-food.png",
    createdAt: "2024-01-14T20:45:00Z",
    likesCount: 67,
    commentsCount: 12,
    isLiked: false,
  },
]

export default Home
