import { NextRequest, NextResponse } from 'next/server'
import { getClaim, updateClaim, updateClaimStatus, deleteClaim } from '@/actions/claims'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getClaim(params.id)

    if (result.error) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Claim GET error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to get claim' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const result = await updateClaim(params.id, processedFormData)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Claim PUT error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to update claim' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from request headers for audit logging
    const userId = request.headers.get('x-user-id') || 'system'

    const result = await deleteClaim(params.id, userId)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Claim DELETE error:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to delete claim' },
      { status: 500 }
    )
  }
}