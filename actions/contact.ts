'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  ContactMessage,
  ContactMessageInsert,
  ContactMessageUpdate
} from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const createContactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const updateContactStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  response: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
})

// Server actions
export async function createContactMessage(formData: FormData) {
  try {
    const validatedFields = createContactMessageSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      category: formData.get('category'),
      message: formData.get('message'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const messageData: ContactMessageInsert = validatedFields.data

    const { data, error } = await supabase
      .from('contact_messages')
      .insert(messageData)
      .select()
      .single()

    if (error) {
      console.error('Create contact message error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Track analytics event
    await trackCustomEvent('contact_form_submitted', 'contact', undefined, {
      category: messageData.category,
      subject: messageData.subject,
    })

    revalidatePath('/contact')
    return {
      data,
      success: true,
      message: 'Message sent successfully. We will respond within 24-48 hours.',
    }
  } catch (error) {
    console.error('Create contact message error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getContactMessage(id: string) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select(`
        *,
        assigned_to_profile:profiles!contact_messages_assigned_to_fkey (
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get contact message error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get contact message error:', error)
    return { data: null, error: 'Failed to get contact message' }
  }
}

export async function getContactMessages(
  filters: { status?: string; category?: string; assigned_to?: string } = {},
  page: number = 1,
  pageSize: number = 20
) {
  try {
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('contact_messages')
      .select(`
        *,
        assigned_to_profile:profiles!contact_messages_assigned_to_fkey (
          full_name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get contact messages error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get contact messages error:', error)
    return { data: null, error: 'Failed to get contact messages', count: 0 }
  }
}

export async function updateContactStatus(
  id: string,
  status: string,
  updatedBy: string,
  response?: string,
  assignedTo?: string
) {
  try {
    const validatedFields = updateContactStatusSchema.safeParse({
      status,
      response,
      assigned_to: assignedTo,
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid status update data.',
        success: false,
      }
    }

    const updateData: ContactMessageUpdate = {
      status,
      response: response || null,
      assigned_to: assignedTo || null,
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update contact status error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the status update event
    await logAuditEvent(updatedBy, 'contact_status_update', 'contact_message', id, {
      new_status: status,
      assigned_to: assignedTo,
      timestamp: new Date().toISOString(),
    })

    // Track analytics event
    await trackCustomEvent('contact_status_updated', 'contact', updatedBy, {
      message_id: id,
      new_status: status,
    })

    revalidatePath('/admin/contact')
    return {
      data,
      success: true,
      message: `Contact message status updated to ${status}.`,
    }
  } catch (error) {
    console.error('Update contact status error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function assignContactMessage(id: string, assignedTo: string, assignedBy: string) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({
        assigned_to: assignedTo,
        status: 'in_progress'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Assign contact message error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the assignment event
    await logAuditEvent(assignedBy, 'contact_assign', 'contact_message', id, {
      assigned_to: assignedTo,
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/admin/contact/${id}`)
    return {
      data,
      success: true,
      message: 'Contact message assigned successfully.',
    }
  } catch (error) {
    console.error('Assign contact message error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function respondToContactMessage(
  id: string,
  response: string,
  respondedBy: string
) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({
        response,
        status: 'resolved'
      })
      .eq('id', id)
      .select(`
        *,
        assigned_to_profile:profiles!contact_messages_assigned_to_fkey (
          full_name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Respond to contact message error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the response event
    await logAuditEvent(respondedBy, 'contact_respond', 'contact_message', id, {
      response_length: response.length,
      timestamp: new Date().toISOString(),
    })

    // Track analytics event
    await trackCustomEvent('contact_responded', 'contact', respondedBy, {
      message_id: id,
    })

    // TODO: Send email notification to the contact person

    revalidatePath(`/admin/contact/${id}`)
    return {
      data,
      success: true,
      message: 'Response sent successfully.',
    }
  } catch (error) {
    console.error('Respond to contact message error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function deleteContactMessage(id: string, deletedBy: string) {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete contact message error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the deletion event
    await logAuditEvent(deletedBy, 'contact_delete', 'contact_message', id, {
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/admin/contact')
    return {
      success: true,
      message: 'Contact message deleted successfully.',
    }
  } catch (error) {
    console.error('Delete contact message error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getContactStats() {
  try {
    const [
      { count: totalMessages },
      { count: newMessages },
      { count: inProgressMessages },
      { count: resolvedMessages },
    ] = await Promise.all([
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
    ])

    const stats = {
      total_messages: totalMessages || 0,
      new_messages: newMessages || 0,
      in_progress_messages: inProgressMessages || 0,
      resolved_messages: resolvedMessages || 0,
      response_rate: totalMessages ? Math.round(((resolvedMessages || 0) / totalMessages) * 100) : 0,
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('Get contact stats error:', error)
    return { data: null, error: 'Failed to get contact statistics' }
  }
}

export async function searchContactMessages(query: string, page: number = 1, pageSize: number = 20) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,subject.ilike.%${query}%,message.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Search contact messages error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Search contact messages error:', error)
    return { data: null, error: 'Failed to search contact messages', count: 0 }
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