import { Client, Language } from '@googlemaps/google-maps-services-js'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export interface GooglePlaceInfo {
  id: string
  name: string
  description?: string
  address: string
  category: string
  phone?: string
  website?: string
  rating?: number
  reviewCount?: number
  openingHours?: string[]
  priceLevel?: number
  photos?: string[]
  url?: string
}

export async function searchPlaceByName(name: string, location?: { lat: number; lng: number }): Promise<GooglePlaceInfo | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key is not configured')
  }

  const client = new Client({})

  try {
    // まずText Searchで店舗を検索
    const searchResponse = await client.textSearch({
      params: {
        query: name,
        location: location ? `${location.lat},${location.lng}` : '35.6594,139.7006', // デフォルトは渋谷
        radius: 1000, // 1km範囲
        key: GOOGLE_MAPS_API_KEY,
        language: Language.ja,
        region: 'jp'
      }
    })

    if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
      return null
    }

    const place = searchResponse.data.results[0]

    // Place Detailsで詳細情報を取得
    const detailsResponse = await client.placeDetails({
      params: {
        place_id: place.place_id!,
        key: GOOGLE_MAPS_API_KEY,
        language: Language.ja,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'formatted_phone_number',
          'website',
          'rating',
          'user_ratings_total',
          'opening_hours',
          'price_level',
          'photos',
          'types',
          'url'
        ]
      }
    })

    const details = detailsResponse.data.result

    // カテゴリを日本語に変換
    const getJapaneseCategory = (types: string[]): string => {
      const categoryMap: { [key: string]: string } = {
        'restaurant': 'レストラン',
        'food': '飲食店',
        'meal_takeaway': 'テイクアウト',
        'cafe': 'カフェ',
        'bar': 'バー',
        'bakery': 'ベーカリー',
        'meal_delivery': 'デリバリー',
        'japanese_restaurant': '和食',
        'chinese_restaurant': '中華料理',
        'italian_restaurant': 'イタリアン',
        'french_restaurant': 'フレンチ',
        'korean_restaurant': '韓国料理',
        'thai_restaurant': 'タイ料理',
        'indian_restaurant': 'インド料理'
      }

      for (const type of types) {
        if (categoryMap[type]) {
          return categoryMap[type]
        }
      }
      return 'レストラン'
    }

    // 営業時間を文字列に変換
    const formatOpeningHours = (openingHours?: any): string => {
      if (!openingHours?.weekday_text) return ''
      return openingHours.weekday_text.join('\n')
    }

    // 価格レベルを文字列に変換
    const formatPriceLevel = (priceLevel?: number): string => {
      if (!priceLevel) return ''
      const levels = ['', '¥', '¥¥', '¥¥¥', '¥¥¥¥']
      return levels[priceLevel] || ''
    }

    const placeInfo: GooglePlaceInfo = {
      id: details.place_id || '',
      name: details.name || '',
      address: details.formatted_address || '',
      category: getJapaneseCategory(details.types || []),
      phone: details.formatted_phone_number,
      website: details.website,
      rating: details.rating,
      reviewCount: details.user_ratings_total,
      openingHours: details.opening_hours?.weekday_text,
      priceLevel: details.price_level,
      url: details.url
    }

    return placeInfo
  } catch (error) {
    console.error('Google Places API error:', error)
    throw error
  }
}

// モックデータ（開発・テスト用）
const mockPlaceData: { [key: string]: GooglePlaceInfo } = {
  'ChIJKxjxuaNxGGARfW2k5IbpzUk': {
    id: 'ChIJKxjxuaNxGGARfW2k5IbpzUk',
    name: '八虎 渋谷店',
    address: '東京都渋谷区道玄坂2-25-17',
    category: '中華料理',
    phone: '03-3464-8888',
    website: 'https://example.com',
    rating: 4.2,
    reviewCount: 156,
    openingHours: [
      '月曜日: 11:30～15:00, 17:00～23:00',
      '火曜日: 11:30～15:00, 17:00～23:00',
      '水曜日: 11:30～15:00, 17:00～23:00',
      '木曜日: 11:30～15:00, 17:00～23:00',
      '金曜日: 11:30～15:00, 17:00～23:00',
      '土曜日: 11:30～23:00',
      '日曜日: 11:30～23:00'
    ],
    priceLevel: 2,
    url: 'https://maps.google.com/?cid=123456789'
  }
}

export async function getPlaceById(placeId: string): Promise<GooglePlaceInfo | null> {
  console.log('Fetching place details for:', placeId)

  // まずモックデータをチェック
  if (mockPlaceData[placeId]) {
    console.log('Using mock data for place:', placeId)
    return mockPlaceData[placeId]
  }

  // Google Maps APIキーが設定されていない場合はnullを返す
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key is not configured, using mock data only')
    return null
  }

  console.log('Using Google Maps API Key:', GOOGLE_MAPS_API_KEY ? 'Key is present' : 'Key is missing')

  const client = new Client({})

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        language: Language.ja,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'formatted_phone_number',
          'website',
          'rating',
          'user_ratings_total',
          'opening_hours',
          'price_level',
          'photos',
          'types',
          'url'
        ]
      }
    })

    const details = response.data.result

    const getJapaneseCategory = (types: string[]): string => {
      const categoryMap: { [key: string]: string } = {
        'restaurant': 'レストラン',
        'food': '飲食店',
        'meal_takeaway': 'テイクアウト',
        'cafe': 'カフェ',
        'bar': 'バー',
        'bakery': 'ベーカリー',
        'meal_delivery': 'デリバリー',
        'japanese_restaurant': '和食',
        'chinese_restaurant': '中華料理',
        'italian_restaurant': 'イタリアン',
        'french_restaurant': 'フレンチ',
        'korean_restaurant': '韓国料理',
        'thai_restaurant': 'タイ料理',
        'indian_restaurant': 'インド料理'
      }

      for (const type of types) {
        if (categoryMap[type]) {
          return categoryMap[type]
        }
      }
      return 'レストラン'
    }

    const placeInfo: GooglePlaceInfo = {
      id: details.place_id || '',
      name: details.name || '',
      address: details.formatted_address || '',
      category: getJapaneseCategory(details.types || []),
      phone: details.formatted_phone_number,
      website: details.website,
      rating: details.rating,
      reviewCount: details.user_ratings_total,
      openingHours: details.opening_hours?.weekday_text,
      priceLevel: details.price_level,
      url: details.url
    }

    return placeInfo
  } catch (error) {
    console.error('Google Places API error:', error)
    console.log('Falling back to mock data or returning null')
    return null
  }
}
