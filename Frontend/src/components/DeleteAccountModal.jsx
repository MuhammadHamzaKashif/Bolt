"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { usersAPI } from "../services/api"

/**
 * Delete Account Modal Component
 * Secure account deletion with confirmation
 *
 * BACKEND INTEGRATION NEEDED:
 * - Connect to DELETE /api/users/profile endpoint
 * - Implement secure account deletion
 * - Data cleanup and anonymization
 * - Cascade delete for user content
 */
function DeleteAccountModal({ onClose }) {
  const [confirmText, setConfirmText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm")
      return
    }

    setLoading(true)
    setError("")

    try {
      // BACKEND INTEGRATION: Delete user account
      await usersAPI.deleteAccount()

      // Logout and redirect
      logout()
      navigate("/login")
    } catch (err) {
      setError("Failed to delete account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-destructive/20 rounded-2xl shadow-xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-xl font-display font-semibold text-destructive">Delete Account</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent/10 rounded-full smooth-transition focus-visible">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-destructive">This action cannot be undone</h3>
            <ul className="text-sm text-destructive/80 space-y-1">
              <li>• All your posts and bolts will be permanently deleted</li>
              <li>• Your profile and account data will be removed</li>
              <li>• You will lose all followers and following connections</li>
              <li>• Your messages and conversations will be deleted</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Confirmation */}
          <div className="space-y-3">
            <p className="text-foreground">
              To confirm deletion, please type <strong>DELETE</strong> in the box below:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive focus:border-transparent smooth-transition"
              placeholder="Type DELETE to confirm"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-3 px-4 rounded-lg smooth-transition focus-visible"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || confirmText !== "DELETE"}
              className="flex-1 bg-destructive hover:bg-destructive/90 disabled:bg-destructive/50 text-destructive-foreground font-medium py-3 px-4 rounded-lg smooth-transition focus-visible flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal
