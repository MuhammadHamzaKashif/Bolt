"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { usersAPI } from "../services/api"
import EditProfileModal from "../components/EditProfileModal"
import DeleteAccountModal from "../components/DeleteAccountModal"
import PostGrid from "../components/PostGrid"
import {
    Settings,
    Edit3,
    MessageCircle,
    UserPlus,
    UserMinus,
    Grid3X3,
    Video,
    Bookmark,
    MoreHorizontal,
    Loader2,
    MapPin,
    Calendar,
    LinkIcon,
} from "lucide-react"
import { formatDate } from "../utils/formatDate"

/**
 * Profile Page Component
 * Comprehensive user profile with posts, stats, and management features
 * Much more sophisticated than basic profile pages
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to GET /api/users/:name endpoint for profile data
 * - Implement follow/unfollow functionality (PUT /api/users/:userId/follow)
 * - Get user's posts and bolts (GET /api/users/:userId/posts)
 * - Profile statistics (followers, following, posts count)
 * - User relationship status (following, followers, blocked)
 */
function Profile() {
    const { name } = useParams()
    const { user: currentUser } = useAuth()
    const navigate = useNavigate()

    const [profileUser, setProfileUser] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [postsLoading, setPostsLoading] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showMoreMenu, setShowMoreMenu] = useState(false)
    const [activeTab, setActiveTab] = useState("posts")
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)

    const isOwnProfile = !name || name === currentUser?.name

    useEffect(() => {
        loadProfile()
    }, [name])

    useEffect(() => {
        if (profileUser) {
            loadUserPosts()
        }
    }, [profileUser, activeTab])

const loadProfile = async () => {
  try {
    let response
    let userData

    if (isOwnProfile) {
      // Fetch using auth-protected endpoint (includes bio + pfp)
      response = await usersAPI.getOwnProfile()
      userData = response.data
    } else {
      // Fetch someone else’s profile by name
      response = await usersAPI.getUserProfile(name)
      userData = Array.isArray(response.data)
        ? response.data[0]
        : response.data.user
    }

    setProfileUser(userData)
    setIsFollowing(userData?.isFollowing || false)
  } catch (error) {
    console.error("Failed to load profile:", error)
    setProfileUser(mockProfileUser) // fallback
  } finally {
    setLoading(false)
  }
}

    const loadUserPosts = async () => {
        setPostsLoading(true)
        try {
            // BACKEND INTEGRATION: Fetch user's posts based on active tab
            const response = await usersAPI.getUserPosts(profileUser._id, 1)
            setUserPosts(response.data.posts || mockUserPosts)
        } catch (error) {
            console.error("Failed to load user posts:", error)
            setUserPosts(mockUserPosts)
        } finally {
            setPostsLoading(false)
        }
    }

    const handleFollow = async () => {
        if (followLoading) return

        setFollowLoading(true)
        try {
            // Optimistic update
            setIsFollowing(!isFollowing)
            setProfileUser((prev) => ({
                ...prev,
                followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
            }))

            // BACKEND INTEGRATION: Toggle follow status
            await usersAPI.toggleFollow(profileUser.id)
        } catch (error) {
            console.error("Failed to toggle follow:", error)
            // Revert optimistic update
            setIsFollowing(isFollowing)
            setProfileUser((prev) => ({
                ...prev,
                followersCount: isFollowing ? prev.followersCount + 1 : prev.followersCount - 1,
            }))
        } finally {
            setFollowLoading(false)
        }
    }

    const handleMessage = () => {
        navigate("/messages", { state: { startConversation: profileUser } })
    }

    const handleProfileUpdate = (updatedData) => {
        setProfileUser((prev) => ({ ...prev, ...updatedData }))
        setShowEditModal(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!profileUser) {
        return (
            <div className="text-center py-20 space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <UserPlus className="w-12 h-12 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-xl font-display font-semibold">User not found</h3>
                    <p className="text-muted-foreground mt-1">This user doesn't exist or has been deleted.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 py-6">
            {/* Profile Header */}
            <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <img
                            src={profileUser.pfp || "/placeholder.svg?height=120&width=120&query=user+avatar"}
                            alt={profileUser.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-border hover:border-primary/50 smooth-transition"
                        />
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center sm:text-left space-y-4">
                        {/* name and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <h1 className="text-2xl font-display font-bold text-foreground">@{profileUser.name}</h1>

                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                {isOwnProfile ? (
                                    <>
                                        <button
                                            onClick={() => setShowEditModal(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg smooth-transition"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Edit Profile
                                        </button>

                                        <div className="relative">
                                            <button
                                                onClick={() => setShowMoreMenu(!showMoreMenu)}
                                                className="p-2 hover:bg-accent/10 rounded-lg smooth-transition"
                                            >
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>

                                            {showMoreMenu && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-20 animate-slide-up">
                                                        <button
                                                            onClick={() => {
                                                                setShowMoreMenu(false)
                                                                setShowDeleteModal(true)
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive rounded-xl smooth-transition"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                            Delete Account
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleFollow}
                                            disabled={followLoading}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-lg smooth-transition ${isFollowing
                                                ? "bg-muted hover:bg-muted/80 text-muted-foreground"
                                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                                }`}
                                        >
                                            {followLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : isFollowing ? (
                                                <UserMinus className="w-4 h-4" />
                                            ) : (
                                                <UserPlus className="w-4 h-4" />
                                            )}
                                            {isFollowing ? "Unfollow" : "Follow"}
                                        </button>

                                        <button
                                            onClick={handleMessage}
                                            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg smooth-transition"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Message
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 justify-center sm:justify-start">
                            <div className="text-center">
                                <p className="text-xl font-bold text-foreground">{profileUser.postsCount || 0}</p>
                                <p className="text-sm text-muted-foreground">Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-foreground">{profileUser.followersCount || 0}</p>
                                <p className="text-sm text-muted-foreground">Followers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-foreground">{profileUser.followingCount || 0}</p>
                                <p className="text-sm text-muted-foreground">Following</p>
                            </div>
                        </div>

                        {/* Bio and Details */}
                        <div className="space-y-2">
                            {profileUser.bio && <p className="text-foreground leading-relaxed">{profileUser.bio}</p>}

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center sm:justify-start">
                                {profileUser.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profileUser.location}</span>
                                    </div>
                                )}

                                {profileUser.website && (
                                    <div className="flex items-center gap-1">
                                        <LinkIcon className="w-4 h-4" />
                                        <a
                                            href={profileUser.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            {profileUser.website}
                                        </a>
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {formatDate(profileUser.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 smooth-transition ${activeTab === "posts"
                            ? "text-primary border-b-2 border-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                            }`}
                    >
                        <Grid3X3 className="w-5 h-5" />
                        <span className="font-medium">Posts</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("bolts")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 smooth-transition ${activeTab === "bolts"
                            ? "text-primary border-b-2 border-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                            }`}
                    >
                        <Video className="w-5 h-5" />
                        <span className="font-medium">Bolts</span>
                    </button>

                    {isOwnProfile && (
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 smooth-transition ${activeTab === "saved"
                                ? "text-primary border-b-2 border-primary bg-primary/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                                }`}
                        >
                            <Bookmark className="w-5 h-5" />
                            <span className="font-medium">Saved</span>
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {postsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <PostGrid posts={userPosts} type={activeTab} />
                    )}
                </div>
            </div>

            {/* Modals */}
            {showEditModal && (
                <EditProfileModal user={profileUser} onClose={() => setShowEditModal(false)} onUpdate={handleProfileUpdate} />
            )}

            {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
        </div>
    )
}

// Mock data for development
const mockProfileUser = {
    id: "user1",
    name: "alice_photos",
    email: "alice@example.com",
    pfp: "/woman-photographer.png",
    bio: "📸 Capturing life's beautiful moments | Travel enthusiast | Coffee lover ☕️",
    location: "San Francisco, CA",
    website: "https://alicephotos.com",
    postsCount: 127,
    followersCount: 2840,
    followingCount: 892,
    createdAt: "2023-06-15T10:30:00Z",
    isFollowing: false,
}

const mockUserPosts = [
    {
        id: "post1",
        image: "/sunset-beach-palms.png",
        likesCount: 42,
        commentsCount: 8,
        type: "image",
    },
    {
        id: "post2",
        image: "/coffee-laptop-workspace.png",
        likesCount: 28,
        commentsCount: 5,
        type: "image",
    },
    {
        id: "post3",
        image: "/homemade-pasta-italian-food.png",
        likesCount: 67,
        commentsCount: 12,
        type: "image",
    },
]

export default Profile
