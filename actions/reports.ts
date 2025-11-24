'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  Report,
  ReportInsert,
  ReportUpdate,
  ReportsFilter
} from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const createReportSchema = z.object({
  type: z.string().min(1, 'Report type is required'),
  source: z.string().min(1, 'Source is required'),
  url: z.string().url('Invalid URL').optional().nullable(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  impact: z.string().optional(),
  evidence: z.string().optional(),
  anonymous: z.boolean().default(false),
  contact: z.string().optional(),
  submitted_by: z.string().uuid().optional(),
})

const updateReportSchema = z.object({
  type: z.string().min(1, 'Report type is required').optional(),
  source: z.string().min(1, 'Source is required').optional(),
  url: z.string().url('Invalid URL').optional().nullable(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  impact: z.string().optional(),
  evidence: z.string().optional(),
  anonymous: z.boolean().optional(),
  contact: z.string().optional(),
})

const updateStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  assigned_to: z.string().uuid().optional(),
  resolution_notes: z.string().optional(),
})

// Server actions
export async function createReport(formData: FormData, submittedBy?: string) {
  try {
    const validatedFields = createReportSchema.safeParse({
      type: formData.get('type'),
      source: formData.get('source'),
      url: formData.get('url'),
      description: formData.get('description'),
      impact: formData.get('impact'),
      evidence: formData.get('evidence'),
      anonymous: formData.get('anonymous') === 'true',
      contact: formData.get('contact'),
      submitted_by: submittedBy || null,
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const reportData: ReportInsert = validatedFields.data

    const { data, error } = await supabase
      .from('reports')
      .insert(reportData)
      .select()
      .single()

    if (error) {
      console.error('Create report error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the report creation event
    if (submittedBy) {
      await logAuditEvent(submittedBy, 'report_create', 'report', data.id, {
        report_type: reportData.type,
        source: reportData.source,
        anonymous: reportData.anonymous,
        timestamp: new Date().toISOString(),
      })
    }

    revalidatePath('/reports')
    return {
      data,
      success: true,
      message: 'Report submitted successfully.',
    }
  } catch (error) {
    console.error('Create report error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getReport(id: string) {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        submitted_by_profile:profiles!reports_submitted_by_fkey (
          full_name,
          email
        ),
        assigned_to_profile:profiles!reports_assigned_to_fkey (
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get report error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get report error:', error)
    return { data: null, error: 'Failed to get report' }
  }
}

export async function getReports(
  filters: ReportsFilter = {},
  page: number = 1,
  pageSize: number = 10
) {
  try {
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('reports')
      .select(`
        *,
        submitted_by_profile:profiles!reports_submitted_by_fkey (
          full_name,
          email
        ),
        assigned_to_profile:profiles!reports_assigned_to_fkey (
          full_name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.submitted_by) {
      query = query.eq('submitted_by', filters.submitted_by)
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
      console.error('Get reports error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get reports error:', error)
    return { data: null, error: 'Failed to get reports', count: 0 }
  }
}

export async function getUserReports(userId: string, page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .eq('submitted_by', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get user reports error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get user reports error:', error)
    return { data: null, error: 'Failed to get user reports', count: 0 }
  }
}

export async function updateReport(id: string, formData: FormData) {
  try {
    const validatedFields = updateReportSchema.safeParse({
      type: formData.get('type'),
      source: formData.get('source'),
      url: formData.get('url'),
      description: formData.get('description'),
      impact: formData.get('impact'),
      evidence: formData.get('evidence'),
      anonymous: formData.get('anonymous') === 'true',
      contact: formData.get('contact'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const updateData: ReportUpdate = validatedFields.data

    const { data, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update report error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the report update event
    await logAuditEvent('system', 'report_update', 'report', id, {
      updated_fields: Object.keys(updateData),
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/reports/${id}`)
    return {
      data,
      success: true,
      message: 'Report updated successfully.',
    }
  } catch (error) {
    console.error('Update report error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function updateReportStatus(
  id: string,
  status: string,
  assignedBy: string,
  assignedTo?: string,
  resolutionNotes?: string
) {
  try {
    const validatedFields = updateStatusSchema.safeParse({
      status,
      assigned_to: assignedTo,
      resolution_notes: resolutionNotes,
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid status update data.',
        success: false,
      }
    }

    const updateData: Partial<ReportUpdate> = {
      status,
      assigned_to: assignedTo || null,
      resolution_notes: resolutionNotes || null,
    }

    // Add resolved_at timestamp if status is resolved
    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update report status error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the status update event
    await logAuditEvent(assignedBy, 'report_status_update', 'report', id, {
      new_status: status,
      assigned_to: assignedTo,
      resolution_notes: resolutionNotes,
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/reports/${id}`)
    revalidatePath('/reports')
    return {
      data,
      success: true,
      message: `Report status updated to ${status}.`,
    }
  } catch (error) {
    console.error('Update report status error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function assignReport(id: string, assignedTo: string, assignedBy: string) {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({
        assigned_to: assignedTo,
        status: 'in_progress'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Assign report error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the assignment event
    await logAuditEvent(assignedBy, 'report_assign', 'report', id, {
      assigned_to: assignedTo,
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/reports/${id}`)
    return {
      data,
      success: true,
      message: 'Report assigned successfully.',
    }
  } catch (error) {
    console.error('Assign report error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function deleteReport(id: string, deletedBy: string) {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete report error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the deletion event
    await logAuditEvent(deletedBy, 'report_delete', 'report', id, {
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/reports')
    return {
      success: true,
      message: 'Report deleted successfully.',
    }
  } catch (error) {
    console.error('Delete report error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getReportStats() {
  try {
    const [
      { count: totalReports },
      { count: pendingReports },
      { count: inProgressReports },
      { count: resolvedReports },
    ] = await Promise.all([
      supabase.from('reports').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
    ])

    const stats = {
      total_reports: totalReports || 0,
      pending_reports: pendingReports || 0,
      in_progress_reports: inProgressReports || 0,
      resolved_reports: resolvedReports || 0,
      resolution_rate: totalReports ? Math.round(((resolvedReports || 0) / totalReports) * 100) : 0,
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('Get report stats error:', error)
    return { data: null, error: 'Failed to get report statistics' }
  }
}

export async function searchReports(query: string, page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('reports')
      .select(`
        *,
        submitted_by_profile:profiles!reports_submitted_by_fkey (
          full_name,
          email
        )
      `, { count: 'exact' })
      .or(`type.ilike.%${query}%,source.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Search reports error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Search reports error:', error)
    return { data: null, error: 'Failed to search reports', count: 0 }
  }
}

export async function getReportsByType(type: string, page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .eq('type', type)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get reports by type error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get reports by type error:', error)
    return { data: null, error: 'Failed to get reports by type', count: 0 }
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