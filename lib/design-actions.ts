import type { ShoeDesign } from "./types"
import { getSupabaseClient } from "./supabase-client"

export async function saveDesign(userId: string, design: ShoeDesign) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { id, name = "Custom Design", sole, trim, head, laces, size = "8" } = design

    // Check if this is an update or a new design
    if (id) {
      // Update existing design
      const { error } = await supabase
        .from("designs")
        .update({
          name,
          sole_color: sole.color,
          sole_material: sole.material,
          trim_color: trim.color,
          trim_material: trim.material,
          head_color: head.color,
          head_material: head.material,
          laces_color: laces.color,
          laces_material: laces.material,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", authenticatedUserId)

      if (error) throw error
      return { id, success: true }
    } else {
      // Create new design
      const { data, error } = await supabase
        .from("designs")
        .insert([
          {
            user_id: authenticatedUserId,
            name,
            sole_color: sole.color,
            sole_material: sole.material,
            trim_color: trim.color,
            trim_material: trim.material,
            head_color: head.color,
            head_material: head.material,
            laces_color: laces.color,
            laces_material: laces.material,
          },
        ])
        .select()

      if (error || !data?.length) {
        throw new Error(error?.message || "Failed to save design")
      }

      return data[0]
    }
  } catch (error) {
    console.error("Error saving design:", error)
    throw error
  }
}

export async function getUserDesigns(userId: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .eq("user_id", authenticatedUserId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return (data || []).map((dbDesign) => ({
      id: dbDesign.id,
      name: dbDesign.name,
      createdAt: dbDesign.created_at,
      design: {
        name: dbDesign.name,
        size: dbDesign.size || "8",
        sole: {
          color: dbDesign.sole_color,
          material: dbDesign.sole_material,
        },
        trim: {
          color: dbDesign.trim_color,
          material: dbDesign.trim_material,
        },
        head: {
          color: dbDesign.head_color,
          material: dbDesign.head_material,
        },
        laces: {
          color: dbDesign.laces_color,
          material: dbDesign.laces_material,
        },
      },
    }))
  } catch (error) {
    console.error("Error getting designs:", error)
    return []
  }
}

export async function getDesignById(designId: string, userId: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .eq("id", designId)
      .eq("user_id", authenticatedUserId)
      .single()

    if (error || !data) throw new Error("Design not found")

    // Return the design in the expected format
    return {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      size: data.size || "8",
      sole: {
        color: data.sole_color,
        material: data.sole_material,
      },
      trim: {
        color: data.trim_color,
        material: data.trim_material,
      },
      head: {
        color: data.head_color,
        material: data.head_material,
      },
      laces: {
        color: data.laces_color,
        material: data.laces_material,
      },
    }
  } catch (error) {
    console.error("Error getting design by ID:", error)
    return null
  }
}

export async function deleteDesign(designId: string, userId: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase client not initialized")

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not authenticated")

    // Use the authenticated user's ID instead of the passed userId
    const authenticatedUserId = session.user.id

    const { error } = await supabase.from("designs").delete().eq("id", designId).eq("user_id", authenticatedUserId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting design:", error)
    return {
      success: false,
      error: error?.message || "Failed to delete design",
    }
  }
}
