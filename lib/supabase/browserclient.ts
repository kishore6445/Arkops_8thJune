"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  // If env vars are missing, return null (for v0 preview mode)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  // Create client only once (lazy initialization)
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }

  return supabaseClient
}

// For backward compatibility, export a getter property
export const supabase = new Proxy(
  {},
  {
    get: (_, prop) => {
      const client = getSupabaseClient()
      if (!client) {
        // Return a dummy object that doesn't crash when methods are called
        return new Proxy(
          {},
          {
            get: () => async () => ({
              data: null,
              error: new Error("Supabase not configured in preview mode"),
            }),
          }
        )
      }
      return (client as any)[prop]
    },
  }
) as any
