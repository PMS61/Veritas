import { NextRequest, NextResponse } from 'next/server'
import {
  createClaim,
  getClaims,
  getClaimStats,
  searchClaims
} from '@/actions/claims'
import { ClaimsFilter } from '@/lib/database/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search')

    // Build filters
    const filters: ClaimsFilter = {}
    if (searchParams.get('status')) filters.status = searchParams.get('status') as any
    if (searchParams.get('category')) filters.category = searchParams.get('category')
    if (searchParams.get('submitted_by')) filters.submitted_by = searchParams.get('submitted_by')
    if (searchParams.get('claim_type')) filters.claim_type = searchParams.get('claim_type') as any
    if (searchParams.get('location')) filters.location = searchParams.get('location')
    if (searchParams.get('date_from')) filters.date_from = searchParams.get('date_from')
    if (searchParams.get('date_to')) filters.date_to = searchParams.get('date_to')

    // Handle search vs filter
    if (search) {
      const result = await searchClaims(search, page, pageSize)
      return NextResponse.json(result)
    } else {
      const result = await getClaims(filters, page, pageSize)
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error('Claims GET error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to get claims' },
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

    const result = await createClaim(processedFormData)

    if (result.success) {
      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Claims POST error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to create claim' },
      { status: 500 }
    )
  }
}