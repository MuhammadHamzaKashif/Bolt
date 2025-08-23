"use client"

import { useState } from "react"
import { X, Upload, Loader2, Save, MapPin, LinkIcon } from "lucide-react"
import { useAuth } from "../context/AuthContext"

/**
 * Edit Profile Modal Component
 * Comprehensive profile editing with image upload
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to PUT /api/auth/profile endpoint
 * - Implement profile picture upload
 * - name availability checking
 * - Profile data validation
 */
function EditProfileModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  })
  const [pfp, setpfp] = useState(null)
  const [pfpPreview, setpfpPreview] = useState(user.pfp || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { updateProfile } = useAuth()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const handlepfpChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      setpfp(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setpfpPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
     const form = new FormData()
    form.append("name", formData.name)
    form.append("bio", formData.bio)

    if (pfp) {
      form.append("pfp", pfp) // 👈 must match multer field name
    }

      const result = await updateProfile(form)

      if (result.success) {
        onUpdate(result.user)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div
    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  />

  {/* Modal */}
  <div className="relative w-full max-w-md max-h-[90vh] bg-card border border-border rounded-2xl shadow-xl animate-slide-up overflow-y-auto">
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
      <h2 className="text-xl font-display font-semibold">Edit Profile</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Profile Picture */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Profile Picture</label>
            <div className="flex items-center gap-4">
              <img
                src={pfpPreview || "/placeholder.svg?height=64&width=64&query=user+avatar"}
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
              <label className="cursor-pointer bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg smooth-transition text-sm font-medium">
                <Upload className="w-4 h-4 inline mr-2" />
                Change Photo
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

          {/* name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition"
              placeholder="Your name"
              disabled={loading}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition resize-none"
              placeholder="Tell us about yourself..."
              maxLength={150}
              disabled={loading}
            />
            <p className="text-muted-foreground text-xs text-right">{formData.bio.length}/150</p>
          </div>

          {/* Location */}
          {/* <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-foreground">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition"
                placeholder="Your location"
                disabled={loading}
              />
            </div>
          </div> */}

          {/* Website */}
          {/* <div className="space-y-2">
            <label htmlFor="website" className="text-sm font-medium text-foreground">
              Website
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition"
                placeholder="https://yourwebsite.com"
                disabled={loading}
              />
            </div>
          </div> */}

         {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 
                   text-primary-foreground font-medium py-3 px-4 rounded-lg 
                   smooth-transition focus-visible flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Changes
          </>
        )}
      </button>
    </form>
  </div>
</div>
  )
}

export default EditProfileModal
