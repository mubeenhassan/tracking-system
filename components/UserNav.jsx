"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { logout } from "@/app/action/auth"

export function UserNav({ user }) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    window.location.replace("/")
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-white">{user.email}</span>
      <Button onClick={handleLogout} variant="outline" className="">
        Logout
      </Button>
    </div>
  )
}

