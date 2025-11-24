'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { Profile, ProfileInsert } from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client for server operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['user', 'moderator', 'admin']).default('user'),
  department: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().default('UTC'),
  language: z.string().default('en'),
})

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const updatePasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Server actions
export async function signIn(formData: FormData) {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid credentials. Please check your email and password.',
        success: false,
      }
    }

    const { email, password } = validatedFields.data

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the login event
    if (data.user) {
      await logAuditEvent(data.user.id, 'login', 'auth', data.user.id, {
        email,
        timestamp: new Date().toISOString(),
      })
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      message: 'Login successful',
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function signUp(formData: FormData) {
  try {
    const validatedFields = registerSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      full_name: formData.get('full_name'),
      role: formData.get('role') || 'user',
      department: formData.get('department'),
      phone: formData.get('phone'),
      timezone: formData.get('timezone') || 'UTC',
      language: formData.get('language') || 'en',
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const { email, password, full_name, role, department, phone, timezone, language } = validatedFields.data

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (authError) {
      return {
        error: authError.message,
        success: false,
      }
    }

    if (authData.user && !authData.user.identities?.length) {
      // User already exists
      return {
        error: 'An account with this email already exists. Please sign in instead.',
        success: false,
      }
    }

    if (authData.user) {
      // Create user profile
      const profileData: ProfileInsert = {
        id: authData.user.id,
        email,
        full_name,
        role: role as any,
        department: department || null,
        phone: phone || null,
        timezone,
        language,
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail signup if profile creation fails, but log it
      }

      // Create default user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert({
          user_id: authData.user.id,
        })

      if (settingsError) {
        console.error('Settings creation error:', settingsError)
        // Don't fail signup if settings creation fails, but log it
      }

      // Log the registration event
      await logAuditEvent(authData.user.id, 'register', 'auth', authData.user.id, {
        email,
        role,
        timestamp: new Date().toISOString(),
      })
    }

    return {
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      error: 'An unexpected error occurred during registration.',
      success: false,
    }
  }
}

export async function signOut() {
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      // Log the logout event
      await logAuditEvent(session.user.id, 'logout', 'auth', session.user.id, {
        timestamp: new Date().toISOString(),
      })
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
    }

    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error) {
    console.error('Logout error:', error)
    redirect('/login')
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const validatedFields = resetPasswordSchema.safeParse({
      email: formData.get('email'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Please enter a valid email address.',
        success: false,
      }
    }

    const { email } = validatedFields.data

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    })

    if (error) {
      return {
        error: error.message,
        success: false,
      }
    }

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email.',
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const validatedFields = updatePasswordSchema.safeParse({
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Password must be at least 6 characters long.',
        success: false,
      }
    }

    const { password } = validatedFields.data

    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return {
        error: error.message,
        success: false,
      }
    }

    if (data.user) {
      // Log the password update event
      await logAuditEvent(data.user.id, 'password_update', 'auth', data.user.id, {
        timestamp: new Date().toISOString(),
      })
    }

    return {
      success: true,
      message: 'Password updated successfully.',
    }
  } catch (error) {
    console.error('Update password error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

// Helper function to log audit events
async function logAuditEvent(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details: any
) {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
      })
  } catch (error) {
    console.error('Failed to log audit event:', error)
    // Don't fail the main operation if audit logging fails
  }
}

// Utility functions
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (error) {
    console.error('Get current user error:', error)
    return { user: null, error: 'Failed to get current user' }
  }
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  } catch (error) {
    console.error('Get session error:', error)
    return { session: null, error: 'Failed to get session' }
  }
}