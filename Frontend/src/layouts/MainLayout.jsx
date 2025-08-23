"use client"

import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import TopNavbar from "../components/TopNavbar"
import BottomNavigation from "../components/BottomNavigation"
import { Loader2 } from "lucide-react"

/**
 * Main Layout Component
 * Provides the authenticated app structure with top navbar and bottom navigation
 * Handles authentication checks and loading states
 */
function MainLayout({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Bolt...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <TopNavbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 pt-16">
        <div className="max-w-2xl mx-auto px-4">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default MainLayout
