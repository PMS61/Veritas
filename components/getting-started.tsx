"use client"

import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ShieldCheck, Play, Info } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

export function GettingStarted() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const timerRef = useRef<number | null>(null)

  const steps = [
    {
      title: "Create / Sign in",
      desc: "Register a free account or sign in to access personalized features.",
      action: { href: "/register", label: "Create account" },
      highlight: { top: 220, left: 120, width: 520, height: 220 },
      prefill: { firstName: "Demo", lastName: "User", email: "demo@veritas.test" },
    },
    {
      title: "Try a verification",
      desc: "Paste a claim or use search to request a verification — view sources and explanations.",
      action: { href: "/verify", label: "Try verification" },
      highlight: { top: 620, left: 120, width: 520, height: 220 },
    },
    {
      title: "Subscribe & monitor",
      desc: "Save topics or create alerts to receive updates when relevant claims appear.",
      action: { href: "/dashboard", label: "Open dashboard" },
      highlight: { top: 760, left: 120, width: 520, height: 180 },
    },
  ]

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const startDemo = (opts?: { startAt?: number; autoplay?: boolean }) => {
    setOpen(true)
    setStep(opts?.startAt ?? 0)
    setAutoPlay(!!opts?.autoplay)
  }

  useEffect(() => {
    if (!open) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    if (autoPlay) {
      timerRef.current = window.setInterval(() => {
        setStep((s) => {
          if (s < steps.length - 1) return s + 1
          handleAction(steps[s])
          setAutoPlay(false)
          return s
        })
      }, 2200)
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [open, autoPlay])

  const handleAction = (s: typeof steps[number]) => {
    try {
      if (s.prefill) {
        localStorage.setItem("demo-prefill", JSON.stringify(s.prefill))
      }
      if ((s as any).enableDevAuth) {
        localStorage.setItem("veritas-dev-auth", "1")
      }
    } catch (e) {
      // ignore
    }

    router.push(s.action.href)
    setTimeout(() => setOpen(false), 300)
  }

  const highlight = steps[step]?.highlight
  const highlightStyle = highlight
    ? {
        top: `${highlight.top}px`,
        left: `${highlight.left}px`,
        width: `${highlight.width}px`,
        height: `${highlight.height}px`,
      }
    : undefined

  return (
    <section className="py-8 xs:py-10 md:py-14">
      <div className="mobile-container">
        <div className="text-center mb-6">
          <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold">Getting started</h2>
          <p className="text-sm xs:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Quick guides to help both general users and administrators get up and running with Veritas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 hover:shadow-lg transition-shadow duration-150">
            <CardHeader className="pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">For general users</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => startDemo({ startAt: 0, autoplay: true })} className="h-8">
                  <Play className="h-4 w-4 mr-2" /> Quick tour
                </Button>
                <Button variant="outline" size="sm" onClick={() => startDemo({ startAt: 0, autoplay: false })} className="h-8">
                  Manual tour
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="list-decimal list-inside text-sm space-y-2 text-muted-foreground">
                <li>Create an account (or continue as guest) to personalize your feed.</li>
                <li>Use the search or paste a claim to request a verification.</li>
                <li>Review verification details and follow linked trusted sources.</li>
                <li>Save or subscribe to topics to receive alerts.</li>
              </ol>

              <div className="mt-4 flex gap-2">
                <Button asChild>
                  <Link href="/register">Create account</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/verify">Try verification</Link>
                </Button>
              </div>

              <div className="mt-4">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <button className="text-sm text-primary hover:underline flex items-center gap-2">
                      <Info className="h-4 w-4" /> Why create an account?
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
                    Creating an account lets you save searches, subscribe to topics and get personalized alerts.
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow duration-150">
            <CardHeader className="pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">For administrators</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setOpen(true); setStep(2); setAutoPlay(true); }} className="h-8">
                <Play className="h-4 w-4 mr-2" /> Admin tour
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="list-decimal list-inside text-sm space-y-2 text-muted-foreground">
                <li>Login to the admin console to view system alerts and sources.</li>
                <li>Review and triage high-severity alerts from the dashboard.</li>
                <li>Manage sources and verification rules in the Sources area.</li>
                <li>Adjust monitoring and notification settings to tune ingestion.</li>
              </ol>

              <div className="mt-4 flex gap-2">
                <Button asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/analytics">View Analytics</Link>
                </Button>
              </div>

              <div className="mt-4">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <button className="text-sm text-primary hover:underline flex items-center gap-2">
                      <Info className="h-4 w-4" /> Tips
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
                    Use the dashboard filters to focus on high-severity or unverified alerts. Check analytics and trends for insights.
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </div>

        {open && highlightStyle && (
          <div className="fixed inset-0 pointer-events-none z-40">
            <div
              className="absolute rounded-lg ring-2 ring-primary/60 shadow-xl animate-pulse bg-gradient-to-b from-transparent to-transparent"
              style={highlightStyle}
            />
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
              <div className="bg-background px-4 py-3 rounded-lg shadow-lg border">
                <div className="font-semibold">{steps[step].title}</div>
                <div className="text-sm text-muted-foreground">{steps[step].desc}</div>
                <div className="mt-2 flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => prev()} disabled={step === 0}>Back</Button>
                  {step < steps.length - 1 ? (
                    <Button size="sm" onClick={() => next()}>Next</Button>
                  ) : (
                    <Button size="sm" onClick={() => handleAction(steps[step])}>{steps[step].action.label}</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
          <DialogTrigger asChild>
            <span />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{steps[step].title}</DialogTitle>
            <DialogDescription>{steps[step].desc}</DialogDescription>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <Button variant="ghost" size="sm" onClick={() => { prev(); }} disabled={step === 0}>
                  Back
                </Button>
              </div>

              <div className="flex gap-2">
                {step < steps.length - 1 ? (
                  <Button onClick={() => { next(); }}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={() => handleAction(steps[step])}>{steps[step].action.label}</Button>
                )}
                <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>

            <DialogFooter>
              <div className="text-sm text-muted-foreground">Step {step + 1} of {steps.length}</div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
