"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AlertsManagement } from "@/components/alerts-management"

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <AlertsManagement />
    </DashboardLayout>
  )
}