"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Zap, Search, Plus, Moon, Sun, LogOut, Settings, User } from "lucide-react"

/**
 * Top Navigation Bar Component
 * Features Bolt branding, search functionality, post creation, and user menu
 * Much more sophisticated than the basic sample design
 */
function TopNavbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // BACKEND INTEGRATION: Implement user search functionality
      // Navigate to search results or show search dropdown
      console.log("Searching for:", searchQuery)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }
//   console.log(user)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Bolt Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-xl group-hover:scale-105 smooth-transition">
            <Zap className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-2xl font-display font-bold gradient-text hidden sm:block">Bolt</h1>
        </Link>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition"
            />
          </form>
        </div>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-3">
          {/* Create Post Button */}
          <button
            onClick={() => navigate("/")} // Will open create post modal
            className="p-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full smooth-transition hover:scale-105 focus-visible"
            aria-label="Create post"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 hover:bg-accent/10 rounded-full smooth-transition focus-visible"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 hover:bg-accent/10 rounded-full smooth-transition focus-visible"
            >
              <img
                src={user?.pfp || "/placeholder.svg?height=32&width=32&query=user+avatar"}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-border"
              />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />

                {/* Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-20 animate-slide-up">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.pfp || "/placeholder.svg?height=40&width=40&query=user+avatar"}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-foreground">@{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      to={`/profile/${user?.name}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-accent/10 rounded-lg smooth-transition"
                    >
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        // Open settings modal
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent/10 rounded-lg smooth-transition"
                    >
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-border my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-destructive/10 text-destructive rounded-lg smooth-transition"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
