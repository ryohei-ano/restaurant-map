import { YahooStoreInfo } from '@/types/map'

const YAHOO_CLIENT_ID = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID

export async function searchYahooStores(query: string, lat?: number, lng?: number): Promise<YahooStoreInfo[]> {
  if (!YAHOO_CLIENT_ID) {
    console.error('Yahoo Client ID is not configured')
    return []
  }

  try {
    const params = new URLSearchParams({
      appid: YAHOO_CLIENT_ID,
      query: query,
      results: '10',
      sort: 'score',
      output: 'json'
    })

    if (lat && lng) {
      params.append('lat', lat.toString())
      params.append('lon', lng.toString())
      params.append('dist', '3') // 3km圏内
    }

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
    
    if (!data.Feature || !Array.isArray(data.Feature)) {
      return []
    }

    return data.Feature.map((feature: any) => ({
      id: feature.Id || '',
      name: feature.Name || '',
      description: feature.Description || '',
      address: feature.Property?.Address || '',
      category: feature.Property?.Genre?.[0]?.Name || '',
      phone: feature.Property?.Tel1 || '',
      url: feature.Property?.Url || '',
      rating: feature.Property?.Rating || 0,
      reviewCount: feature.Property?.ReviewCount || 0
    }))
  } catch (error) {
    console.error('Yahoo API search error:', error)
    return []
  }
}

export async function getYahooStoreById(storeId: string): Promise<YahooStoreInfo | null> {
  try {
    const response = await fetch(`/api/yahoo-store/${storeId}`)

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Yahoo store not found: ${storeId}`)
        return null
      }
      throw new Error(`API error: ${response.status}`)
    }

    const storeInfo = await response.json()
    return storeInfo
  } catch (error) {
    console.error('Yahoo API get store error:', error)
    return null
  }
}
