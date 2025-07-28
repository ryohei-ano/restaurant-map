import { searchYahooStores } from './yahoo-api'
import { Store } from '@/types/map'

// 渋谷の座標
const SHIBUYA_COORDS = {
  lat: 35.6581,
  lng: 139.7014
}

/**
 * 店舗名からYahoo店舗IDを検索して取得
 */
export async function getYahooStoreIdByName(storeName: string, area: string = 'shibuya'): Promise<string | null> {
  try {
    // エリアに応じた座標を設定（現在は渋谷のみ）
    const coords = area === 'shibuya' ? SHIBUYA_COORDS : SHIBUYA_COORDS
    
    // Yahoo APIで検索
    const results = await searchYahooStores(storeName, coords.lat, coords.lng)
    
    if (results.length > 0) {
      // 最初の結果のIDを返す
      return results[0].id
    }
    
    return null
  } catch (error) {
    console.error(`Yahoo店舗ID取得エラー (${storeName}):`, error)
    return null
  }
}

/**
 * 複数の店舗のYahoo店舗IDを一括取得
 */
export async function mapStoreToYahooIds(stores: Store[]): Promise<{ [storeId: string]: string | null }> {
  const results: { [storeId: string]: string | null } = {}
  
  for (const store of stores) {
    console.log(`Yahoo店舗ID取得中: ${store.name}`)
    
    // API制限を考慮して少し待機
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const yahooId = await getYahooStoreIdByName(store.name, store.area)
    results[store.id] = yahooId
    
    if (yahooId) {
      console.log(`✓ ${store.name} -> ${yahooId}`)
    } else {
      console.log(`✗ ${store.name} -> 見つかりませんでした`)
    }
  }
  
  return results
}

/**
 * 店舗データにYahoo店舗IDを追加した新しい配列を生成
 */
export function addYahooIdsToStores(stores: Store[], yahooIdMap: { [storeId: string]: string | null }): Store[] {
  return stores.map(store => ({
    ...store,
    yahooStoreId: yahooIdMap[store.id] || undefined
  }))
}
