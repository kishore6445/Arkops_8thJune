"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * A minimal stub used when Supabase env vars are not configured.
 * It prevents the app from crashing at module load and provides
 * no-op implementations of the auth methods used in the app.
 */
function createStubClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. " +
        "Supabase features are disabled.",
    )
  }

  const auth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: { message: "Supabase is not configured." },
    }),
    signOut: async () => ({ error: null }),
  }

  // Cast through unknown since this only implements the subset used in the app.
  return { auth } as unknown as SupabaseClient
}

function createConfiguredClient(): SupabaseClient {
  try {
    return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
  } catch (err) {
    console.error(
      "[supabase] Failed to initialize browser client; falling back to stub.",
      err,
    )
    return createStubClient()
  }
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createConfiguredClient()
  : createStubClient()
