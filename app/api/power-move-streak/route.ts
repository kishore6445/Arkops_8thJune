import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { formatDateForDB, getWeekStart } from "@/lib/power-move-streak"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const powerMoveId = searchParams.get("powerMoveId")
    const startDate = searchParams.get("startDate")
    const days = parseInt(searchParams.get("days") || "90")

    if (!powerMoveId) {
      return NextResponse.json({ error: "Missing powerMoveId parameter" }, { status: 400 })
    }

    const supabase = getAdminClient()

    // In preview mode, return mock streak data
    if (!supabase) {
      const mockTracking = []
      const today = new Date()
      for (let i = 0; i < days; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = formatDateForDB(date)
        const dayOfWeek = date.getDay()
        // Simulate Mon-Fri completions with some variation
        const completed = dayOfWeek !== 0 && dayOfWeek !== 6 && Math.random() > 0.3
        mockTracking.push({
          date: dateStr,
          completed,
          status: completed ? "completed" : "missed",
        })
      }
      return NextResponse.json({ tracking: mockTracking.reverse() }, { status: 200 })
    }

    const query = supabase
      .from("power_move_tracking")
      .select("period_date, is_completed, notes")
      .eq("power_move_id", powerMoveId)
      .order("period_date", { ascending: false })
      .limit(days)

    if (startDate) {
      query.gte("period_date", startDate)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const tracking = (data || []).map((row: any) => ({
      date: row.period_date,
      completed: row.is_completed,
      status: row.is_completed ? "completed" : "missed",
      notes: row.notes,
    }))

    return NextResponse.json({ tracking }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
