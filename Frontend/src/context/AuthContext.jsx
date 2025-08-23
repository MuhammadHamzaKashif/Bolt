"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI, usersAPI } from "../services/api"

const AuthContext = createContext()

/**
 * Authentication Context Provider
 * Manages user authentication state and provides auth methods
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to authentication API endpoints
 * - Implement JWT token management
 * - Handle token refresh logic
 * - Manage user session persistence
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // Check for existing authentication on app load
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            // BACKEND INTEGRATION: Verify stored token and get user data
            const token = localStorage.getItem("bolt-token")
            if (token) {
                // Validate token with backend and get user info
                const response = await usersAPI.getOwnProfile()
                const userData = response.data;
                setUser(userData)
                setIsAuthenticated(true)
            }
        } catch (error) {
            // Token invalid or expired, clear storage
            localStorage.removeItem("bolt-token")
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            // BACKEND INTEGRATION: Send login credentials to API
            const response = await authAPI.login({ email, password })
            const { user: userData, token } = response.data

            // Store token and user data
            localStorage.setItem("bolt-token", token)
            const profileResponse = await usersAPI.getOwnProfile()
            setUser(profileResponse.data)
            setIsAuthenticated(true)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Login failed",
            }
        }
    }

    const signup = async (userData) => {
        try {
            // BACKEND INTEGRATION: Send signup data to API
            const response = await authAPI.signup(userData)
            const { user: newUser, token } = response.data

            // Store token and user data
            localStorage.setItem("bolt-token", token)
            const profileResponse = await usersAPI.getOwnProfile()
            setUser(profileResponse.data)
            setIsAuthenticated(true)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Signup failed",
            }
        }
    }

    const logout = () => {
        // Clear authentication data
        localStorage.removeItem("bolt-token")
        setUser(null)
        setIsAuthenticated(false)
    }

    const updateProfile = async (profileData) => {
        try {
            // BACKEND INTEGRATION: Update user profile
            const response = await authAPI.updateProfile(profileData)
            setUser(response.data.user)
            return { success: true, user: response.data.user }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Profile update failed",
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                signup,
                logout,
                updateProfile,
                checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export { AuthContext }
