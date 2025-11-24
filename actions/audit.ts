'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { AuditLog, AuditLogInsert } from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Server actions
export async function getAuditLogs(
  filters: { user_id?: string; action?: string; resource_type?: string } = {},
  page: number = 1,
  pageSize: number = 50
) {
  try {
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        profiles!audit_logs_user_id_fkey (
          full_name,
          email
        )
      `, { count: 'exact' })

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    if (filters.action) {
      query = query.eq('action', filters.action)
    }
    if (filters.resource_type) {
      query = query.eq('resource_type', filters.resource_type)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get audit logs error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get audit logs error:', error)
    return { data: null, error: 'Failed to get audit logs', count: 0 }
  }
}

export async function logAuditEvent(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const auditData: AuditLogInsert = {
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .insert(auditData)
      .select()
      .single()

    if (error) {
      console.error('Log audit event error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Log audit event error:', error)
    return { data: null, error: 'Failed to log audit event' }
  }
}

export async function getUserAuditHistory(userId: string, page: number = 1, pageSize: number = 50) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get user audit history error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get user audit history error:', error)
    return { data: null, error: 'Failed to get user audit history', count: 0 }
  }
}

export async function getAuditStats() {
  try {
    const [
      { count: totalLogs },
      { data: recentActions },
      { data: topUsers },
    ] = await Promise.all([
      supabase.from('audit_logs').select('*', { count: 'exact', head: true }),
      supabase
        .from('audit_logs')
        .select('action')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('audit_logs')
        .select(`
          user_id,
          profiles!inner(full_name)
        `)
        .not('user_id', 'is', null)
        .group('user_id')
        .order('count', { ascending: false })
        .limit(5),
    ])

    const stats = {
      total_logs: totalLogs || 0,
      recent_actions: recentActions || [],
      top_users: topUsers || [],
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('Get audit stats error:', error)
    return { data: null, error: 'Failed to get audit statistics' }
  }
}