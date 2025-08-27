"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle({ size = "sm" as const }: { size?: "sm" | "icon" | "default" }) {
  const { theme, setTheme } = useTheme()

  const isIcon = size === "icon"

  return (
    <Button
      variant="ghost"
      size={isIcon ? "icon" : size}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
   >
      {isIcon ? (
        <>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      ) : theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}

