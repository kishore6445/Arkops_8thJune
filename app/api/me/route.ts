import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role credentials")
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function normalizeJoined<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] : value
}

async function getCompanyBrandSlugs(supabase: ReturnType<typeof getAdminClient>, companyId: string) {
  const { data: slugRows, error: slugError } = await supabase
    .from("company_brands")
    .select("brand_slug")
    .eq("company_id", companyId)

  if (slugError) {
    throw slugError
  }

  return (slugRows || [])
    .map((row) => row.brand_slug)
    .filter((slug): slug is string => Boolean(slug))
}

// TEMPORARY v0 PREVIEW BYPASS - remove before production if not needed
function getPreviewUser() {
  return {
    id: "preview-user-1",
    name: "Preview User",
    email: "preview@example.com",
    avatar: undefined,
    role: "super_admin",
    company_id: null,
    assignments: [
      { brand: "warrior-systems", department: "leadership" },
      { brand: "story-marketing", department: "leadership" },
      { brand: "meta-gurukul", department: "leadership" },
    ],
    company_brand_slugs: [],
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    // TEMPORARY v0 PREVIEW BYPASS - remove before production if not needed
    const previewSession = request.cookies.get("preview-session")
    if (previewSession && !token) {
      console.log("[api/me] Using preview session bypass")
      return NextResponse.json(
        { user: getPreviewUser() },
        { status: 200 }
      )
    }

    if (!token) {
      return NextResponse.json({ error: "Missing access token." }, { status: 401 })
    }

    const supabase = getAdminClient()

    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 })
    }

    const userId = userData.user.id

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, name, email, role, avatar_url, company_id")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: profileError?.message || "Profile not found." }, { status: 404 })
    }

    const { data: brandAccess, error: brandError } = await supabase
      .from("user_brand_access")
      .select("company_brands(brand_slug)")
      .eq("user_id", userId)

    if (brandError) {
      return NextResponse.json({ error: brandError.message }, { status: 400 })
    }

    const { data: departmentAccess, error: departmentError } = await supabase
      .from("user_department_access")
      .select("departments(slug)")
      .eq("user_id", userId)

    if (departmentError) {
      return NextResponse.json({ error: departmentError.message }, { status: 400 })
    }

    const brands = (brandAccess || [])
      .map((row) => normalizeJoined(row.company_brands)?.brand_slug)
      .filter(Boolean)

    const departments = (departmentAccess || [])
      .map((row) => normalizeJoined(row.departments)?.slug)
      .filter(Boolean)

    let assignments: { brand: string | null; department: string }[] = []

    if ((!brands || brands.length === 0) && departments.length > 0) {
      // No brand assignments exist (DB cleared). Keep department visibility by
      // returning assignments with an empty brand so UI can still show departments.
      assignments = departments.map((department) => ({ brand: "", department }))
    } else if (brands.length > 0 && departments.length > 0) {
      assignments = brands.flatMap((brand) => departments.map((department) => ({ brand, department })))
    } else {
      assignments = []
    }

    const companyBrandSlugs =
      profile.role === "company_admin" && profile.company_id
        ? await getCompanyBrandSlugs(supabase, profile.company_id)
        : []

    console.log("[api/me] profile role=", profile.role)

    return NextResponse.json(
      {
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar_url || undefined,
          role: profile.role,
          company_id: profile.company_id || null,
          assignments,
          company_brand_slugs: companyBrandSlugs,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
