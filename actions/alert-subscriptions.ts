'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  AlertSubscription,
  AlertSubscriptionInsert,
  AlertSubscriptionUpdate,
  AlertSeverity
} from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const createSubscriptionSchema = z.object({
  user_id: z.string().uuid(),
  categories: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  severity: z.array(z.enum(['critical', 'high', 'medium', 'low'])).default(['critical', 'high']),
  channels: z.array(z.string()).default([]),
  enabled: z.boolean().default(true),
})

const updateSubscriptionSchema = z.object({
  categories: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  severity: z.array(z.enum(['critical', 'high', 'medium', 'low'])).optional(),
  channels: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
})

// Server actions
export async function createSubscription(userId: string, formData: FormData) {
  try {
    const validatedFields = createSubscriptionSchema.safeParse({
      user_id: userId,
      categories: JSON.parse(formData.get('categories') as string || '[]'),
      regions: JSON.parse(formData.get('regions') as string || '[]'),
      severity: JSON.parse(formData.get('severity') as string || '["critical", "high"]'),
      channels: JSON.parse(formData.get('channels') as string || '[]'),
      enabled: formData.get('enabled') === 'true',
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const subscriptionData: AlertSubscriptionInsert = validatedFields.data

    // Check if subscription already exists for this user
    const { data: existingSubscription } = await supabase
      .from('alert_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingSubscription) {
      return {
        error: 'Subscription already exists for this user.',
        success: false,
      }
    }

    const { data, error } = await supabase
      .from('alert_subscriptions')
      .insert(subscriptionData)
      .select()
      .single()

    if (error) {
      console.error('Create subscription error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the subscription creation event
    await logAuditEvent(userId, 'alert_subscription_create', 'alert_subscription', data.id, {
      categories: subscriptionData.categories,
      severity: subscriptionData.severity,
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/profile/alerts')
    return {
      data,
      success: true,
      message: 'Alert subscription created successfully.',
    }
  } catch (error) {
    console.error('Create subscription error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getUserSubscription(userId: string) {
  try {
    const { data, error } = await supabase
      .from('alert_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Get user subscription error:', error)
      return { data: null, error: error.message }
    }

    // If no subscription exists, return default subscription
    if (!data) {
      const defaultSubscription = {
        id: '',
        user_id: userId,
        categories: [],
        regions: [],
        severity: ['critical', 'high'] as AlertSeverity[],
        channels: [],
        enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return { data: defaultSubscription, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get user subscription error:', error)
    return { data: null, error: 'Failed to get user subscription' }
  }
}

export async function updateSubscription(userId: string, formData: FormData) {
  try {
    const validatedFields = updateSubscriptionSchema.safeParse({
      categories: JSON.parse(formData.get('categories') as string || '[]'),
      regions: JSON.parse(formData.get('regions') as string || '[]'),
      severity: JSON.parse(formData.get('severity') as string || '["critical", "high"]'),
      channels: JSON.parse(formData.get('channels') as string || '[]'),
      enabled: formData.get('enabled') === 'true',
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const updateData: AlertSubscriptionUpdate = validatedFields.data

    // First check if subscription exists
    const { data: existingSubscription } = await supabase
      .from('alert_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single()

    let result

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from('alert_subscriptions')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Update subscription error:', error)
        return {
          error: error.message,
          success: false,
        }
      }

      result = data
    } else {
      // Create new subscription
      const subscriptionData: AlertSubscriptionInsert = {
        user_id: userId,
        ...updateData,
      }

      const { data, error } = await supabase
        .from('alert_subscriptions')
        .insert(subscriptionData)
        .select()
        .single()

      if (error) {
        console.error('Create subscription error:', error)
        return {
          error: error.message,
          success: false,
        }
      }

      result = data
    }

    // Log the subscription update event
    await logAuditEvent(userId, 'alert_subscription_update', 'alert_subscription', result.id, {
      updated_fields: Object.keys(updateData),
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/profile/alerts')
    return {
      data: result,
      success: true,
      message: 'Alert subscription updated successfully.',
    }
  } catch (error) {
    console.error('Update subscription error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function deleteSubscription(userId: string) {
  try {
    const { error } = await supabase
      .from('alert_subscriptions')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Delete subscription error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the subscription deletion event
    await logAuditEvent(userId, 'alert_subscription_delete', 'alert_subscription', userId, {
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/profile/alerts')
    return {
      success: true,
      message: 'Alert subscription deleted successfully.',
    }
  } catch (error) {
    console.error('Delete subscription error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function toggleSubscription(userId: string, enabled: boolean) {
  try {
    const { data, error } = await supabase
      .from('alert_subscriptions')
      .update({ enabled })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Toggle subscription error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the toggle event
    await logAuditEvent(userId, 'alert_subscription_toggle', 'alert_subscription', data.id, {
      enabled,
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/profile/alerts')
    return {
      data,
      success: true,
      message: `Alert subscription ${enabled ? 'enabled' : 'disabled'} successfully.`,
    }
  } catch (error) {
    console.error('Toggle subscription error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getSubscriptionsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from('alert_subscriptions')
      .select(`
        *,
        profiles!alert_subscriptions_user_id_fkey (
          email,
          full_name,
          user_settings!inner (
            email_notifications,
            sms_notifications,
            push_notifications,
            slack_notifications
          )
        )
      `)
      .eq('enabled', true)
      .contains('categories', [category])

    if (error) {
      console.error('Get subscriptions by category error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get subscriptions by category error:', error)
    return { data: null, error: 'Failed to get subscriptions by category' }
  }
}

export async function getSubscriptionsBySeverity(severity: AlertSeverity) {
  try {
    const { data, error } = await supabase
      .from('alert_subscriptions')
      .select(`
        *,
        profiles!alert_subscriptions_user_id_fkey (
          email,
          full_name,
          user_settings!inner (
            email_notifications,
            sms_notifications,
            push_notifications,
            slack_notifications
          )
        )
      `)
      .eq('enabled', true)
      .contains('severity', [severity])

    if (error) {
      console.error('Get subscriptions by severity error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get subscriptions by severity error:', error)
    return { data: null, error: 'Failed to get subscriptions by severity' }
  }
}

export async function getAllSubscriptions(page: number = 1, pageSize: number = 20) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('alert_subscriptions')
      .select(`
        *,
        profiles!alert_subscriptions_user_id_fkey (
          email,
          full_name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get all subscriptions error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get all subscriptions error:', error)
    return { data: null, error: 'Failed to get all subscriptions', count: 0 }
  }
}

// Helper functions
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