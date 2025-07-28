import { NextRequest, NextResponse } from 'next/server'
import { getPlaceById } from '@/lib/google-places-api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params

  if (!placeId) {
    return NextResponse.json(
      { error: 'Place ID is required' },
      { status: 400 }
    )
  }

  try {
    const placeInfo = await getPlaceById(placeId)
    
    if (!placeInfo) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(placeInfo)
  } catch (error: any) {
    console.error('Google Places API error:', error)
    
    // より詳細なエラー情報を返す
    const errorMessage = error?.response?.data?.error_message || error?.message || 'Unknown error'
    const errorStatus = error?.response?.status || error?.status || 'Unknown status'
    
    console.error('Error details:', {
      message: errorMessage,
      status: errorStatus,
      response: error?.response?.data
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch place information',
        details: errorMessage,
        status: errorStatus
      },
      { status: 500 }
    )
  }
}
