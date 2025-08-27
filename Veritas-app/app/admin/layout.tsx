import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
