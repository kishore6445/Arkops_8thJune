import { cookies } from "next/headers"

/**
 * TEMPORARY v0 PREVIEW BYPASS - remove before production if not needed
 * 
 * This route provides a temporary session bypass for v0 preview testing
 * when Supabase env vars are not available. It should not be used
 * in production. Real authentication via Supabase works normally
 * when env vars are configured.
 */
export async function POST() {
  try {
    const cookieStore = await cookies()

    // Set a simple preview session cookie
    // This is a temporary bypass for v0 preview only
    cookieStore.set("preview-session", "active", {
      maxAge: 3600, // 1 hour
      httpOnly: true,
      sameSite: "lax",
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("[preview-bypass] Error:", error)
    return Response.json(
      { error: "Failed to establish preview session" },
      { status: 500 }
    )
  }
}
