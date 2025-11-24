'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  Claim,
  ClaimInsert,
  ClaimUpdate,
  ClaimsFilter,
  VerificationStatus,
  ClaimType
} from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const createClaimSchema = z.object({
  claim: z.string().min(10, 'Claim must be at least 10 characters'),
  source: z.string().optional(),
  url: z.string().url('Invalid URL').optional().nullable(),
  context: z.string().optional(),
  category: z.string().optional(),
  submitted_by: z.string().uuid().optional(),
  claim_type: z.enum(['verification', 'fact_check', 'analysis']).default('verification'),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  evidence: z.any().default([]),
})

const updateClaimSchema = z.object({
  claim: z.string().min(10, 'Claim must be at least 10 characters').optional(),
  source: z.string().optional(),
  url: z.string().url('Invalid URL').optional().nullable(),
  context: z.string().optional(),
  category: z.string().optional(),
  claim_type: z.enum(['verification', 'fact_check', 'analysis']).optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  evidence: z.any().optional(),
})

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'verified', 'debunked', 'misleading', 'unverified']),
  ai_verdict: z.string().optional(),
  fact_check_details: z.string().optional(),
  confidence_score: z.number().min(0).max(100).optional(),
})

// Server actions
export async function createClaim(formData: FormData, submittedBy?: string) {
  try {
    const validatedFields = createClaimSchema.safeParse({
      claim: formData.get('claim'),
      source: formData.get('source'),
      url: formData.get('url'),
      context: formData.get('context'),
      category: formData.get('category'),
      submitted_by: submittedBy || null,
      claim_type: formData.get('claim_type') || 'verification',
      location: formData.get('location'),
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      evidence: JSON.parse(formData.get('evidence') as string || '[]'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const claimData: ClaimInsert = validatedFields.data

    const { data, error } = await supabase
      .from('claims')
      .insert(claimData)
      .select()
      .single()

    if (error) {
      console.error('Create claim error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the claim creation event
    if (submittedBy) {
      await logAuditEvent(submittedBy, 'claim_create', 'claim', data.id, {
        claim_text: claimData.claim,
        category: claimData.category,
        timestamp: new Date().toISOString(),
      })
    }

    revalidatePath('/claims')
    return {
      data,
      success: true,
      message: 'Claim submitted successfully for verification.',
    }
  } catch (error) {
    console.error('Create claim error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getClaim(id: string) {
  try {
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        submitted_by_profile:profiles!claims_submitted_by_fkey (
          full_name,
          email
        ),
        verified_by_profile:profiles!claims_verified_by_fkey (
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get claim error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get claim error:', error)
    return { data: null, error: 'Failed to get claim' }
  }
}

export async function getClaims(
  filters: ClaimsFilter = {},
  page: number = 1,
  pageSize: number = 10
) {
  try {
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('claims')
      .select(`
        *,
        submitted_by_profile:profiles!claims_submitted_by_fkey (
          full_name,
          email
        ),
        verified_by_profile:profiles!claims_verified_by_fkey (
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
    if (filters.submitted_by) {
      query = query.eq('submitted_by', filters.submitted_by)
    }
    if (filters.claim_type) {
      query = query.eq('claim_type', filters.claim_type)
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags)
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
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
      console.error('Get claims error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get claims error:', error)
    return { data: null, error: 'Failed to get claims', count: 0 }
  }
}

export async function updateClaim(id: string, formData: FormData) {
  try {
    const validatedFields = updateClaimSchema.safeParse({
      claim: formData.get('claim'),
      source: formData.get('source'),
      url: formData.get('url'),
      context: formData.get('context'),
      category: formData.get('category'),
      claim_type: formData.get('claim_type'),
      location: formData.get('location'),
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      evidence: JSON.parse(formData.get('evidence') as string || '[]'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const updateData: ClaimUpdate = validatedFields.data

    const { data, error } = await supabase
      .from('claims')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update claim error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the claim update event
    await logAuditEvent('system', 'claim_update', 'claim', id, {
      updated_fields: Object.keys(updateData),
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/claims/${id}`)
    return {
      data,
      success: true,
      message: 'Claim updated successfully.',
    }
  } catch (error) {
    console.error('Update claim error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function updateClaimStatus(
  id: string,
  status: VerificationStatus,
  verifiedBy: string,
  aiVerdict?: string,
  factCheckDetails?: string,
  confidenceScore?: number
) {
  try {
    const validatedFields = updateStatusSchema.safeParse({
      status,
      ai_verdict: aiVerdict,
      fact_check_details: factCheckDetails,
      confidence_score: confidenceScore,
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid status update data.',
        success: false,
      }
    }

    const updateData = {
      status,
      verified_by: verifiedBy,
      verified_at: new Date().toISOString(),
      ai_verdict: aiVerdict || null,
      fact_check_details: factCheckDetails || null,
      confidence_score: confidenceScore || null,
    }

    const { data, error } = await supabase
      .from('claims')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update claim status error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the status update event
    await logAuditEvent(verifiedBy, 'claim_status_update', 'claim', id, {
      new_status: status,
      ai_verdict: aiVerdict,
      confidence_score: confidenceScore,
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/claims/${id}`)
    revalidatePath('/claims')
    return {
      data,
      success: true,
      message: `Claim status updated to ${status}.`,
    }
  } catch (error) {
    console.error('Update claim status error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function assignClaim(id: string, assignedTo: string, assignedBy: string) {
  try {
    const { data, error } = await supabase
      .from('claims')
      .update({ assigned_to: assignedTo })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Assign claim error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the assignment event
    await logAuditEvent(assignedBy, 'claim_assign', 'claim', id, {
      assigned_to: assignedTo,
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/claims/${id}`)
    return {
      data,
      success: true,
      message: 'Claim assigned successfully.',
    }
  } catch (error) {
    console.error('Assign claim error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function addEvidence(id: string, evidence: any, addedBy: string) {
  try {
    // First get existing evidence
    const { data: existingClaim, error: fetchError } = await supabase
      .from('claims')
      .select('evidence')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Fetch claim for evidence error:', fetchError)
      return {
        error: 'Failed to fetch claim for adding evidence.',
        success: false,
      }
    }

    const currentEvidence = Array.isArray(existingClaim.evidence) ? existingClaim.evidence : []
    const updatedEvidence = [...currentEvidence, {
      ...evidence,
      added_by: addedBy,
      added_at: new Date().toISOString(),
    }]

    const { data, error } = await supabase
      .from('claims')
      .update({ evidence: updatedEvidence })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Add evidence error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the evidence addition event
    await logAuditEvent(addedBy, 'evidence_add', 'claim', id, {
      evidence_count: updatedEvidence.length,
      timestamp: new Date().toISOString(),
    })

    revalidatePath(`/claims/${id}`)
    return {
      data,
      success: true,
      message: 'Evidence added successfully.',
    }
  } catch (error) {
    console.error('Add evidence error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function deleteClaim(id: string, deletedBy: string) {
  try {
    const { error } = await supabase
      .from('claims')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete claim error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Log the deletion event
    await logAuditEvent(deletedBy, 'claim_delete', 'claim', id, {
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/claims')
    return {
      success: true,
      message: 'Claim deleted successfully.',
    }
  } catch (error) {
    console.error('Delete claim error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getClaimStats() {
  try {
    const [
      { count: totalClaims },
      { count: pendingClaims },
      { count: verifiedClaims },
      { count: debunkedClaims },
      { count: misleadingClaims },
    ] = await Promise.all([
      supabase.from('claims').select('*', { count: 'exact', head: true }),
      supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'verified'),
      supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'debunked'),
      supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'misleading'),
    ])

    const stats = {
      total_claims: totalClaims || 0,
      pending_claims: pendingClaims || 0,
      verified_claims: verifiedClaims || 0,
      debunked_claims: debunkedClaims || 0,
      misleading_claims: misleadingClaims || 0,
      verification_rate: totalClaims ? Math.round(((verifiedClaims || 0) / totalClaims) * 100) : 0,
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('Get claim stats error:', error)
    return { data: null, error: 'Failed to get claim statistics' }
  }
}

export async function searchClaims(query: string, page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('claims')
      .select(`
        *,
        submitted_by_profile:profiles!claims_submitted_by_fkey (
          full_name,
          email
        )
      `, { count: 'exact' })
      .or(`claim.ilike.%${query}%,source.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Search claims error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Search claims error:', error)
    return { data: null, error: 'Failed to search claims', count: 0 }
  }
}

export async function getClaimCategories() {
  try {
    const { data, error } = await supabase
      .from('claims')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('Get claim categories error:', error)
      return { data: null, error: error.message }
    }

    // Extract unique categories
    const categories = [...new Set(data?.map(claim => claim.category).filter(Boolean) || [])]

    return { data: categories, error: null }
  } catch (error) {
    console.error('Get claim categories error:', error)
    return { data: null, error: 'Failed to get claim categories' }
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