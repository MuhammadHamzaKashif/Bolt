"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Heart, MessageCircle, Share, Play, Volume2, VolumeX } from "lucide-react"
import { formatRelativeTime } from "../utils/formatDate"

/**
 * Bolt Card Component
 * Full-screen video post with elegant controls and interactions
 * Features auto-play, mute toggle, and smooth animations
 */
function BoltCard({ bolt, isActive, onLike }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const videoRef = useRef(null)
  const controlsTimeoutRef = useRef(null)
  const [thumbnail, setThumbnail] = useState(null)
const canvasRef = useRef(null)




  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isActive])

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoClick = () => {
    togglePlayPause()
    showControlsTemporarily()
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }


  const generateThumbnail = () => {
  const video = videoRef.current
  const canvas = canvasRef.current
  if (!video || !canvas) return

  const ctx = canvas.getContext("2d")
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  const dataUrl = canvas.toDataURL("image/png")
  setThumbnail(dataUrl)
}

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    await onLike()

    setTimeout(() => setIsLiking(false), 300)
  }

  return (
    <div className="relative h-screen w-full snap-start snap-always bg-black flex items-center justify-center">
      {/* Video Player */}
      <video
        ref={videoRef}
        src={bolt.mediaPaths && bolt.mediaPaths[0] ? bolt.mediaPaths[0] : "/placeholder-video.mp4"}
        poster={thumbnail || bolt.thumbnailUrl || "/video-thumbnail.png"}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Video Controls Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none smooth-transition ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {!isPlaying && (
          <button
            onClick={togglePlayPause}
            className="p-6 bg-black/50 rounded-full text-white hover:bg-black/70 smooth-transition pointer-events-auto"
          >
            <Play className="w-12 h-12 fill-current" />
          </button>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleMute}
          className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 smooth-transition"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center gap-6">
        {/* User Profile */}
        <Link to={`/profile/${bolt.user.name}`} className="group">
          <div className="relative">
            <img
              src={bolt.user.pfp || "/placeholder.svg?height=48&width=48&query=user+avatar"}
              alt={bolt.user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white group-hover:border-primary smooth-transition"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-xs font-bold text-primary-foreground">+</span>
            </div>
          </div>
        </Link>

        {/* Like Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleLike}
            className={`p-3 rounded-full smooth-transition ${
              bolt.isLiked ? "text-red-500" : "text-white hover:text-red-500"
            } ${isLiking ? "animate-heartbeat" : ""}`}
          >
            <Heart className={`w-8 h-8 ${bolt.isLiked ? "fill-current" : ""}`} />
          </button>
          <span className="text-white text-sm font-medium">{bolt.likes?.length || 0}</span>        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full text-white hover:text-blue-400 smooth-transition">
            <MessageCircle className="w-8 h-8" />
          </button>
          <span className="text-white text-sm font-medium">{bolt.comments?.length || 0}</span>        </div>

        {/* Share Button */}
        <button className="p-3 rounded-full text-white hover:text-green-400 smooth-transition">
          <Share className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-4 left-4 right-20 z-10 text-white">
        {/* User Info */}
        <Link to={`/profile/${bolt.user.name}`} className="flex items-center gap-2 mb-3 group">
          <span className="font-semibold group-hover:text-primary smooth-transition">@{bolt.user.name}</span>
          <span className="text-white/70 text-sm">{formatRelativeTime(bolt.createdAt)}</span>
        </Link>

        {/* Caption */}
        {bolt.caption && <p className="text-white leading-relaxed mb-2 line-clamp-3 text-shadow-sm">{bolt.caption}</p>}

        {/* Duration */}
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
          <span>{bolt.duration}s</span>
        </div>
      </div>

      {/* Gradient Overlays for Better Text Readability */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
    <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>
  )
}

export default BoltCard
