import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { isPreviewMode, isPreviewModeToken, extractPreviewModeUserId, PREVIEW_MODE_USER_ID } from "@/lib/preview-mode"

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

// Mock user data for preview mode
function getPreviewModeUser() {
  return {
    id: PREVIEW_MODE_USER_ID,
    name: "Preview User",
    email: "kishore6445@gmail.com",
    avatar_url: undefined,
    role: "super_admin",
    company_id: null,
    assignments: [
      { brand: "warrior-systems", department: "leadership" },
      { brand: "story-marketing", department: "leadership" },
      { brand: "meta-gurukul", department: "accounts" },
    ],
    company_brand_slugs: [],
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    if (!token) {
      return NextResponse.json({ error: "Missing access token." }, { status: 401 })
    }

    // Check for preview mode token
    if (isPreviewMode() && isPreviewModeToken(token)) {
      const userId = extractPreviewModeUserId(token)
      if (userId === PREVIEW_MODE_USER_ID) {
        return NextResponse.json({ user: getPreviewModeUser() }, { status: 200 })
      }
      return NextResponse.json({ error: "Invalid preview token." }, { status: 401 })
    }

    // Real Supabase auth
    const supabase = getAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured." }, { status: 500 })
    }

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
