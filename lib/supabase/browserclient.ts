"use client"

import { createBrowserClient } from "@supabase/ssr"
import { getPreviewSession } from "@/lib/preview-auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("[browserclient] supabaseUrl:", supabaseUrl ? "set" : "undefined", "supabaseAnonKey:", supabaseAnonKey ? "set" : "undefined")

let supabaseClient: any = null

function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function getSupabaseBrowserClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

// Check if we're in preview mode (missing env vars)
const isPreviewModeEnabled = !supabaseUrl || !supabaseAnonKey

console.log("[browserclient] isPreviewModeEnabled:", isPreviewModeEnabled)

// Mock Supabase client for preview mode
function createMockSupabaseClient() {
  console.log("[browserclient] Creating mock Supabase client")
  const authMock = {
    getSession: async () => {
      const session = getPreviewSession()
      if (session) {
        return {
          data: { session },
          error: null,
        }
      }
      return { data: { session: null }, error: null }
    },
    setSession: async (sessionObj: any) => {
      // Mock setting session - just return success
      console.log("[preview-auth] setSession called with:", sessionObj)
      return { data: sessionObj, error: null }
    },
    onAuthStateChange: (callback: any) => {
      return {
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        },
      }
    },
  }

  return {
    auth: authMock,
  }
}

// Export real client if env vars exist, otherwise mock client for preview mode
const supabaseInstance = isPreviewModeEnabled ? createMockSupabaseClient() : (getSupabaseBrowserClient() || {})
console.log("[browserclient] supabaseInstance:", supabaseInstance)

export const supabase = supabaseInstance
