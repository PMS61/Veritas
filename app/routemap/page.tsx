"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, FileCode } from "lucide-react";

export default function RouteMapPage() {
  const pathname = usePathname();

  // Define all the routes in the application
  const routes = [
    {
      name: "Public Pages",
      routes: [
        { path: "/", name: "Home" },
        { path: "/about", name: "About" },
        { path: "/contact", name: "Contact" },
        { path: "/login", name: "Login" },
        { path: "/register", name: "Register" },
        { path: "/privacy", name: "Privacy Policy" },
        { path: "/terms", name: "Terms of Service" },
        { path: "/report", name: "Report" },
      ],
      icon: <Map className="w-5 h-5 text-primary" />,
    },
    {
      name: "Dashboard Pages",
      routes: [
        { path: "/dashboard", name: "Dashboard" },
        { path: "/verify", name: "Verify" },
        { path: "/updates", name: "Updates" },
        { path: "/help", name: "Help" },
        { path: "/analytics", name: "Analytics" },
        { path: "/trends", name: "Trends" },
      ],
      icon: <LayoutDashboard className="w-5 h-5 text-green-500" />,
    },
    {
      name: "Utilities",
      routes: [
        { path: "/routemap", name: "Route Map (this page)" },
      ],
      icon: <FileCode className="w-5 h-5 text-violet-500" />,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Map className="w-6 h-6 text-primary" />
          Application Route Map
        </h1>
        <p className="text-muted-foreground">
          This page provides links to all accessible routes in the CLens application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((section, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {section.icon}
                {section.name}
                <Badge variant="outline" className="ml-2">
                  {section.routes.length} routes
                </Badge>
              </CardTitle>
              <CardDescription>Navigation links for {section.name.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {section.routes.map((route, j) => {
                  const isCurrentPath = pathname === route.path;
                  return (
                    <div key={j} className="flex items-center">
                      <Button
                        variant={isCurrentPath ? "default" : "outline"}
                        size="sm"
                        asChild
                        className="w-full justify-start"
                      >
                        <Link href={route.path}>
                          {route.name} {isCurrentPath && <Badge className="ml-auto">Current</Badge>}
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" />
            Route Structure
          </CardTitle>
          <CardDescription>Visual representation of the application routes</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {`
app/
├── page.tsx (/)
├── about/
│   └── page.tsx (/about)
├── admin/
│   ├── page.tsx (/admin)
│   ├── alerts/
│   │   └── page.tsx (/admin/alerts)
│   ├── analytics/
│   ├── misinformation/
│   ├── monitoring/
│   ├── settings/
│   ├── sources/
│   ├── system/
│   ├── trends/
│   ├── users/
│   └── verification/
├── contact/
│   └── page.tsx (/contact)
├── dashboard/
│   └── page.tsx (/dashboard)
├── help/
│   └── page.tsx (/help)
├── login/
│   └── page.tsx (/login)
├── privacy/
│   └── page.tsx (/privacy)
├── register/
│   └── page.tsx (/register)
├── report/
│   └── page.tsx (/report)
├── routemap/
│   └── page.tsx (/routemap)
├── terms/
│   └── page.tsx (/terms)
├── updates/
│   └── page.tsx (/updates)
└── verify/
    └── page.tsx (/verify)
            `}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
