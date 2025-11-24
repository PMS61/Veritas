'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Profile, ProfileInsert, ProfileUpdate } from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  avatar_url: z.string().url('Invalid URL').optional().nullable(),
})

const updateRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['user', 'moderator', 'admin']),
})

// Server actions
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Get profile error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get profile error:', error)
    return { data: null, error: 'Failed to get profile' }
  }
}

export async function updateProfile(userId: string, formData: FormData) {
  try {
    const validatedFields = updateProfileSchema.safeParse({
      full_name: formData.get('full_name'),
      department: formData.get('department'),
      phone: formData.get('phone'),
      timezone: formData.get('timezone'),
      language: formData.get('language'),
      avatar_url: formData.get('avatar_url'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const updateData: ProfileUpdate = validatedFields.data

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Update profile error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the update event
    await logAuditEvent(userId, 'profile_update', 'profile', userId, {
      updated_fields: Object.keys(updateData),
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/profile')
    return {
      data,
      success: true,
      message: 'Profile updated successfully.',
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getAllProfiles(page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get all profiles error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get all profiles error:', error)
    return { data: null, error: 'Failed to get profiles', count: 0 }
  }
}

export async function searchProfiles(query: string, page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,department.ilike.%${query}%`)
      .order('full_name', { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Search profiles error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Search profiles error:', error)
    return { data: null, error: 'Failed to search profiles', count: 0 }
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'moderator' | 'admin', updatedBy: string) {
  try {
    const validatedFields = updateRoleSchema.safeParse({ userId, role })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input.',
        success: false,
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Update user role error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the role update event
    await logAuditEvent(updatedBy, 'role_update', 'profile', userId, {
      new_role: role,
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/admin/users')
    return {
      data,
      success: true,
      message: 'User role updated successfully.',
    }
  } catch (error) {
    console.error('Update user role error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function deactivateUser(userId: string, deactivatedBy: string) {
  try {
    // Update the user's auth status to inactive
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: 'permanent'
    })

    if (authError) {
      console.error('Deactivate user auth error:', authError)
      return {
        error: 'Failed to deactivate user account.',
        success: false,
      }
    }

    // Log the deactivation event
    await logAuditEvent(deactivatedBy, 'user_deactivate', 'profile', userId, {
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deactivated successfully.',
    }
  } catch (error) {
    console.error('Deactivate user error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getUsersByRole(role: 'user' | 'moderator' | 'admin', page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('role', role)
      .order('full_name', { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get users by role error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get users by role error:', error)
    return { data: null, error: 'Failed to get users by role', count: 0 }
  }
}

export async function getUserStats() {
  try {
    const { data: totalUsers, error: totalError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    const { data: activeUsers, error: activeError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .neq('role', 'guest')

    const { data: admins, error: adminError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin')

    const { data: moderators, error: moderatorError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'moderator')

    if (totalError || activeError || adminError || moderatorError) {
      console.error('Get user stats error:', { totalError, activeError, adminError, moderatorError })
      return { data: null, error: 'Failed to get user statistics' }
    }

    const stats = {
      total_users: totalUsers?.length || 0,
      active_users: activeUsers?.length || 0,
      admins: admins?.length || 0,
      moderators: moderators?.length || 0,
      regular_users: (activeUsers?.length || 0) - (admins?.length || 0) - (moderators?.length || 0),
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('Get user stats error:', error)
    return { data: null, error: 'Failed to get user statistics' }
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
  }
}