"use client"

import React from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"

export default function DemoPage() {
  const { user, login, logout } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("/api/mock")
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Interactive Demo</h1>

      <section className="mb-6">
        <h2 className="font-medium">Auth</h2>
        <p className="text-sm text-muted-foreground mb-2">Current user: {user ? user.email + ` (${user.role})` : "guest"}</p>
        <div className="flex gap-2">

          <button className="btn" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-medium">Mock API</h2>
        {loading ? (
          <p>Loading mock data…</p>
        ) : data ? (
          <div className="space-y-2">
            <p>Alerts: {data.alerts.length}</p>
            <p>Sources: {data.sources.length}</p>
            <p>Trends: {data.trends.length}</p>
            <Link href="/dashboard">Go to dashboard</Link>
          </div>
        ) : (
          <p className="text-muted-foreground">Failed to load mock data.</p>
        )}
      </section>

      <section>
        <h2 className="font-medium">Quick tour</h2>
        <ol className="list-decimal list-inside">
          <li>Open Dashboard & explore alerts and sources.</li>
        </ol>
      </section>
    </div>
  )
}
