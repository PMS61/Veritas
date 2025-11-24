'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { FeedItem, FeedItemInsert, FeedItemUpdate } from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const createFeedItemSchema = z.object({
  source_id: z.string().uuid().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  platform: z.string().optional(),
  author: z.string().optional(),
  url: z.string().url('Invalid URL').optional().nullable(),
  engagement: z.number().default(0),
  sentiment: z.number().min(-1).max(1).optional(),
  risk_level: z.string().optional(),
  verified: z.boolean().default(false),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.any().default({}),
})

const updateFeedItemSchema = z.object({
  source_id: z.string().uuid().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters').optional(),
  platform: z.string().optional(),
  author: z.string().optional(),
  url: z.string().url('Invalid URL').optional().nullable(),
  engagement: z.number().optional(),
  sentiment: z.number().min(-1).max(1).optional(),
  risk_level: z.string().optional(),
  verified: z.boolean().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional(),
})

// Server actions
export async function addFeedItem(formData: FormData) {
  try {
    const validatedFields = createFeedItemSchema.safeParse({
      source_id: formData.get('source_id'),
      content: formData.get('content'),
      platform: formData.get('platform'),
      author: formData.get('author'),
      url: formData.get('url'),
      engagement: parseInt(formData.get('engagement') as string || '0'),
      sentiment: parseFloat(formData.get('sentiment') as string),
      risk_level: formData.get('risk_level'),
      verified: formData.get('verified') === 'true',
      location: formData.get('location'),
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      metadata: JSON.parse(formData.get('metadata') as string || '{}'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const feedItemData: FeedItemInsert = validatedFields.data

    const { data, error } = await supabase
      .from('feed_items')
      .insert(feedItemData)
      .select()
      .single()

    if (error) {
      console.error('Add feed item error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    revalidatePath('/feed')
    return {
      data,
      success: true,
      message: 'Feed item added successfully.',
    }
  } catch (error) {
    console.error('Add feed item error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getFeedItems(
  filters: { source_id?: string; verified?: boolean; risk_level?: string } = {},
  page: number = 1,
  pageSize: number = 50
) {
  try {
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('feed_items')
      .select(`
        *,
        sources!feed_items_source_id_fkey (
          name,
          type
        )
      `, { count: 'exact' })

    if (filters.source_id) {
      query = query.eq('source_id', filters.source_id)
    }
    if (filters.verified !== undefined) {
      query = query.eq('verified', filters.verified)
    }
    if (filters.risk_level) {
      query = query.eq('risk_level', filters.risk_level)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Get feed items error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get feed items error:', error)
    return { data: null, error: 'Failed to get feed items', count: 0 }
  }
}

export async function updateFeedItem(id: string, formData: FormData) {
  try {
    const validatedFields = updateFeedItemSchema.safeParse({
      source_id: formData.get('source_id'),
      content: formData.get('content'),
      platform: formData.get('platform'),
      author: formData.get('author'),
      url: formData.get('url'),
      engagement: parseInt(formData.get('engagement') as string),
      sentiment: parseFloat(formData.get('sentiment') as string),
      risk_level: formData.get('risk_level'),
      verified: formData.get('verified') === 'true',
      location: formData.get('location'),
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      metadata: JSON.parse(formData.get('metadata') as string || '{}'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check all fields.',
        success: false,
      }
    }

    const updateData: FeedItemUpdate = validatedFields.data

    const { data, error } = await supabase
      .from('feed_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update feed item error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    revalidatePath(`/feed/${id}`)
    return {
      data,
      success: true,
      message: 'Feed item updated successfully.',
    }
  } catch (error) {
    console.error('Update feed item error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function getFeedItem(id: string) {
  try {
    const { data, error } = await supabase
      .from('feed_items')
      .select(`
        *,
        sources!feed_items_source_id_fkey (
          name,
          type,
          url
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get feed item error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get feed item error:', error)
    return { data: null, error: 'Failed to get feed item' }
  }
}