import { NextRequest, NextResponse } from 'next/server'

const YAHOO_CLIENT_ID = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params

  if (!YAHOO_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Yahoo Client ID is not configured' },
      { status: 500 }
    )
  }

  if (!storeId) {
    return NextResponse.json(
      { error: 'Store ID is required' },
      { status: 400 }
    )
  }

  try {
    const params = new URLSearchParams({
      appid: YAHOO_CLIENT_ID,
      gid: storeId,
      output: 'json'
    })

    const response = await fetch(
      `https://map.yahooapis.jp/search/local/V1/localSearch?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Yahoo API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.Feature || !Array.isArray(data.Feature) || data.Feature.length === 0) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    const feature = data.Feature[0]
    const storeInfo = {
      id: feature.Id || '',
      name: feature.Name || '',
      description: feature.Description || '',
      address: feature.Property?.Address || '',
      category: feature.Property?.Genre?.[0]?.Name || '',
      phone: feature.Property?.Tel1 || '',
      url: feature.Property?.Url || '',
      rating: feature.Property?.Rating || 0,
      reviewCount: feature.Property?.ReviewCount || 0,
      openTime: feature.Property?.OpenTime || '',
      holiday: feature.Property?.Holiday || '',
      access: feature.Property?.Access || '',
      parking: feature.Property?.Parking || '',
      budget: feature.Property?.Budget || '',
      catchCopy: feature.Property?.CatchCopy || ''
    }

    return NextResponse.json(storeInfo)
  } catch (error) {
    console.error('Yahoo API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store information' },
      { status: 500 }
    )
  }
}
