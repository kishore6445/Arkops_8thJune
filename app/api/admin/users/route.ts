import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { resolveInviteRedirectBase, buildInviteRedirectTo } from "@/lib/invite-redirect"

type DepartmentAccess = {
  code: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
  permission: "admin" | "member" | "view"
}

type CreateUserPayload = {
  name: string
  email: string
  role: "super_admin" | "company_admin" | "member" | "viewer"
  status: "active" | "invited" | "disabled"
  company_id?: string | null
  departments?: DepartmentAccess[]
}

type AccessRow = {
  user_id: string
  department_id: string
  permission: DepartmentAccess["permission"]
}

const DEPARTMENT_SEED: Record<DepartmentAccess["code"], { slug: string; name: string; is_restricted: boolean }> = {
  M: { slug: "marketing", name: "Marketing", is_restricted: false },
  A: { slug: "accounts", name: "Accounts/Finance", is_restricted: true },
  S: { slug: "sales", name: "Sales", is_restricted: false },
  T: { slug: "team-tools", name: "Team Tools & SOPs", is_restricted: false },
  E: { slug: "execution", name: "Execution/Ops", is_restricted: false },
  R: { slug: "rd", name: "R&D/Risk", is_restricted: false },
  Y: { slug: "leadership", name: "Leadership", is_restricted: true },
}

// Preview mode sample users
const PREVIEW_USERS = [
  {
    id: "preview-user-1",
    name: "Kishore",
    email: "kishore6445@gmail.com",
    role: "super_admin",
    status: "active",
    company_id: null,
    departments: [
      { code: "M" as const, permission: "admin" as const },
      { code: "A" as const, permission: "admin" as const },
      { code: "S" as const, permission: "admin" as const },
      { code: "T" as const, permission: "admin" as const },
      { code: "E" as const, permission: "admin" as const },
      { code: "R" as const, permission: "admin" as const },
      { code: "Y" as const, permission: "admin" as const },
    ],
    lastUpdated: new Date().toISOString().split("T")[0],
  },
  {
    id: "preview-user-2",
    name: "Sarah Martinez",
    email: "sarah@arkmedis.com",
    role: "member",
    status: "active",
    company_id: null,
    departments: [{ code: "M" as const, permission: "member" as const }],
    lastUpdated: new Date().toISOString().split("T")[0],
  },
  {
    id: "preview-user-3",
    name: "John Davidson",
    email: "john@arkmedis.com",
    role: "member",
    status: "active",
    company_id: null,
    departments: [{ code: "M" as const, permission: "member" as const }],
    lastUpdated: new Date().toISOString().split("T")[0],
  },
  {
    id: "preview-user-4",
    name: "Michael Chen",
    email: "michael@arkmedis.com",
    role: "member",
    status: "active",
    company_id: null,
    departments: [
      { code: "A" as const, permission: "member" as const },
    ],
    lastUpdated: new Date().toISOString().split("T")[0],
  },
]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateUserPayload

    if (!payload?.email || !payload?.name) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 })
    }

    const requiresCompany = (payload.role || "member") !== "super_admin"
    if (requiresCompany && !payload.company_id) {
      return NextResponse.json({ error: "company_id is required for non-super-admin users." }, { status: 400 })
    }

    const supabase = getAdminClient()
    
    // In preview mode, supabase will be null - return error
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured in preview mode." }, { status: 400 })
    }

    const requestOrigin = request.headers.get("origin")
    const forwardedHost = request.headers.get("x-forwarded-host")
    const host = forwardedHost || request.headers.get("host")
    const forwardedProto = request.headers.get("x-forwarded-proto") || request.headers.get("x-forwarded-protocol")
    const redirectBase = resolveInviteRedirectBase(siteUrl, requestOrigin, host, forwardedProto)
    const redirectTo = buildInviteRedirectTo(redirectBase)

    const inviteOptions: { data: { name: string }; redirectTo?: string } = {
      data: { name: payload.name },
      redirectTo,
    }

    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(payload.email, inviteOptions)

    if (inviteError || !inviteData?.user) {
      return NextResponse.json({ error: inviteError?.message || "Unable to create auth user." }, { status: 400 })
    }

    const authUserId = inviteData.user.id

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authUserId,
        name: payload.name,
        email: payload.email,
        role: payload.role || "member",
        status: payload.status || "invited",
        company_id: payload.company_id ?? null,
      })
      .select("id, name, email, role, status, company_id")
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    let departmentAccess: DepartmentAccess[] = []

    if (payload.departments && payload.departments.length > 0) {
      const deptCodes = payload.departments.map((d) => d.code)
      const { data: departments, error: deptError } = await supabase
        .from("departments")
        .select("id, code")
        .in("code", deptCodes)

      if (deptError) {
        return NextResponse.json({ error: deptError.message }, { status: 400 })
      }

      const deptMap = new Map((departments || []).map((dept) => [dept.code, dept.id]))
      const missingCodes = deptCodes.filter((code) => !deptMap.has(code))

      if (missingCodes.length > 0) {
        const seedRows = missingCodes.map((code) => ({
          slug: DEPARTMENT_SEED[code].slug,
          code,
          name: DEPARTMENT_SEED[code].name,
          is_restricted: DEPARTMENT_SEED[code].is_restricted,
        }))

        const { error: seedError } = await supabase.from("departments").insert(seedRows)
        if (seedError) {
          return NextResponse.json({ error: seedError.message }, { status: 400 })
        }

        const { data: seededDepartments, error: seededError } = await supabase
          .from("departments")
          .select("id, code")
          .in("code", deptCodes)

        if (seededError) {
          return NextResponse.json({ error: seededError.message }, { status: 400 })
        }

        seededDepartments?.forEach((dept) => deptMap.set(dept.code, dept.id))
      }

      const accessRows = payload.departments
        .map((dept) => {
          const departmentId = deptMap.get(dept.code)
          if (!departmentId) return null
          return {
            user_id: authUserId,
            department_id: departmentId,
            permission: dept.permission,
          }
        })
        .filter(Boolean)

      if (accessRows.length > 0) {
        const { error: accessError } = await supabase.from("user_department_access").insert(accessRows)
        if (accessError) {
          return NextResponse.json({ error: accessError.message }, { status: 400 })
        }
      }

      departmentAccess = payload.departments
    }

    return NextResponse.json({ user: profile, departments: departmentAccess }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getAdminClient()

    // In preview mode, return mock users
    if (!supabase) {
      return NextResponse.json({ users: PREVIEW_USERS }, { status: 200 })
    }

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email, role, status, company_id, updated_at, created_at")
      .order("created_at", { ascending: false })

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 400 })
    }

    const { data: accessRows, error: accessError } = await supabase
      .from("user_department_access")
      .select("user_id, department_id, permission")

    if (accessError) {
      return NextResponse.json({ error: accessError.message }, { status: 400 })
    }

    const departmentIds = Array.from(new Set((accessRows || []).map((row) => row.department_id)))
    const departmentMap = new Map<string, DepartmentAccess["code"]>()

    if (departmentIds.length > 0) {
      const { data: departments, error: departmentsError } = await supabase
        .from("departments")
        .select("id, code")
        .in("id", departmentIds)

      if (departmentsError) {
        return NextResponse.json({ error: departmentsError.message }, { status: 400 })
      }

      ;(departments || []).forEach((dept) => {
        departmentMap.set(dept.id, dept.code)
      })
    }

    const accessMap = new Map<string, DepartmentAccess[]>()
    ;((accessRows || []) as AccessRow[]).forEach((row) => {
      const deptCode = departmentMap.get(row.department_id)
      if (!deptCode) return
      const entry = accessMap.get(row.user_id) || []
      entry.push({ code: deptCode, permission: row.permission })
      accessMap.set(row.user_id, entry)
    })

    const hydratedUsers = (users || []).map((user) => {
      const lastUpdated = user.updated_at || user.created_at
      const formattedDate = lastUpdated ? new Date(lastUpdated).toISOString().split("T")[0] : ""
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        company_id: user.company_id,
        departments: accessMap.get(user.id) || [],
        lastUpdated: formattedDate,
      }
    })

    return NextResponse.json({ users: hydratedUsers }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
