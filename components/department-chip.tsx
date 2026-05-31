import { cn } from "@/lib/utils"

type DepartmentCode = "M" | "A" | "S" | "T" | "E" | "R" | "Y"

interface DepartmentChipProps {
  code: DepartmentCode
  permission?: "admin" | "member" | "view"
  size?: "sm" | "md"
}

const DEPARTMENT_COLORS = {
  M: "bg-blue-600 text-white",
  A: "bg-green-600 text-white",
  S: "bg-purple-600 text-white",
  T: "bg-orange-600 text-white",
  E: "bg-red-600 text-white",
  R: "bg-teal-600 text-white",
  Y: "bg-indigo-600 text-white",
}

export function DepartmentChip({ code, permission, size = "sm" }: DepartmentChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded",
        DEPARTMENT_COLORS[code],
        size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm",
      )}
      title={permission ? `${code} - ${permission.charAt(0).toUpperCase() + permission.slice(1)}` : code}
    >
      {code}
    </div>
  )
}
