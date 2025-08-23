"use client"

import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { Moon, Sun, Zap } from "lucide-react"

/**
 * Authentication Layout Component
 * Provides a centered, elegant layout for login/signup pages
 * Features the Bolt branding and theme toggle
 */
function AuthLayout({ children }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient overlay for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-card border border-border hover:bg-accent/10 smooth-transition focus-visible z-10"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>

      {/* Main authentication container */}
      <div className="relative w-full max-w-md">
        {/* Bolt branding header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="p-3 bg-primary rounded-2xl group-hover:scale-105 smooth-transition">
              <Zap className="w-8 h-8 text-primary-foreground fill-current" />
            </div>
            <h1 className="text-4xl font-display font-bold gradient-text">Bolt</h1>
          </Link>
          <p className="text-muted-foreground mt-2 font-body">Share your moments with the world</p>
        </div>

        {/* Authentication form container */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-slide-up">{children}</div>

        {/* Footer text */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          © 2024 Bolt. Made with passion for sharing moments.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout
