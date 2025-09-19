import * as React from "react"
import { cn } from "@/lib/utils"
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "xl" | "icon"
  fullWidth?: boolean
  loading?: boolean
}

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
  icon: "p-0 w-10 h-10 flex items-center justify-center"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", fullWidth, loading, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "rounded transition",
        variant === "default"
          ? "bg-primary text-white hover:bg-primary-dark"
          : variant === "outline"
          ? "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white"
          : "bg-transparent text-primary hover:bg-primary hover:text-white",
        sizeClasses[size],
        fullWidth && "w-full",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  )
)
Button.displayName = "Button"
export { Button }
