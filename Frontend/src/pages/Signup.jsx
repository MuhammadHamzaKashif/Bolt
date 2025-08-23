"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Eye, EyeOff, UserPlus, Loader2, Upload, X } from "lucide-react"

/**
 * Signup Page Component
 * Comprehensive registration form with profile picture upload
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to POST /api/auth/signup endpoint
 * - Implement file upload for profile pictures (POST /api/upload/image)
 * - Add name availability checking (GET /api/auth/check-name)
 * - Email validation and verification system
 * - Password strength validation on backend
 * - User profile creation with bio and profile picture
 */
function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  })
  const [pfp, setpfp] = useState(null)
  const [pfpPreview, setpfpPreview] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user starts typing
    if (error) setError("")
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handlepfpChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size must be less than 5MB")
        return
      }

      setpfp(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setpfpPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removepfp = () => {
    setpfp(null)
    setpfpPreview("")
  }

  const validateForm = () => {
    const errors = {}

    // name validation
    if (formData.name.length < 3) {
      errors.name = "name must be at least 3 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      // Prepare signup data
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
        pfp: pfp, // Will be handled by backend upload
      }

      const result = await signup(signupData)

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
        <h2 className="text-2xl font-display font-semibold text-foreground">Join Bolt</h2>
        <p className="text-muted-foreground mt-1">Create your account and start sharing</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 animate-slide-up">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Signup form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile picture upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Profile Picture (Optional)</label>
          <div className="flex items-center gap-4">
            {pfpPreview ? (
              <div className="relative">
                <img
                  src={pfpPreview || "/placeholder.svg"}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                />
                <button
                  type="button"
                  onClick={removepfp}
                  className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 smooth-transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <label className="cursor-pointer bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg smooth-transition text-sm font-medium">
              Choose Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlepfpChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
        </div>

        {/* name field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition ${
              fieldErrors.name ? "border-destructive" : "border-border"
            }`}
            placeholder="Choose a unique name"
            disabled={loading}
          />
          {fieldErrors.name && <p className="text-destructive text-sm">{fieldErrors.name}</p>}
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition ${
              fieldErrors.email ? "border-destructive" : "border-border"
            }`}
            placeholder="Enter your email address"
            disabled={loading}
          />
          {fieldErrors.email && <p className="text-destructive text-sm">{fieldErrors.email}</p>}
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password *
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition ${
                fieldErrors.password ? "border-destructive" : "border-border"
              }`}
              placeholder="Create a secure password"
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
          {fieldErrors.password && <p className="text-destructive text-sm">{fieldErrors.password}</p>}
        </div>

        {/* Confirm password field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition ${
                fieldErrors.confirmPassword ? "border-destructive" : "border-border"
              }`}
              placeholder="Confirm your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground smooth-transition"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && <p className="text-destructive text-sm">{fieldErrors.confirmPassword}</p>}
        </div>

        {/* Bio field */}
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium text-foreground">
            Bio (Optional)
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition resize-none"
            placeholder="Tell us a bit about yourself..."
            disabled={loading}
            maxLength={150}
          />
          <p className="text-muted-foreground text-xs text-right">{formData.bio.length}/150</p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium py-3 px-4 rounded-lg smooth-transition focus-visible flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Create Account
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
          <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
        </div>
      </div>

      {/* Sign in link */}
      <Link
        to="/login"
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-3 px-4 rounded-lg smooth-transition focus-visible flex items-center justify-center gap-2 text-center"
      >
        Sign In
      </Link>
    </div>
  )
}

export default Signup
