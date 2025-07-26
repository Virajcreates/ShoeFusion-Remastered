"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useAuth } from "@/components/auth-provider"

export function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === "/" && "bg-accent/10 text-accent-foreground font-medium",
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/explore" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === "/explore" && "bg-accent/10 text-accent-foreground font-medium",
              )}
            >
              Explore
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/customize" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === "/customize" && "bg-accent/10 text-accent-foreground font-medium",
              )}
            >
              Customize
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                    href="/customize"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium text-white">Custom Shoes</div>
                    <p className="text-sm leading-tight text-white/90">
                      Design your own unique shoes with our customization tool.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/explore" title="All Shoes">
                Browse our collection of premium shoes
              </ListItem>
              <ListItem href="/saved-designs" title="Saved Designs">
                View your saved custom designs
              </ListItem>
              <ListItem href="/orders" title="Your Orders">
                Track and manage your orders
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Help</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <ListItem href="/about" title="About Us">
                Learn about our company and mission
              </ListItem>
              <ListItem href="/faq" title="FAQ">
                Frequently asked questions
              </ListItem>
              <ListItem href="/contact" title="Contact Us">
                Get in touch with our support team
              </ListItem>
              <ListItem href="/shipping-policy" title="Shipping Policy">
                Information about shipping and delivery
              </ListItem>
              <ListItem href="/return-policy" title="Return Policy">
                Our return and refund policies
              </ListItem>
              <ListItem href="/size-guide" title="Size Guide">
                Find your perfect shoe size
              </ListItem>
              <ListItem href="/track-order" title="Track Order">
                Track the status of your order
              </ListItem>
              <ListItem href="/privacy-policy" title="Privacy Policy">
                How we protect your data
              </ListItem>
              <ListItem href="/terms-of-service" title="Terms of Service">
                Terms and conditions for using our service
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {user && (
          <NavigationMenuItem>
            <Link href="/profile" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname === "/profile" && "bg-accent/10 text-accent-foreground font-medium",
                )}
              >
                Profile
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface ListItemProps {
  title: string
  href: string
  children: React.ReactNode
}

const ListItem = ({ title, href, children }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
