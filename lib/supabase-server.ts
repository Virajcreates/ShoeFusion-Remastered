import { createClient as createSupabase } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { cookies } from "next/headers"

export function createClient(cookieStore?: ReturnType<typeof cookies>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    return null
  }

  return createSupabase<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      ...(cookieStore && {
        flowType: "pkce",
        async storage(this: any) {
          return {
            get: async (key: string) => {
              try {
                const value = cookieStore.get(key)?.value
                if (value === undefined) {
                  return null
                }
                return JSON.parse(value)
              } catch (e) {
                return value
              }
            },
            set: async (key: string, value: any) => {
              try {
                cookieStore.set({
                  name: key,
                  value: JSON.stringify(value),
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                })
              } catch (e) {
                console.warn("Failed to set cookie", e)
              }
            },
            remove: async (key: string) => {
              try {
                cookieStore.set({ name: key, value: "", expires: new Date(0) })
              } catch (e) {
                console.warn("Failed to remove cookie", e)
              }
            },
          }
        },
      }),
    },
  })
}
