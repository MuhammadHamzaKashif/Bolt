"use client"

import TopNavbar from "./TopNavbar"

/**
 * Legacy Navbar component for backward compatibility
 * Redirects to the new TopNavbar component
 */
function Navbar() {
  return <TopNavbar />
}

export default Navbar
