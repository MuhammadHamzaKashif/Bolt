"use client"

import { useState } from "react"
import { X, ImageIcon, Video, Loader2, Upload } from "lucide-react"
import { useAuth } from "../context/AuthContext"

/**
 * Create Post Modal Component
 * Elegant post creation interface with media upload
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to POST /api/posts endpoint
 * - Implement file upload for images/videos
 * - Image/video processing and optimization
 * - Content validation and moderation
 */
function CreatePostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"]
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image or video file")
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        alert("File size must be less than 50MB")
        return
      }

      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim() && !selectedFile) {
      alert("Please add some content or select a file")
      return
    }

    setLoading(true)

      try {
    const formData = new FormData();
    formData.append("caption", content.trim());
    if (selectedFile) {
      formData.append("media", selectedFile);
    }

    await onSubmit(formData);
    } catch (error) {
      console.error("Failed to create post:", error)
      alert("Failed to create post. Please try again.")
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
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card border border-border rounded-2xl shadow-xl animate-slide-up overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-xl font-display font-semibold">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={user?.pfp || "/placeholder.svg?height=40&width=40&query=user+avatar"}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-border"
            />
            <div>
              <p className="font-semibold text-foreground">@{user?.name}</p>
              <p className="text-sm text-muted-foreground">Sharing to your feed</p>
            </div>
          </div>

          {/* Content Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full p-4 bg-input border border-border rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-primary 
                       focus:border-transparent smooth-transition resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{content.length}/500</span>
          </div>

          {/* File Preview */}
          {filePreview && (
            <div className="relative rounded-xl overflow-hidden bg-muted">
              {selectedFile?.type.startsWith("video/") ? (
                <video src={filePreview} controls className="w-full h-auto max-h-64 object-cover" />
              ) : (
                <img
                  src={filePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null)
                  setFilePreview("")
                }}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground 
                           rounded-full hover:bg-destructive/90 smooth-transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Media Upload Buttons */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 
                               text-secondary-foreground rounded-lg cursor-pointer smooth-transition">
              <ImageIcon className="w-5 h-5" />
              <span>Photo</span>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={loading} />
            </label>
            <label className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 
                               text-secondary-foreground rounded-lg cursor-pointer smooth-transition">
              <Video className="w-5 h-5" />
              <span>Video</span>
              <input type="file" accept="video/*" onChange={handleFileSelect} className="hidden" disabled={loading} />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (!content.trim() && !selectedFile)}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 
                       text-primary-foreground font-medium py-3 px-4 rounded-xl smooth-transition 
                       focus-visible flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Share Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal