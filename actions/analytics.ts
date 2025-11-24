'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  AnalyticsEvent,
  AnalyticsEventInsert,
  AnalyticsFilter
} from '@/lib/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const trackEventSchema = z.object({
  event_type: z.string().min(1, 'Event type is required'),
  event_category: z.string().optional(),
  user_id: z.string().uuid().optional(),
  data: z.any().default({}),
})

const timeRangeSchema = z.object({
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
})

// Server actions
export async function trackEvent(formData: FormData, userId?: string) {
  try {
    const validatedFields = trackEventSchema.safeParse({
      event_type: formData.get('event_type'),
      event_category: formData.get('event_category'),
      user_id: userId || formData.get('user_id'),
      data: JSON.parse(formData.get('data') as string || '{}'),
    })

    if (!validatedFields.success) {
      return {
        error: 'Invalid event data.',
        success: false,
      }
    }

    const eventData: AnalyticsEventInsert = validatedFields.data

    const { data, error } = await supabase
      .from('analytics_events')
      .insert(eventData)
      .select()
      .single()

    if (error) {
      console.error('Track event error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    // Don't log audit events for analytics events to avoid circular logging
    revalidatePath('/analytics')
    return {
      data,
      success: true,
      message: 'Event tracked successfully.',
    }
  } catch (error) {
    console.error('Track event error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function trackCustomEvent(
  eventType: string,
  eventCategory?: string,
  userId?: string,
  data?: any
) {
  try {
    const eventData: AnalyticsEventInsert = {
      event_type: eventType,
      event_category: eventCategory || null,
      user_id: userId || null,
      data: data || {},
    }

    const { data: result, error } = await supabase
      .from('analytics_events')
      .insert(eventData)
      .select()
      .single()

    if (error) {
      console.error('Track custom event error:', error)
      return { data: null, error: error.message }
    }

    return { data: result, error: null }
  } catch (error) {
    console.error('Track custom event error:', error)
    return { data: null, error: 'Failed to track custom event' }
  }
}

export async function getAnalyticsOverview(timeRange: { start_date: string; end_date: string }) {
  try {
    const validatedFields = timeRangeSchema.safeParse(timeRange)

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid time range provided.',
      }
    }

    const { start_date, end_date } = validatedFields.data

    const [
      { count: totalEvents },
      { data: eventTypes },
      { data: dailyEvents },
      { data: topUsers },
    ] = await Promise.all([
      supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', start_date)
        .lte('created_at', end_date),

      supabase
        .from('analytics_events')
        .select('event_type')
        .gte('created_at', start_date)
        .lte('created_at', end_date),

      supabase.rpc('get_daily_analytics', {
        start_date,
        end_date,
      }),

      supabase
        .from('analytics_events')
        .select('user_id, profiles!inner(full_name)')
        .eq('user_id', supabase.from('profiles').select('id'))
        .gte('created_at', start_date)
        .lte('created_at', end_date)
        .limit(10),
    ])

    // Process event types
    const eventTypeCount = eventTypes?.reduce((acc: Record<string, number>, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {}) || {}

    const overview = {
      total_events: totalEvents || 0,
      event_types: eventTypeCount,
      daily_events: dailyEvents || [],
      top_users: topUsers || [],
      time_range: { start_date, end_date },
    }

    return { data: overview, error: null }
  } catch (error) {
    console.error('Get analytics overview error:', error)
    return { data: null, error: 'Failed to get analytics overview' }
  }
}

export async function getTimeSeriesData(
  timeRange: { start_date: string; end_date: string },
  granularity: 'hour' | 'day' | 'week' = 'day'
) {
  try {
    const validatedFields = timeRangeSchema.safeParse(timeRange)

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid time range provided.',
      }
    }

    const { start_date, end_date } = validatedFields.data

    const { data, error } = await supabase.rpc('get_time_series_analytics', {
      start_date,
      end_date,
      granularity,
    })

    if (error) {
      console.error('Get time series data error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get time series data error:', error)
    return { data: null, error: 'Failed to get time series data' }
  }
}

export async function getSourceDistribution(timeRange: { start_date: string; end_date: string }) {
  try {
    const validatedFields = timeRangeSchema.safeParse(timeRange)

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid time range provided.',
      }
    }

    const { start_date, end_date } = validatedFields.data

    const { data, error } = await supabase
      .from('analytics_events')
      .select('data')
      .gte('created_at', start_date)
      .lte('created_at', end_date)
      .like('data', '%source%')

    if (error) {
      console.error('Get source distribution error:', error)
      return { data: null, error: error.message }
    }

    // Extract sources from event data
    const sources = data?.reduce((acc: Record<string, number>, event) => {
      const source = event.data?.source || 'unknown'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {}) || {}

    return { data: sources, error: null }
  } catch (error) {
    console.error('Get source distribution error:', error)
    return { data: null, error: 'Failed to get source distribution' }
  }
}

export async function getCategoryBreakdown(timeRange: { start_date: string; end_date: string }) {
  try {
    const validatedFields = timeRangeSchema.safeParse(timeRange)

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid time range provided.',
      }
    }

    const { start_date, end_date } = validatedFields.data

    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_category')
      .gte('created_at', start_date)
      .lte('created_at', end_date)
      .not('event_category', 'is', null)

    if (error) {
      console.error('Get category breakdown error:', error)
      return { data: null, error: error.message }
    }

    const categories = data?.reduce((acc: Record<string, number>, event) => {
      const category = event.event_category || 'unknown'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {}) || {}

    return { data: categories, error: null }
  } catch (error) {
    console.error('Get category breakdown error:', error)
    return { data: null, error: 'Failed to get category breakdown' }
  }
}

export async function getGeographicData(timeRange: { start_date: string; end_date: string }) {
  try {
    const validatedFields = timeRangeSchema.safeParse(timeRange)

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid time range provided.',
      }
    }

    const { start_date, end_date } = validatedFields.data

    const { data, error } = await supabase
      .from('analytics_events')
      .select('data')
      .gte('created_at', start_date)
      .lte('created_at', end_date)
      .like('data', '%location%')

    if (error) {
      console.error('Get geographic data error:', error)
      return { data: null, error: error.message }
    }

    // Extract locations from event data
    const locations = data?.reduce((acc: Record<string, number>, event) => {
      const location = event.data?.location || 'unknown'
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {}) || {}

    return { data: locations, error: null }
  } catch (error) {
    console.error('Get geographic data error:', error)
    return { data: null, error: 'Failed to get geographic data' }
  }
}

export async function getTrendAnalysis(timeRange: { start_date: string; end_date: string }) {
  try {
    const validatedFields = timeRangeSchema.safeParse(timeRange)

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid time range provided.',
      }
    }

    const { start_date, end_date } = validatedFields.data

    const { data, error } = await supabase.rpc('get_trending_topics', {
      start_date,
      end_date,
      limit: 10,
    })

    if (error) {
      console.error('Get trend analysis error:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get trend analysis error:', error)
    return { data: null, error: 'Failed to get trend analysis' }
  }
}

export async function getEvents(
  filters: AnalyticsFilter = {},
  page: number = 1,
  pageSize: number = 50
) {
  try {
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('analytics_events')
      .select(`
        *,
        profiles!analytics_events_user_id_fkey (
          full_name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.event_type) {
      query = query.eq('event_type', filters.event_type)
    }
    if (filters.event_category) {
      query = query.eq('event_category', filters.event_category)
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
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
      console.error('Get events error:', error)
      return { data: null, error: error.message, count: 0 }
    }

    return {
      data,
      error: null,
      count: count || 0,
      hasMore: (count || 0) > offset + pageSize,
    }
  } catch (error) {
    console.error('Get events error:', error)
    return { data: null, error: 'Failed to get events', count: 0 }
  }
}

export async function deleteOldEvents(daysOld: number = 90) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    const cutoffString = cutoffDate.toISOString()

    const { error } = await supabase
      .from('analytics_events')
      .delete()
      .lt('created_at', cutoffString)

    if (error) {
      console.error('Delete old events error:', error)
      return {
        error: error.message,
        success: false,
      }
    }

    return {
      success: true,
      message: `Deleted events older than ${daysOld} days successfully.`,
    }
  } catch (error) {
    console.error('Delete old events error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    }
  }
}

export async function exportAnalyticsData(
  format: 'json' | 'csv' = 'json',
  timeRange?: { start_date: string; end_date: string }
) {
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })

    if (timeRange) {
      const validatedFields = timeRangeSchema.safeParse(timeRange)
      if (validatedFields.success) {
        query = query
          .gte('created_at', timeRange.start_date)
          .lte('created_at', timeRange.end_date)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Export analytics data error:', error)
      return { data: null, error: error.message }
    }

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvHeader = 'id,event_type,event_category,user_id,created_at,data\n'
      const csvData = data?.map(event =>
        `${event.id},"${event.event_type}","${event.event_category}","${event.user_id}","${event.created_at}","${JSON.stringify(event.data).replace(/"/g, '""')}"`
      ).join('\n') || ''

      return { data: csvHeader + csvData, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Export analytics data error:', error)
    return { data: null, error: 'Failed to export analytics data' }
  }
}