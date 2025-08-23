"use client"

import { useState } from "react"
import { X, Search, Loader2, MessageCircle } from "lucide-react"
import { usersAPI } from "../services/api"

/**
 * New Message Modal Component
 * Search and select users to start new conversations
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to GET /api/users/search endpoint
 * - Real-time user search with debouncing
 * - User availability status
 */
function NewMessageModal({ onClose, onStartConversation }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      // BACKEND INTEGRATION: Search users
      const response = await usersAPI.searchUsers(query)
      setSearchResults(response.data.users || mockSearchResults)
    } catch (error) {
      console.error("Failed to search users:", error)
      setSearchResults(mockSearchResults)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleStartConversation = (user) => {
    onStartConversation(user)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-display font-semibold">New Message</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              {searchQuery ? (
                <>
                  <Search className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No users found for "{searchQuery}"</p>
                </>
              ) : (
                <>
                  <MessageCircle className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Search for users to start a conversation</p>
                </>
              )}
            </div>
          ) : (
            <div className="p-2">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleStartConversation(user)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent/10 rounded-lg smooth-transition"
                >
                  <img
                    src={user.pfp || "/placeholder.svg?height=40&width=40&query=user+avatar"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-border"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">@{user.name}</p>
                    {user.bio && <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mock search results for development
const mockSearchResults = [
  {
    id: "user3",
    name: "foodie_sarah",
    pfp: "/woman-chef-preparing-food.png",
    bio: "Food lover & chef 👩‍🍳 Sharing delicious recipes",
  },
  {
    id: "user4",
    name: "fitness_alex",
    pfp: "/person-workout-gym.png",
    bio: "Personal trainer 💪 Helping you reach your goals",
  },
]

export default NewMessageModal
