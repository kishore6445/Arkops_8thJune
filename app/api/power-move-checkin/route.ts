import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { formatDateForDB } from "@/lib/power-move-streak"

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

type CheckinPayload = {
  powerMoveId: string
  checkInDate: string
  status: "completed" | "missed"
  notes?: string
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckinPayload

    if (!payload.powerMoveId || !payload.checkInDate) {
      return NextResponse.json(
        { error: "Missing powerMoveId or checkInDate" },
        { status: 400 },
      )
    }

    const supabase = getAdminClient()

    // In preview mode, return success mock response
    if (!supabase) {
      return NextResponse.json(
        {
          success: true,
          message: "Check-in recorded (preview mode)",
          tracking: {
            date: payload.checkInDate,
            completed: payload.status === "completed",
            status: payload.status,
          },
        },
        { status: 200 },
      )
    }

    // Upsert tracking record
    const { data, error } = await supabase
      .from("power_move_tracking")
      .upsert(
        {
          power_move_id: payload.powerMoveId,
          period_date: payload.checkInDate,
          is_completed: payload.status === "completed",
          notes: payload.notes || null,
        },
        {
          onConflict: "power_move_id,period_date",
        },
      )
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        tracking: data?.[0],
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
