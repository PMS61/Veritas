'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  Alert,
  AlertInsert,
  AlertUpdate,
  AlertsFilter,
  AlertSeverity,
  AlertStatus
} from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const createAlertSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum(['active', 'resolved', 'dismissed', 'investigating']).default('active'),
  category: z.string().optional(),
  source: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  actions: z.array(z.string()).default([]),
  related_incidents: z.number().default(0),
  metadata: z.any().default({}),
})

const updateAlertSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  status: z.enum(['active', 'resolved', 'dismissed', 'investigating']).optional(),
  category: z.string().optional(),
  source: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional(),
  related_incidents: z.number().optional(),
  metadata: z.any().optional(),
})

// Server actions
export async function createAlert(formData: FormData, createdBy?: string) {
  try {
    const validatedFields = createAlertSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      severity: formData.get('severity'),
      status: formData.get('status') || 'active',
      category: formData.get('category'),
      source: formData.get('source'),
      assigned_to: formData.get('assigned_to'),
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      actions: JSON.parse(formData.get('actions') as string || '[]'),
      related_incidents: parseInt(formData.get('related_incidents') as string || '0'),
      metadata: JSON.parse(formData.get('metadata') as string || '{}'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const alertData: AlertInsert = validatedFields.data

    const { data, error } = await supabase
      .from('alerts')
      .insert(alertData)
      .select()
      .single()

    if (error) {
      console.error('Create alert error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the alert creation event
    if (createdBy) {
      await logAuditEvent(createdBy, 'alert_create', 'alert', data.id, {
        alert_title: alertData.title,
        severity: alertData.severity,
        timestamp: new Date().toISOString(),
      })

      // Track analytics event
      await trackCustomEvent('alert_created', 'alert', createdBy, {
        alert_id: data.id,
        severity: alertData.severity,
        category: alertData.category,
      })
    }

    revalidatePath('/alerts')
    return {
      data,
      success: true,
      message: 'Alert created successfully.',
    }
  } catch (error) {
    console.error('Create alert error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getAlert(id: string) {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        assigned_to_profile:profiles!alerts_assigned_to_fkey (
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get alert error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get alert error:', error)
    return { data: null, error: 'Failed to get alert' }
  }
}

export async function getAlerts(
  filters: AlertsFilter = {},
  page: number = 1,
  pageSize: number = 20
) {
  try {
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('alerts')
      .select(`
        *,
        assigned_to_profile:profiles!alerts_assigned_to_fkey (
          full_name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.severity) {
      query = query.eq('severity', filters.severity)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to)
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get alerts error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get alerts error:', error)
    return { data: null, error: 'Failed to get alerts', count: 0 }
  }
}

export async function updateAlertStatus(id: string, status: AlertStatus, updatedBy: string) {
  try {
    const updateData: AlertUpdate = {
      status,
      resolved_at: status === 'resolved' ? new Date().toISOString() : null,
    }

    const { data, error } = await supabase
      .from('alerts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update alert status error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the status update event
    await logAuditEvent(updatedBy, 'alert_status_update', 'alert', id, {
      new_status: status,
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/alerts/${id}`)
    return {
      data,
      success: true,
      message: `Alert status updated to ${status}.`,
    }
  } catch (error) {
    console.error('Update alert status error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function assignAlert(id: string, assignedTo: string, assignedBy: string) {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .update({
        assigned_to: assignedTo,
        status: 'investigating'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Assign alert error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the assignment event
    await logAuditEvent(assignedBy, 'alert_assign', 'alert', id, {
      assigned_to: assignedTo,
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/alerts/${id}`)
    return {
      data,
      success: true,
      message: 'Alert assigned successfully.',
    }
  } catch (error) {
    console.error('Assign alert error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getAlertStats() {
  try {
    const [
      { count: totalAlerts },
      { count: activeAlerts },
      { count: criticalAlerts },
      { count: highAlerts },
      { count: resolvedAlerts },
    ] = await Promise.all([
      supabase.from('alerts').select('*', { count: 'exact', head: true }),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('severity', 'critical'),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('severity', 'high'),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
    ])

    const stats = {
      total_alerts: totalAlerts || 0,
      active_alerts: activeAlerts || 0,
      critical_alerts: criticalAlerts || 0,
      high_alerts: highAlerts || 0,
      resolved_alerts: resolvedAlerts || 0,
      resolution_rate: totalAlerts ? Math.round(((resolvedAlerts || 0) / totalAlerts) * 100) : 0,
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('Get alert stats error:', error)
    return { data: null, error: 'Failed to get alert statistics' }
  }
}

// Helper functions
async function trackCustomEvent(
  eventType: string,
  eventCategory?: string,
  userId?: string,
  data?: any
) {
  try {
    await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        event_category: eventCategory || null,
        user_id: userId || null,
        data: data || {},
      })
  } catch (error) {
    console.error('Failed to track custom event:', error)
  }
}

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