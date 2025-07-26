"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { CartItem } from "@/lib/types"
import { getCartItems } from "@/lib/cart-actions"
import { useAuth } from "@/components/auth-provider"

type CartContextType = {
  cartItems: CartItem[]
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  setCartItems: () => {},
  refreshCart: async () => {},
})

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  const refreshCart = async () => {
    if (user) {
      try {
        // Pass the user ID, but the function will use the authenticated user's ID
        const items = await getCartItems(user.id)
        setCartItems(items)
      } catch (error) {
        console.error("Error refreshing cart:", error)
      }
    } else {
      // Clear cart if no user
      setCartItems([])
    }
  }

  // Load cart items when user changes
  useEffect(() => {
    if (user) {
      refreshCart()
    } else {
      setCartItems([])
    }
  }, [user])

  // Make cart provider available globally for direct updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.cartProvider = {
        updateCart: refreshCart,
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.cartProvider
      }
    }
  }, [])

  return <CartContext.Provider value={{ cartItems, setCartItems, refreshCart }}>{children}</CartContext.Provider>
}
