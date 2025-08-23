"use client"

import { useState, useRef } from "react"
import { X, Video, Upload, Loader2, Play, Pause } from "lucide-react"
import { useAuth } from "../context/AuthContext"

/**
 * Create Bolt Modal Component
 * Video upload and creation interface with preview
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to POST /api/bolts endpoint
 * - Implement video file upload and processing
 * - Video compression and optimization
 * - Thumbnail generation from video
 * - Content validation and moderation
 */
function CreateBoltModal({ onClose, onSubmit }) {
  const [caption, setCaption] = useState("")
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videoPreview, setVideoPreview] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const videoRef = useRef(null)

  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file")
        return
      }

      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        alert("Video size must be less than 100MB")
        return
      }

      // Check video duration (should be short for Bolts)
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        if (video.duration > 60) {
          alert("Video must be 60 seconds or less")
          return
        }

        setSelectedVideo(file)

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setVideoPreview(e.target.result)
        }
        reader.readAsDataURL(file)
      }
      video.src = URL.createObjectURL(file)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedVideo) {
      alert("Please select a video file")
      return
    }

    setLoading(true)

    try {
      const boltData = {
        caption: caption.trim(),
        video: selectedVideo,
        duration: videoRef.current?.duration || 0,
      }

      await onSubmit(boltData)
    } catch (error) {
      console.error("Failed to create bolt:", error)
      alert("Failed to create bolt. Please try again.")
    } finally {
      setLoading(false)
    }
  }

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Modal */}
    <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
        <h2 className="text-xl font-display font-semibold gradient-text">Create Bolt</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <img
            src={user?.pfp || "/placeholder.svg?height=40&width=40&query=user+avatar"}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-border"
          />
          <div>
            <p className="font-semibold text-foreground">@{user?.name}</p>
            <p className="text-sm text-muted-foreground">Creating a Bolt</p>
          </div>
        </div>

          {/* Video Upload */}
          {!videoPreview ? (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Upload Video</h3>
                <p className="text-sm text-muted-foreground mb-4">Select a video up to 60 seconds</p>
              </div>
              <label className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg cursor-pointer smooth-transition">
                <Upload className="w-5 h-5" />
                Choose Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
          ) : (
            /* Video Preview */
            <div className="relative rounded-xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                src={videoPreview}
                className="w-full h-64 object-cover"
                loop
                muted
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="p-4 bg-black/50 rounded-full text-white hover:bg-black/70 smooth-transition"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
                </button>
              </div>

              {/* Remove Video Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedVideo(null)
                  setVideoPreview("")
                  setIsPlaying(false)
                }}
                className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 smooth-transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-2">
            <label htmlFor="caption" className="text-sm font-medium text-foreground">
              Caption (Optional)
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption to your Bolt..."
              rows={3}
              className="w-full p-4 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent smooth-transition resize-none"
              maxLength={150}
              disabled={loading}
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Keep it short and engaging!</span>
              <span>{caption.length}/150</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedVideo}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium py-4 px-4 rounded-xl smooth-transition focus-visible flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Bolt...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Share Bolt
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateBoltModal
