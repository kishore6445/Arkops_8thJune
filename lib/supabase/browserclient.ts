"use client"

import { createBrowserClient } from "@supabase/ssr"
import { getPreviewSession } from "@/lib/preview-auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isPreviewModeEnabled = !supabaseUrl || !supabaseAnonKey

let supabaseClient: any = null
let mockSupabaseClient: any = null

function createMockClient() {
  const authMock = {
    getSession: async () => {
      const session = getPreviewSession()
      return {
        data: { session: session || null },
        error: null,
      }
    },
    setSession: async (sessionObj: any) => {
      console.log("[preview-auth] setSession called")
      return { data: sessionObj, error: null }
    },
    signOut: async () => {
      console.log("[preview-auth] signOut called")
      return { error: null }
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
    getUser: async () => {
      return { data: { user: { id: "preview-user" } }, error: null }
    },
  }

  return { auth: authMock }
}

function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function getSupabaseBrowserClient() {
  if (isPreviewModeEnabled) {
    if (!mockSupabaseClient) {
      mockSupabaseClient = createMockClient()
    }
    return mockSupabaseClient
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

// Initialize immediately and export as a static object
const initializeSupabase = () => {
  if (isPreviewModeEnabled) {
    return createMockClient()
  }
  const client = createClient()
  return client || {}
}

export const supabase = initializeSupabase()
