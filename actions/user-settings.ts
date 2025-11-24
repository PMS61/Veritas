'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UserSettings, UserSettingsInsert, UserSettingsUpdate } from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const updateSettingsSchema = z.object({
  two_factor_enabled: z.boolean().optional(),
  session_timeout: z.string().optional(),
  ip_whitelist: z.boolean().optional(),
  audit_logging: z.boolean().optional(),
  email_notifications: z.boolean().optional(),
  sms_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  slack_notifications: z.boolean().optional(),
})

const createSettingsSchema = z.object({
  user_id: z.string().uuid(),
})

// Server actions
export async function getUserSettings(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Get user settings error:', error)
      return { data: null, error: error.message }
    }

    // If no settings exist, return default settings
    if (!data) {
      const defaultSettings = {
        id: '',
        user_id: userId,
        two_factor_enabled: false,
        session_timeout: '24h',
        ip_whitelist: false,
        audit_logging: true,
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
        slack_notifications: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return { data: defaultSettings, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get user settings error:', error)
    return { data: null, error: 'Failed to get user settings' }
  }
}

export async function updateUserSettings(userId: string, formData: FormData) {
  try {
    const validatedFields = updateSettingsSchema.safeParse({
      two_factor_enabled: formData.get('two_factor_enabled') === 'true',
      session_timeout: formData.get('session_timeout'),
      ip_whitelist: formData.get('ip_whitelist') === 'true',
      audit_logging: formData.get('audit_logging') === 'true',
      email_notifications: formData.get('email_notifications') === 'true',
      sms_notifications: formData.get('sms_notifications') === 'true',
      push_notifications: formData.get('push_notifications') === 'true',
      slack_notifications: formData.get('slack_notifications') === 'true',
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const updateData: UserSettingsUpdate = validatedFields.data

    // First check if settings exist for this user
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single()

    let result

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('user_settings')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Update user settings error:', error)
        return {
          error: error.message,
          success: false,
        }
      }

      result = data
    } else {
      // Create new settings
      const settingsData: UserSettingsInsert = {
        user_id: userId,
        ...updateData,
      }

      const { data, error } = await supabase
        .from('user_settings')
        .insert(settingsData)
        .select()
        .single()

      if (error) {
        console.error('Create user settings error:', error)
        return {
          error: error.message,
          success: false,
        }
      }

      result = data
    }

    // Log the settings update event
    await logAuditEvent(userId, 'settings_update', 'user_settings', userId, {
      updated_fields: Object.keys(updateData),
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/profile/settings')
    return {
      data: result,
      success: true,
      message: 'Settings updated successfully.',
    }
  } catch (error) {
    console.error('Update user settings error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function createUserSettings(userId: string) {
  try {
    const validatedFields = createSettingsSchema.safeParse({
      user_id: userId,
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid user ID.',
        success: false,
      }
    }

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingSettings) {
      return {
        data: existingSettings,
        success: true,
        message: 'Settings already exist for this user.',
      }
    }

    // Create default settings
    const settingsData: UserSettingsInsert = {
      user_id: userId,
      two_factor_enabled: false,
      session_timeout: '24h',
      ip_whitelist: false,
      audit_logging: true,
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      slack_notifications: false,
    }

    const { data, error } = await supabase
      .from('user_settings')
      .insert(settingsData)
      .select()
      .single()

    if (error) {
      console.error('Create user settings error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the settings creation event
    await logAuditEvent(userId, 'settings_create', 'user_settings', userId, {
      timestamp: new Date().toISOString(),
    })

    return {
      data,
      success: true,
      message: 'Settings created successfully.',
    }
  } catch (error) {
    console.error('Create user settings error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function updateNotificationSettings(
  userId: string,
  emailNotifications: boolean,
  smsNotifications: boolean,
  pushNotifications: boolean,
  slackNotifications: boolean
) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        push_notifications: pushNotifications,
        slack_notifications: slackNotifications,
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Update notification settings error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the notification settings update event
    await logAuditEvent(userId, 'notification_settings_update', 'user_settings', userId, {
      email_notifications: emailNotifications,
      sms_notifications: smsNotifications,
      push_notifications: pushNotifications,
      slack_notifications: slackNotifications,
      timestamp: new Date().toISOString(),
    })

    return {
      data,
      success: true,
      message: 'Notification settings updated successfully.',
    }
  } catch (error) {
    console.error('Update notification settings error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function updateSecuritySettings(
  userId: string,
  twoFactorEnabled: boolean,
  sessionTimeout: string,
  ipWhitelist: boolean,
  auditLogging: boolean
) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        two_factor_enabled: twoFactorEnabled,
        session_timeout: sessionTimeout,
        ip_whitelist: ipWhitelist,
        audit_logging: auditLogging,
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Update security settings error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the security settings update event
    await logAuditEvent(userId, 'security_settings_update', 'user_settings', userId, {
      two_factor_enabled: twoFactorEnabled,
      session_timeout: sessionTimeout,
      ip_whitelist: ipWhitelist,
      audit_logging: auditLogging,
      timestamp: new Date().toISOString(),
    })

    return {
      data,
      success: true,
      message: 'Security settings updated successfully.',
    }
  } catch (error) {
    console.error('Update security settings error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function resetUserSettingsToDefaults(userId: string) {
  try {
    const defaultSettings = {
      two_factor_enabled: false,
      session_timeout: '24h',
      ip_whitelist: false,
      audit_logging: true,
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      slack_notifications: false,
    }

    const { data, error } = await supabase
      .from('user_settings')
      .update(defaultSettings)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Reset user settings error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the settings reset event
    await logAuditEvent(userId, 'settings_reset', 'user_settings', userId, {
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/profile/settings')
    return {
      data,
      success: true,
      message: 'Settings reset to defaults successfully.',
    }
  } catch (error) {
    console.error('Reset user settings error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getUsersWithNotificationSettings(
  notificationType: 'email' | 'sms' | 'push' | 'slack'
) {
  try {
    const columnName = `${notificationType}_notifications`

    const { data, error } = await supabase
      .from('user_settings')
      .select(`
        *,
        profiles!inner (
          id,
          email,
          full_name
        )
      `)
      .eq(columnName, true)
      .eq('profiles.role', 'moderator')

    if (error) {
      console.error('Get users with notification settings error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get users with notification settings error:', error)
    return { data: null, error: 'Failed to get users with notification settings' }
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