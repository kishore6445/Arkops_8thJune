/**
 * Preview Mode Helper
 * Handles mock authentication when Supabase env variables are missing.
 * This allows testing the dashboard in v0 preview without a real database.
 */

export const PREVIEW_MODE_USER_ID = "67aad487-0f67-49c0-a17f-33c222ee5186"
export const PREVIEW_MODE_EMAIL = "kishore6445@gmail.com"
export const PREVIEW_MODE_TOKEN_PREFIX = "preview_"

export interface PreviewModeSession {
  access_token: string
  user: {
    id: string
    email: string
    user_metadata: {
      name: string
      avatar_url?: string
    }
  }
}

export function isPreviewMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export function createPreviewModeSession(email: string): PreviewModeSession | null {
  // Only allow the preview mode email in preview mode
  if (email !== PREVIEW_MODE_EMAIL) {
    return null
  }

  return {
    access_token: `${PREVIEW_MODE_TOKEN_PREFIX}${PREVIEW_MODE_USER_ID}`,
    user: {
      id: PREVIEW_MODE_USER_ID,
      email: PREVIEW_MODE_EMAIL,
      user_metadata: {
        name: "Preview User",
        avatar_url: undefined,
      },
    },
  }
}

export function isPreviewModeToken(token: string): boolean {
  return token.startsWith(PREVIEW_MODE_TOKEN_PREFIX)
}

export function extractPreviewModeUserId(token: string): string | null {
  if (!isPreviewModeToken(token)) {
    return null
  }
  return token.slice(PREVIEW_MODE_TOKEN_PREFIX.length)
}
