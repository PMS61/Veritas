import { NextRequest, NextResponse } from 'next/server'
import { createAlert, getAlerts, getAlertStats } from '@/actions/alerts'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    // Build filters
    const filters: any = {}
    if (searchParams.get('severity')) filters.severity = searchParams.get('severity')
    if (searchParams.get('status')) filters.status = searchParams.get('status')
    if (searchParams.get('category')) filters.category = searchParams.get('category')
    if (searchParams.get('assigned_to')) filters.assigned_to = searchParams.get('assigned_to')
    if (searchParams.get('date_from')) filters.date_from = searchParams.get('date_from')
    if (searchParams.get('date_to')) filters.date_to = searchParams.get('date_to')

    const result = await getAlerts(filters, page, pageSize)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Alerts GET error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to get alerts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // For API calls, we might receive JSON instead of FormData
    let processedFormData = formData

    if (request.headers.get('content-type')?.includes('application/json')) {
      const jsonData = await request.json()
      processedFormData = new FormData()

      Object.entries(jsonData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          processedFormData.set(key, JSON.stringify(value))
        } else if (typeof value === 'object' && value !== null) {
          processedFormData.set(key, JSON.stringify(value))
        } else {
          processedFormData.set(key, String(value))
        }
      })
    }

    // Get user ID from request headers for audit logging
    const userId = request.headers.get('x-user-id')

    const result = await createAlert(processedFormData, userId || undefined)

    if (result.success) {
      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Alerts POST error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}