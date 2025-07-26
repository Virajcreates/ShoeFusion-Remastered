import { getSupabaseClient } from "./supabase-client"
import { AuthError } from "@supabase/supabase-js"

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not initialized")

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data.user
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in")
  }
}

export async function createAccount(email: string, password: string, name: string) {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not initialized")

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    })

    if (authError) throw authError

    // If user was created successfully, add to users table
    if (authData.user) {
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: email,
          display_name: name,
        },
      ])

      if (profileError) {
        console.error("Error creating user profile:", profileError)
      }
    }

    return authData.user
  } catch (error: any) {
    if (error instanceof AuthError) {
      throw new Error(error.message)
    }
    throw new Error("Failed to create account")
  }
}

export async function signInWithGoogle() {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not initialized")

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in with Google")
  }
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not initialized")

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
    return true
  } catch (error: any) {
    throw new Error(error.message || "Failed to send password reset email")
  }
}

export async function updateUserProfile(userId: string, data: { display_name?: string }) {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not initialized")

  try {
    // Update auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        display_name: data.display_name,
      },
    })

    if (authError) throw authError

    // Update profile in users table
    if (data.display_name) {
      const { error: profileError } = await supabase
        .from("users")
        .update({ display_name: data.display_name })
        .eq("id", userId)

      if (profileError) throw profileError
    }

    return true
  } catch (error: any) {
    throw new Error(error.message || "Failed to update profile")
  }
}
