import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import type { CartItem, ShippingAddress } from "@/lib/types"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function createOrder(userId: string, items: CartItem[], address: ShippingAddress, paymentMethod = "card") {
  try {
    // Calculate order totals
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = Math.round(total * 0.18) // 18% GST
    const shipping = 0 // Free shipping

    // Create order object
    const orderId = uuidv4()
    const order = {
      id: orderId,
      userId,
      items,
      total,
      tax,
      shipping,
      address,
      status: "pending",
      paymentMethod,
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    // Try to save to Supabase
    try {
      const { error } = await supabase.from("orders").insert([order])
      if (error) throw error
    } catch (supabaseError) {
      console.warn("Error saving order to Supabase, using localStorage fallback:", supabaseError)

      // Fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || "[]")
      localOrders.push(order)
      localStorage.setItem(`orders_${userId}`, JSON.stringify(localOrders))
    }

    return order
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrders(userId: string) {
  try {
    // Try to get from Supabase
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })

      if (error) throw error
      if (data && data.length > 0) {
        return data
      }
    } catch (supabaseError) {
      console.warn("Error fetching orders from Supabase, using localStorage fallback:", supabaseError)
    }

    // Fallback to localStorage
    const localOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || "[]")
    return localOrders
  } catch (error) {
    console.error("Error getting orders:", error)
    throw error
  }
}

export async function getOrder(userId: string, orderId: string) {
  try {
    // Try to get from Supabase
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).eq("userId", userId).single()

      if (error) throw error
      if (data) {
        return data
      }
    } catch (supabaseError) {
      console.warn("Error fetching order from Supabase, using localStorage fallback:", supabaseError)
    }

    // Fallback to localStorage
    const localOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || "[]")
    const order = localOrders.find((o: any) => o.id === orderId)
    if (!order) {
      throw new Error("Order not found")
    }
    return order
  } catch (error) {
    console.error("Error getting order:", error)
    throw error
  }
}

export async function updateOrderStatus(userId: string, orderId: string, status: string) {
  try {
    // Try to update in Supabase
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status, updatedAt: new Date().toISOString() })
        .eq("id", orderId)
        .eq("userId", userId)

      if (error) throw error
    } catch (supabaseError) {
      console.warn("Error updating order in Supabase, using localStorage fallback:", supabaseError)

      // Fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || "[]")
      const updatedOrders = localOrders.map((o: any) => {
        if (o.id === orderId) {
          return { ...o, status, updatedAt: new Date().toISOString() }
        }
        return o
      })
      localStorage.setItem(`orders_${userId}`, JSON.stringify(updatedOrders))
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

export async function updatePaymentStatus(userId: string, orderId: string, paymentStatus: string) {
  try {
    // Try to update in Supabase
    try {
      const { error } = await supabase
        .from("orders")
        .update({ paymentStatus, updatedAt: new Date().toISOString() })
        .eq("id", orderId)
        .eq("userId", userId)

      if (error) throw error
    } catch (supabaseError) {
      console.warn("Error updating payment status in Supabase, using localStorage fallback:", supabaseError)

      // Fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || "[]")
      const updatedOrders = localOrders.map((o: any) => {
        if (o.id === orderId) {
          return { ...o, paymentStatus, updatedAt: new Date().toISOString() }
        }
        return o
      })
      localStorage.setItem(`orders_${userId}`, JSON.stringify(updatedOrders))
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating payment status:", error)
    throw error
  }
}
