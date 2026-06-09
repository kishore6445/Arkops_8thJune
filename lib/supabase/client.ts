import { createClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseClient: any = null

export function getSupabaseClient() {
  // If env vars are missing (preview mode), return null to handle in caller
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  // In client-side code we need the browser-friendly client so that
  // auth.getSession() reads cookies/local storage correctly. During
  // SSR or in API routes we fall back to the normal createClient.
  if (!supabaseClient) {
    supabaseClient =
      typeof window === "undefined"
        ? createClient(supabaseUrl, supabaseAnonKey)
        : createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

// Lazy export for backwards compatibility - only created when accessed
export const supabase = new Proxy({} as any, {
  get(_, prop) {
    const client = getSupabaseClient()
    if (!client) {
      console.warn("[v0] Supabase client not available in preview mode")
      return undefined
    }
    return (client as any)[prop]
  },
})
