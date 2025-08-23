import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import Home from "./pages/Home"
import Bolts from "./pages/Bolts"
import Messages from "./pages/Messages"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

/**
 * Root App component that sets up routing and global providers
 * Provides authentication context and theme management throughout the app
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            {/* Authentication routes with special layout */}
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthLayout>
                  <Signup />
                </AuthLayout>
              }
            />

            {/* Main app routes with navigation layout */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/bolts"
              element={
                <MainLayout>
                  <Bolts />
                </MainLayout>
              }
            />
            <Route
              path="/messages"
              element={
                <MainLayout>
                  <Messages />
                </MainLayout>
              }
            />
            <Route
              path="/profile/:name?"
              element={
                <MainLayout>
                  <Profile />
                </MainLayout>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
