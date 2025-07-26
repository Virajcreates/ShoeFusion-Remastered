import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-client"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase admin client not available" }, { status: 500 })
    }

    // Execute SQL to fix RLS policies
    const { error } = await supabase.rpc("fix_rls_policies")

    if (error) {
      console.error("Error fixing RLS policies:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "RLS policies fixed successfully" })
  } catch (error: any) {
    console.error("Error in fix-rls route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
