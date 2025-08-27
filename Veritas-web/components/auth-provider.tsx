"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  email: string
  firstName?: string
  lastName?: string
  role: "public" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    console.log("AuthProvider: login called with", userData)
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    console.log("AuthProvider: user set and stored in localStorage")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
