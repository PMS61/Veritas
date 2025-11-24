"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { UserProfile } from "@/components/user-profile"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <UserProfile />
    </DashboardLayout>
  )
}