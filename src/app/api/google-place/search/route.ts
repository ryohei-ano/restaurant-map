import { NextRequest, NextResponse } from 'next/server'
import { searchPlaceByName } from '@/lib/google-places-api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!name) {
    return NextResponse.json(
      { error: 'Name parameter is required' },
      { status: 400 }
    )
  }

  try {
    const location = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined
    const placeInfo = await searchPlaceByName(name, location)
    
    if (!placeInfo) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(placeInfo)
  } catch (error) {
    console.error('Google Places API error:', error)
    return NextResponse.json(
      { error: 'Failed to search place' },
      { status: 500 }
    )
  }
}
