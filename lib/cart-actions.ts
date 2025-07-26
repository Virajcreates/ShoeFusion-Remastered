import type { ShoeDesign } from "./types"
import { getSupabaseClient } from "./supabase-client"

export async function addToCart(userId: string, design: ShoeDesign) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    // First check if the item is already in the cart
    const { data: existingItems } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", authenticatedUserId)
      .eq("design_id", design.id)
      .eq("size", design.size || "8")

    if (existingItems && existingItems.length > 0) {
      // Update quantity if the item is already in the cart
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItems[0].quantity + 1,
        })
        .eq("id", existingItems[0].id)
        .eq("user_id", authenticatedUserId)

      if (error) throw error
      return { success: true }
    } else {
      // Add new item to cart
      // Note: cart_items table has a 'design' JSON column, unlike the designs table
      const { error } = await supabase.from("cart_items").insert([
        {
          user_id: authenticatedUserId,
          design_id: design.id,
          name: design.name || "Custom Shoe",
          price: 99.99, // Example price
          quantity: 1,
          size: design.size || "8",
          design: {
            sole: {
              color: design.sole.color,
              material: design.sole.material,
            },
            trim: {
              color: design.trim.color,
              material: design.trim.material,
            },
            head: {
              color: design.head.color,
              material: design.head.material,
            },
            laces: {
              color: design.laces.color,
              material: design.laces.material,
            },
          },
        },
      ])

      if (error) throw error
      return { success: true }
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export async function getCartItems(userId: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", authenticatedUserId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error getting cart items:", error)
    // Return empty array instead of throwing to prevent UI errors
    return []
  }
}

export async function removeFromCart(userId: string, itemId: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { error } = await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", authenticatedUserId)

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error removing from cart:", error)
    return { success: false, error: error.message || "Failed to remove item from cart" }
  }
}

export async function updateCartItemQuantity(userId: string, itemId: string, quantity: number) {
  if (quantity < 1) {
    return removeFromCart(userId, itemId)
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .eq("user_id", authenticatedUserId)
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error("Item not found in cart")
    }

    return { success: true, item: data[0] }
  } catch (error: any) {
    console.error("Error updating cart item quantity:", error)
    return { success: false, error: error.message || "Failed to update item quantity" }
  }
}

export async function clearCart(userId: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { error } = await supabase.from("cart_items").delete().eq("user_id", authenticatedUserId)

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error clearing cart:", error)
    return { success: false, error: error.message || "Failed to clear cart" }
  }
}

export async function createOrder(
  userId: string,
  items: Array<{ design: ShoeDesign; quantity: number; price: number }>,
  shippingAddress: any,
  paymentMethod = "card",
) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(total * 0.18) // 18% GST

  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    // Create the order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: authenticatedUserId,
          total,
          tax,
          shipping: 0, // Free shipping
          status: "pending",
          payment_method: paymentMethod,
          shipping_address: shippingAddress,
        },
      ])
      .select()

    if (orderError) {
      console.error("Supabase order error:", orderError)
      throw orderError
    }

    if (!orderData || orderData.length === 0) {
      throw new Error("Failed to create order")
    }

    const orderId = orderData[0].id

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: orderId,
      name: item.design.name || "Custom Shoe",
      price: item.price,
      quantity: item.quantity,
      size: item.design.size || "8",
      design: item.design,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Supabase order items error:", itemsError)
      throw itemsError
    }

    // Clear the cart
    await clearCart(authenticatedUserId)

    return orderData[0]
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrders(userId: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", authenticatedUserId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error getting orders:", error)
    // Return empty array instead of throwing to prevent UI errors
    return []
  }
}

export async function getOrderById(orderId: string, userId: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", authenticatedUserId)
      .single()

    if (orderError) {
      console.error("Supabase order error:", orderError)
      throw orderError
    }

    if (!order) {
      throw new Error("Order not found")
    }

    // Get the order items
    const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", orderId)

    if (itemsError) {
      console.error("Supabase order items error:", itemsError)
      throw itemsError
    }

    return {
      ...order,
      items: items || [],
    }
  } catch (error) {
    console.error("Error getting order by ID:", error)
    return null
  }
}

export async function updateOrderStatus(orderId: string, userId: string, status: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const updateData: any = {
      status,
    }

    // If status is paid, update paid_at
    if (status === "paid") {
      updateData.paid_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .eq("user_id", authenticatedUserId)
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error("Order not found or update failed")
    }

    return data[0]
  } catch (error) {
    console.error("Error updating order status:", error)
    return null
  }
}
