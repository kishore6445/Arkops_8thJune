import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    if (!token) {
      return NextResponse.json({ error: "Missing access token." }, { status: 401 })
    }

    const supabase = getAdminClient()

    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 })
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ status: "active" })
      .eq("id", userData.user.id)
      .select("id, status")
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
