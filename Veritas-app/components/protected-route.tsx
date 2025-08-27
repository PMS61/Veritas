"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ children, requireAdmin = false, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requireAdmin && user.role !== "admin") {
        router.push("/login")
        return
      }

      setIsChecking(false)
    }
  }, [user, isLoading, requireAdmin, router, redirectTo])

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Access</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking authentication...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || (requireAdmin && user.role !== "admin")) {
    return null
  }

  return <>{children}</>
}
