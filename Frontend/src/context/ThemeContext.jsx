"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

/**
 * Theme Provider for managing dark/light mode toggle
 * Persists theme preference in localStorage
 * Default theme is dark as specified in requirements
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("bolt-theme") || "dark"
    setTheme(savedTheme)

    // Apply theme class to document
    document.documentElement.className = savedTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("bolt-theme", newTheme)
    document.documentElement.className = newTheme
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
