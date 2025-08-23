"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react"

/**
 * Login Page Component
 * Elegant login form with enhanced UX and validation
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to POST /api/auth/login endpoint
 * - Handle JWT token response and storage
 * - Implement proper error handling for invalid credentials
 * - Add rate limiting protection against brute force attacks
 */
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(formData.email, formData.password)
    //   console.log(result)
      if (result.success) {
        navigate("/", { replace: true })
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-display font-semibold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground mt-1">Sign in to your Bolt account</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 animate-slide-up">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition"
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground smooth-transition"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !formData.email || !formData.password}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium py-3 px-4 rounded-lg smooth-transition focus-visible flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Don't have an account?</span>
        </div>
      </div>

      {/* Sign up link */}
      <Link
        to="/signup"
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-3 px-4 rounded-lg smooth-transition focus-visible flex items-center justify-center gap-2 text-center"
      >
        Create Account
      </Link>
    </div>
  )
}

export default Login
