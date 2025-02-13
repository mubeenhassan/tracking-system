"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkSession } from "@/app/action/auth"

export function SessionProvider({ children }) {
  const router = useRouter()

  useEffect(() => {
    const checkSessionStatus = async () => {
      const user = await checkSession()
      if (!user) {
        router.push("/login")
      }
    }

    const interval = setInterval(checkSessionStatus, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [router])

  return <>{children}</>
}

