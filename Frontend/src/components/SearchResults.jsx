"use client"

import { Link } from "react-router-dom"
import { X, User } from "lucide-react"

/**
 * Search Results Component
 * Displays user search results in an elegant dropdown
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to GET /api/users/search endpoint
 * - Implement real-time search with debouncing
 * - User profile data and follow status
 */
function SearchResults({ results, onClose }) {
  if (!results || results.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Search Results</h3>
          <button onClick={onClose} className="p-1 hover:bg-accent/10 rounded-full smooth-transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Search Results</h3>
        <button onClick={onClose} className="p-1 hover:bg-accent/10 rounded-full smooth-transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {results.map((user) => (
          <Link
            key={user.id}
            to={`/profile/${user.name}`}
            onClick={onClose}
            className="flex items-center gap-3 p-3 hover:bg-accent/10 rounded-lg smooth-transition"
          >
            <img
              src={user.pfp || "/placeholder.svg?height=40&width=40&query=user+avatar"}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-border"
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground">@{user.name}</p>
              {user.bio && <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SearchResults
