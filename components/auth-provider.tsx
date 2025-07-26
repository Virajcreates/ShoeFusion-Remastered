"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: any }>
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
})

// Export the useAuth hook
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  // Ensure user exists in the users table
  const ensureUserInDatabase = async (user: User) => {
    if (!supabase) return

    try {
      // Check if user exists in the users table by ID
      const { data: existingUserById, error: checkByIdError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      // If user exists by ID, we're done
      if (existingUserById) {
        console.log("User already exists in database by ID")
        return
      }

      // If there was an error other than "not found", log it
      if (checkByIdError && checkByIdError.code !== "PGRST116") {
        console.error("Error checking user by ID:", checkByIdError)
      }

      // Check if user exists by email
      if (user.email) {
        const { data: existingUserByEmail, error: checkByEmailError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single()

        // If user exists by email but with a different ID, we need to handle this conflict
        if (existingUserByEmail) {
          console.log("User already exists in database by email but with different ID")

          // Update the existing user record with the new ID
          const { error: updateError } = await supabase.from("users").update({ id: user.id }).eq("email", user.email)

          if (updateError) {
            console.error("Error updating user ID:", updateError)
          } else {
            console.log("Updated user ID successfully")
          }

          return
        }

        // If there was an error other than "not found", log it
        if (checkByEmailError && checkByEmailError.code !== "PGRST116") {
          console.error("Error checking user by email:", checkByEmailError)
        }
      }

      // If we get here, the user doesn't exist in the database, so create them
      console.log("Creating new user in database")
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email || "",
          display_name:
            user.user_metadata?.display_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
        },
      ])

      if (insertError) {
        console.error("Error creating user:", insertError)

        // If the error is a duplicate key error, try to update the user instead
        if (insertError.code === "23505") {
          // PostgreSQL unique violation code
          console.log("Duplicate key error, trying to update user instead")

          // Try to update the user by ID
          const { error: updateError } = await supabase
            .from("users")
            .update({
              email: user.email || "",
              display_name:
                user.user_metadata?.display_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
            })
            .eq("id", user.id)

          if (updateError) {
            console.error("Error updating user:", updateError)
          } else {
            console.log("Updated user successfully")
          }
        }
      } else {
        console.log("Created user successfully")
      }
    } catch (error) {
      console.error("Error ensuring user in database:", error)
    }
  }

  // Set up auth state listener
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    console.log("Setting up auth state listener")

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        ensureUserInDatabase(session.user)
      }

      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        ensureUserInDatabase(session.user)
      }

      setLoading(false)
    })

    // Clean up subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign out function
  const signOut = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      router.push("/login")
      console.log("User signed out successfully")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!supabase) return

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Error signing in with Google:", error)
      }
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase client not initialized" }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error signing in with email:", error)
        return { error }
      }

      if (data.user) {
        await ensureUserInDatabase(data.user)
      }

      return { error: null }
    } catch (error) {
      console.error("Error signing in with email:", error)
      return { error }
    }
  }

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!supabase) return { error: "Supabase client not initialized" }

    try {
      // First check if a user with this email already exists in the users table
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      if (existingUser) {
        return { error: { message: "A user with this email already exists" } }
      }

      // If there was an error other than "not found", log it
      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing user:", checkError)
      }

      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            name: name,
          },
        },
      })

      if (error) {
        console.error("Error signing up with email:", error)
        return { error }
      }

      if (data.user) {
        // Wait for the user to be created in Auth before creating in the database
        await new Promise((resolve) => setTimeout(resolve, 500))

        await ensureUserInDatabase(data.user)
      }

      return { error: null }
    } catch (error) {
      console.error("Error signing up with email:", error)
      return { error }
    }
  }

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
