"use client"

import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

/**
 * Custom hook for accessing authentication context
 * Provides a clean interface for auth operations throughout the app
 *
 * Usage:
 * const { user, login, logout, isAuthenticated } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

export default useAuth
