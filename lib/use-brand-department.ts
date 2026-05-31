import { useBrand } from "@/lib/brand-context"
import { getDepartmentData, type Department, type DepartmentData } from "@/lib/brand-structure"

export function useBrandDepartment(department: Department): DepartmentData | null {
  const { currentBrand } = useBrand()
  return getDepartmentData(currentBrand, department)
}
