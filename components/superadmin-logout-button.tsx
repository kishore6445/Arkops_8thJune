"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/browserclient"

export function SuperAdminLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    await fetch("/api/auth/logout", {
      method: "POST",
    })
    router.replace("/signin")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2" disabled={isLoggingOut}>
      <LogOut className="h-4 w-4" />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  )
}
