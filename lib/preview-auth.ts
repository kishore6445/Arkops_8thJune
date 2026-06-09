/**
 * Preview auth mode for v0 sandbox when Supabase env vars are missing.
 * Allows testing with kishore6445@gmail.com without real Supabase credentials.
 */

export interface PreviewSession {
  access_token: string
  user: {
    id: string
    email: string
    name: string
    role: "super_admin"
  }
}

export const PREVIEW_USER_ID = "preview-kishore-uid"
export const PREVIEW_EMAIL = "kishore6445@gmail.com"
export const PREVIEW_NAME = "Kishore"
const PREVIEW_MODE_KEY = "v0-preview-session"

/**
 * Check if we're in preview mode (missing Supabase env vars)
 * This checks both server-side (process.env) and client-side (window/localStorage)
 */
export function isPreviewMode(): boolean {
  // Server-side check
  if (typeof window === "undefined") {
    return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }

  // Client-side: Check if env vars are missing (indicates preview mode)
  // We check by trying to see if these would be undefined at import time
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !url || !key
}

/**
 * Get or create preview session in localStorage
 */
export function getPreviewSession(): PreviewSession | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(PREVIEW_MODE_KEY)
    if (stored) {
      return JSON.parse(stored) as PreviewSession
    }
  } catch {
    // If parsing fails, clear it
    localStorage.removeItem(PREVIEW_MODE_KEY)
  }
  return null
}

/**
 * Create and store preview session
 */
export function createPreviewSession(): PreviewSession {
  const session: PreviewSession = {
    access_token: `preview-token-${Date.now()}`,
    user: {
      id: PREVIEW_USER_ID,
      email: PREVIEW_EMAIL,
      name: PREVIEW_NAME,
      role: "super_admin",
    },
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(PREVIEW_MODE_KEY, JSON.stringify(session))
  }

  return session
}

/**
 * Clear preview session
 */
export function clearPreviewSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PREVIEW_MODE_KEY)
  }
}

/**
 * Get preview user
 */
export function getPreviewUser() {
  const session = getPreviewSession()
  return session?.user || null
}
