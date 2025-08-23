"use client"

import { useState, useEffect, useRef } from "react"
import { postsAPI } from "../services/api"
import BoltCard from "../components/BoltCard"
import CreateBoltModal from "../components/CreateBoltModal"
import { Plus, Zap } from "lucide-react"

/**
 * Bolts Page Component
 * Full-screen vertical video feed similar to TikTok/Instagram Reels
 * Features smooth scrolling, auto-play, and elegant interactions
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to GET /api/bolts endpoint for video feed
 * - Implement infinite scroll with pagination
 * - Video streaming and optimization
 * - Like/unlike functionality for videos
 * - Comment system for video posts
 * - Video upload and processing pipeline
 */
function Bolts() {
  const [bolts, setBolts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    loadBolts()
  }, [])

  const loadBolts = async () => {
    try {
      // BACKEND INTEGRATION: Fetch video posts from API
      const response = await postsAPI.getPosts(1, 20)
    //   console.log(response.data)
      const boltPosts = (response.data.posts || []).filter((p) => p.type === "bolt")
      setBolts(boltPosts)
    } catch (error) {
      console.error("Failed to load bolts:", error)
      setBolts([])
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollTop = container.scrollTop
    const itemHeight = container.clientHeight
    const newIndex = Math.round(scrollTop / itemHeight)

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < bolts.length) {
      setCurrentIndex(newIndex)
    }
  }

  const handleLikeBolt = async (boltId) => {
    try {
      // Optimistic update
      setBolts((prev) =>
        prev.map((bolt) =>
          bolt._id === boltId
            ? {
                ...bolt,
                isLiked: !bolt.isLiked,
                likesCount: bolt.isLiked ? bolt.likesCount - 1 : bolt.likesCount + 1,
              }
            : bolt,
        ),
      )

      // BACKEND INTEGRATION: Toggle like on server
      await postsAPI.toggleLike(boltId)
    } catch (error) {
      console.error("Failed to toggle like:", error)
      // Revert optimistic update on error
      setBolts((prev) =>
        prev.map((bolt) =>
          bolt._id === boltId
            ? {
                ...bolt,
                isLiked: !bolt.isLiked,
                likesCount: bolt.isLiked ? bolt.likesCount + 1 : bolt.likesCount - 1,
              }
            : bolt,
        ),
      )
    }
  }

  const handleCreateBolt = async (boltData) => {
    try {
      // BACKEND INTEGRATION: Create new video post
      const formData = new FormData();
    formData.append("caption", boltData.caption);
    formData.append("type", "bolt")
     if (boltData.video) {
      formData.append("media", boltData.video); // same field name as backend expects
    }
      const response = await postsAPI.createPost(formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
      const newBolt = response.data.post

      // Add new bolt to the beginning of the feed
      setBolts((prev) => [newBolt, ...prev])
      setShowCreateModal(false)
    } catch (error) {
      console.error("Failed to create bolt:", error)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary rounded-2xl">
            <Zap className="w-8 h-8 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading Bolts...</p>
        </div>
      </div>
    )
  }

  if (bolts.length === 0) {
  return (
    <div className="h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Zap className="w-16 h-16 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold gradient-text mb-2">No Bolts Yet</h2>
          <p className="text-muted-foreground mb-6">Be the first to share a video moment!</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl smooth-transition hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          Create First Bolt
        </button>
      </div>

      {showCreateModal && (
        <CreateBoltModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBolt}
        />
      )}
    </div>
  )
}


  return (
    <div className="relative h-screen bg-background overflow-hidden">
      {/* Video Feed Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {bolts.map((bolt, index) => (
          <BoltCard
            key={bolt._id}
            bolt={bolt}
            isActive={index === currentIndex}
            onLike={() => handleLikeBolt(bolt._id)}
          />
        ))}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-6 z-10 p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:scale-110 smooth-transition focus-visible"
        aria-label="Create Bolt"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Progress Indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 space-y-2">
        {bolts.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full smooth-transition ${
              index === currentIndex ? "bg-primary" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Create Bolt Modal */}
      {showCreateModal && <CreateBoltModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateBolt} />}
    </div>
  )
}

// Mock data for development
const mockBolts = [
  {
    id: "bolt1",
    user: {
      id: "user1",
      name: "dance_queen",
      pfp: "/woman-dancing-studio.png",
    },
    caption: "New dance routine! What do you think? 💃",
    videoUrl: "/dance-routine-studio.mp4",
    thumbnailUrl: "/dance-routine-thumbnail.png",
    duration: 15,
    createdAt: "2024-01-15T20:30:00Z",
    likesCount: 156,
    commentsCount: 23,
    isLiked: false,
  },
  {
    id: "bolt2",
    user: {
      id: "user2",
      name: "chef_marco",
      pfp: "/man-chef-cooking.png",
    },
    caption: "60-second pasta recipe that will blow your mind! 🍝",
    videoUrl: "/pasta-cooking-tutorial.mp4",
    thumbnailUrl: "/pasta-cooking-thumbnail.png",
    duration: 30,
    createdAt: "2024-01-15T18:45:00Z",
    likesCount: 89,
    commentsCount: 12,
    isLiked: true,
  },
  {
    id: "bolt3",
    user: {
      id: "user3",
      name: "fitness_alex",
      pfp: "/person-workout-gym.png",
    },
    caption: "Quick morning workout to start your day right! 💪",
    videoUrl: "/morning-workout-routine.mp4",
    thumbnailUrl: "/workout-routine-thumbnail.png",
    duration: 25,
    createdAt: "2024-01-15T07:00:00Z",
    likesCount: 234,
    commentsCount: 45,
    isLiked: false,
  },
]

export default Bolts
