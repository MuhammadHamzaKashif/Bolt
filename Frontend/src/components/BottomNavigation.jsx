"use client"

import { Link, useLocation } from "react-router-dom"
import { Home, Zap, MessageCircle, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"

/**
 * Bottom Navigation Component
 * Elegant tab-based navigation with smooth animations and active states
 * Much more polished than the basic sample design
 */
function BottomNavigation() {
  const location = useLocation()
  const { user } = useAuth()

  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
      isActive: location.pathname === "/",
    },
    {
      path: "/bolts",
      icon: Zap,
      label: "Bolts",
      isActive: location.pathname === "/bolts",
    },
    // {
    //   path: "/messages",
    //   icon: MessageCircle,
    //   label: "Messages",
    //   isActive: location.pathname === "/messages",
    // },
    {
      path: `/profile/${user?.name}`,
      icon: User,
      label: "Profile",
      isActive: location.pathname.startsWith("/profile"),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${item.isActive ? "active" : ""}`}>
                <div className="relative">
                  <Icon className={`w-6 h-6 ${item.isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {item.isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse-soft" />
                  )}
                </div>
                <span className={`text-xs font-medium ${item.isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNavigation
