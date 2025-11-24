'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Source, SourceInsert, SourceUpdate } from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const createSourceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.string().min(1, 'Type is required'),
  url: z.string().url('Invalid URL').optional().nullable(),
  enabled: z.boolean().default(true),
  api_key: z.string().optional(),
  config: z.any().default({}),
})

const updateSourceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  type: z.string().min(1, 'Type is required').optional(),
  url: z.string().url('Invalid URL').optional().nullable(),
  enabled: z.boolean().optional(),
  api_key: z.string().optional(),
  config: z.any().optional(),
})

// Server actions
export async function createSource(formData: FormData) {
  try {
    const validatedFields = createSourceSchema.safeParse({
      name: formData.get('name'),
      type: formData.get('type'),
      url: formData.get('url'),
      enabled: formData.get('enabled') === 'true',
      api_key: formData.get('api_key'),
      config: JSON.parse(formData.get('config') as string || '{}'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const sourceData: SourceInsert = validatedFields.data

    const { data, error } = await supabase
      .from('sources')
      .insert(sourceData)
      .select()
      .single()

    if (error) {
      console.error('Create source error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    revalidatePath('/admin/sources')
    return {
      data,
      success: true,
      message: 'Source created successfully.',
    }
  } catch (error) {
    console.error('Create source error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getSources(filters: { type?: string; enabled?: boolean } = {}) {
  try {
    let query = supabase
      .from('sources')
      .select('*')

    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.enabled !== undefined) {
      query = query.eq('enabled', filters.enabled)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Get sources error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get sources error:', error)
    return { data: null, error: 'Failed to get sources' }
  }
}

export async function updateSource(id: string, formData: FormData) {
  try {
    const validatedFields = updateSourceSchema.safeParse({
      name: formData.get('name'),
      type: formData.get('type'),
      url: formData.get('url'),
      enabled: formData.get('enabled') === 'true',
      api_key: formData.get('api_key'),
      config: JSON.parse(formData.get('config') as string || '{}'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const updateData: SourceUpdate = validatedFields.data

    const { data, error } = await supabase
      .from('sources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update source error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    revalidatePath(`/admin/sources/${id}`)
    return {
      data,
      success: true,
      message: 'Source updated successfully.',
    }
  } catch (error) {
    console.error('Update source error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function toggleSource(id: string, enabled: boolean) {
  try {
    const { data, error } = await supabase
      .from('sources')
      .update({ enabled, status: enabled ? 'active' : 'inactive' })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Toggle source error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    revalidatePath('/admin/sources')
    return {
      data,
      success: true,
      message: `Source ${enabled ? 'enabled' : 'disabled'} successfully.`,
    }
  } catch (error) {
    console.error('Toggle source error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}