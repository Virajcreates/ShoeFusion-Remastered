import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire app
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient && typeof window !== "undefined") {
    // Only create the client in the browser
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return null
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return supabaseClient
}

// Create a server-side supabase client (for server components and API routes)
export function getSupabaseAdmin() {
  // For client-side, use the regular client with the user's session
  if (typeof window !== "undefined") {
    return getSupabaseClient()
  }

  // For server-side, try to use the service role key if available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    console.error("Missing Supabase URL environment variable")
    return null
  }

  // If service role key is not available, use the anon key as fallback
  const key = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!key) {
    console.error("Missing Supabase key environment variables")
    return null
  }

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
