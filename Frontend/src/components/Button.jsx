"use client"

import { forwardRef } from "react"
import { Loader2 } from "lucide-react"
import { clsx } from "clsx"

/**
 * Reusable Button Component
 * Provides consistent styling and behavior across the app
 * Supports multiple variants, sizes, and states
 */
const Button = forwardRef(
  (
    { className, variant = "primary", size = "default", loading = false, disabled = false, children, ...props },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium smooth-transition focus-visible disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
      secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
      outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
    }

    const sizes = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 py-2",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export default Button
