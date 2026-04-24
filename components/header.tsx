"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu, X, LogOut, Heart, Package } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { Logo } from "@/components/logo"
import { useEventListener } from "@/hooks/use-event-listener"

export function Header() {
  const { user, signOut } = useAuth()
  const { cartItems } = useCart()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 10)
    }
  }

  useEventListener("scroll", handleScroll)

  useEffect(() => {
    handleScroll()
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Customize", href: "/customize" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
  ]

  const userMenuItems = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Saved Designs", href: "/saved-designs", icon: Heart },
    { name: "Orders", href: "/orders", icon: Package },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background border-b border-border py-4" : "bg-background/0 py-6",
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Logo href="/" variant="default" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative text-xs uppercase tracking-[0.2em] font-bold transition-all hover:opacity-100",
                pathname === item.href
                  ? "text-primary opacity-100"
                  : "text-foreground opacity-50",
              )}
            >
              {item.name}
              {pathname === item.href && (
                <div
                  className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/cart" className="relative transition-opacity hover:opacity-70">
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-primary text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-none">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center transition-opacity hover:opacity-70">
                <User className="h-5 w-5" />
              </button>
              <div className="absolute right-0 mt-4 w-56 origin-top-right bg-background border border-border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-3 px-4 border-b border-border">
                  <p className="text-xs tracking-wider opacity-50 truncate">{user.email}</p>
                </div>
                <div className="py-2">
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-3 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-colors"
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={signOut}
                    className="flex w-full items-center px-4 py-3 text-xs uppercase tracking-widest font-bold text-primary hover:bg-primary hover:text-background transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs uppercase tracking-[0.2em] font-bold border border-foreground px-6 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden transition-opacity hover:opacity-70"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden bg-background border-b border-border transition-all duration-300 overflow-hidden absolute w-full top-full",
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <div className="container py-6 space-y-6">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-lg uppercase tracking-widest font-bold",
                  pathname === item.href
                    ? "text-primary"
                    : "text-foreground opacity-50 hover:opacity-100",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-border flex flex-col space-y-4">
            <Link
              href="/cart"
              className="flex items-center text-sm uppercase tracking-widest font-bold hover:opacity-70"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingCart className="mr-4 h-5 w-5" />
              Cart
              {cartItems.length > 0 && (
                <span className="ml-auto bg-primary text-background text-xs px-2 py-1">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {userMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-sm uppercase tracking-widest font-bold hover:opacity-70"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-4 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    signOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center text-sm uppercase tracking-widest font-bold text-red-500 hover:opacity-70"
                >
                  <LogOut className="mr-4 h-5 w-5" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center text-sm uppercase tracking-widest font-bold text-primary hover:opacity-70"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="mr-4 h-5 w-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
