import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white"
  href?: string
}

export function Logo({ className, size = "md", variant = "default", href = "/home" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  }

  const logo = (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative overflow-hidden">
        <svg
          className={cn(sizeClasses[size], "w-auto", variant === "white" ? "text-white" : "text-primary")}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simple circular background */}
          <circle cx="40" cy="40" r="36" fill="currentColor" fillOpacity="0.1" />

          {/* Classic S letter */}
          <path
            d="M25 30C25 27.2386 27.2386 25 30 25H45C47.7614 25 50 27.2386 50 30V32.5C50 35.2614 47.7614 37.5 45 37.5H35V42.5H45C47.7614 42.5 50 44.7386 50 47.5V50C50 52.7614 47.7614 55 45 55H30C27.2386 55 25 52.7614 25 50"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Classic F letter */}
          <path
            d="M55 25H65M55 25V55M55 40H62.5"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className={cn(
          "font-bold tracking-tight",
          {
            "text-lg": size === "sm",
            "text-xl": size === "md",
            "text-2xl": size === "lg",
          },
          variant === "white" ? "text-white" : "text-gray-900 dark:text-white",
        )}
      >
        ShoeeFusion
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{logo}</Link>
  }

  return logo
}
