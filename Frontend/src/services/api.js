import axios from "axios"

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bolt-token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      // Handle expired token specifically
      if (status === 401 && (data?.message === "jwt expired" || data?.name === "TokenExpiredError")) {
        localStorage.removeItem("bolt-token")
        window.location.href = "/login"
      }

      // Handle other unauthorized cases (invalid token, no token, etc.)
      if (status === 401) {
        localStorage.removeItem("bolt-token")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// Authentication API endpoints
export const authAPI = {
  // POST /api/auth/login - Login with name/password
  login: (credentials) => api.post("/auth/login", credentials),

  // POST /api/auth/signup - Register new user
  signup: (userData) => api.post("/auth/signup", userData),

  // GET /api/auth/verify - Verify JWT token
  verifyToken: (token) =>
    api.get("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // PUT /api/auth/profile - Update user profile
  updateProfile: (profileData) => {
  if (profileData instanceof FormData) {
    return api.put("/user/me", profileData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  }
  return api.put("/user/me", profileData)
},
}

// Posts API endpoints
export const postsAPI = {
  // GET /api/posts - Get feed posts with pagination
//   getPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  getPosts: (page = 1, limit = 10) => api.get(`/post/?page=${page}&limit=${limit}`),

  // POST /api/posts - Create new post
//   createPost: (postData) => api.post("/post/post", postData),
  createPost: (formData) =>
    api.post("/post/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // PUT /api/posts/:id/like - Toggle like on post
  toggleLike: (postId) => api.put(`/post/${postId}/like`),

  // GET /api/posts/:id/comments - Get post comments
  getComments: (postId) => api.get(`/post/${postId}/comments`),

  // POST /api/posts/:id/comments - Add comment to post
  addComment: (postId, comment) => api.post(`/post/${postId}/comments`, comment),

  // DELETE /api/posts/:id - Delete post (owner only)
  deletePost: (postId) => api.delete(`/post/${postId}`),
}

// Bolts (video posts) API endpoints
export const boltsAPI = {
  // GET /api/bolts - Get video posts feed
  getBolts: (page = 1, limit = 10) => api.get(`/bolts?page=${page}&limit=${limit}`),

  // POST /api/bolts - Create new video post
  createBolt: (boltData) => api.post("/bolts", boltData),

  // PUT /api/bolts/:id/like - Toggle like on bolt
  toggleLike: (boltId) => api.put(`/bolts/${boltId}/like`),

  // POST /api/bolts/:id/comments - Add comment to bolt
  addComment: (boltId, comment) => api.post(`/bolts/${boltId}/comments`, comment),
}

// Users API endpoints
export const usersAPI = {
  // GET /api/users/search?q=query - Search users by name
  searchUsers: (query) => api.get(`/user/search?q=${encodeURIComponent(query)}`),

  // GET /api/users/:name - Get user profile
  getUserProfile: (name) => api.get(`/user/${name}`),

  // GET /api/user/me - Get logged-in user's own profile
  getOwnProfile: () => api.get("/user/me"),

  // PUT /api/users/:userId/follow - Toggle follow user
  toggleFollow: (userId) => api.put(`/user/${userId}/follow`),

  // GET /api/users/:userId/posts - Get user's posts
  getUserPosts: (userId, page = 1) => api.get(`/user/${userId}/posts?page=${page}`),

  // DELETE /api/users/profile - Delete user account
  deleteAccount: () => api.delete("/user/me"),
}

// Messages API endpoints
export const messagesAPI = {
  // GET /api/messages/conversations - Get user's conversations
  getConversations: () => api.get("/messages/conversations"),

  // GET /api/messages/:conversationId - Get messages in conversation
  getMessages: (conversationId, page = 1) => api.get(`/messages/${conversationId}?page=${page}`),

  // POST /api/messages - Send new message
  sendMessage: (messageData) => api.post("/messages", messageData),

  // POST /api/messages/conversations - Start new conversation
  startConversation: (userId) => api.post("/messages/conversations", { userId }),
}

// File upload API
export const uploadAPI = {
  // POST /api/upload/image - Upload image file
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append("image", file)
    return api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  // POST /api/upload/video - Upload video file
  uploadVideo: (file) => {
    const formData = new FormData()
    formData.append("video", file)
    return api.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}

export default api
