/**
 * Yahoo店舗IDを自動取得して stores.json を更新するスクリプト
 * 
 * 使用方法:
 * node scripts/update-yahoo-ids.js
 */

const fs = require('fs')
const path = require('path')

// .env.localファイルを手動で読み込み
const envPath = path.join(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  envLines.forEach(line => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=')
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
}

// Yahoo API設定（環境変数から取得）
const YAHOO_CLIENT_ID = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID

if (!YAHOO_CLIENT_ID) {
  console.error('❌ NEXT_PUBLIC_YAHOO_CLIENT_ID が設定されていません')
  console.log('📝 .env.local ファイルにYahoo Client IDを設定してください')
  process.exit(1)
}

// 渋谷の座標
const SHIBUYA_COORDS = {
  lat: 35.6581,
  lng: 139.7014
}

/**
 * Yahoo APIで店舗検索
 */
async function searchYahooStores(query, lat, lng) {
  try {
    const params = new URLSearchParams({
      appid: YAHOO_CLIENT_ID,
      query: query,
      results: '5',
      sort: 'score',
      output: 'json'
    })

    if (lat && lng) {
      params.append('lat', lat.toString())
      params.append('lon', lng.toString())
      params.append('dist', '2') // 2km圏内
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

    return data.Feature.map((feature) => ({
      id: feature.Id || '',
      name: feature.Name || '',
      description: feature.Description || '',
      address: feature.Property?.Address || '',
      category: feature.Property?.Genre?.[0]?.Name || ''
    }))
  } catch (error) {
    console.error('Yahoo API search error:', error)
    return []
  }
}

/**
 * 店舗名からYahoo店舗IDを取得
 */
async function getYahooStoreId(storeName) {
  console.log(`🔍 検索中: ${storeName}`)
  
  const results = await searchYahooStores(storeName, SHIBUYA_COORDS.lat, SHIBUYA_COORDS.lng)
  
  if (results.length > 0) {
    const match = results[0]
    console.log(`✅ 見つかりました: ${match.name} (ID: ${match.id})`)
    return match.id
  } else {
    console.log(`❌ 見つかりませんでした: ${storeName}`)
    return null
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Yahoo店舗ID取得を開始します...\n')
  
  // stores.json を読み込み
  const storesPath = path.join(__dirname, '../src/data/stores.json')
  const storesData = JSON.parse(fs.readFileSync(storesPath, 'utf8'))
  
  console.log(`📊 ${storesData.length}件の店舗を処理します\n`)
  
  // 辛カテゴリーの店舗のみ処理
  const spicyStores = storesData.filter(store => store.category === 'spicy' && store.area === 'shibuya')
  
  console.log(`🌶️ 辛カテゴリー店舗: ${spicyStores.length}件\n`)
  
  // 各店舗のYahoo店舗IDを取得
  for (let i = 0; i < spicyStores.length; i++) {
    const store = spicyStores[i]
    
    console.log(`[${i + 1}/${spicyStores.length}]`)
    
    // 既にYahoo店舗IDがある場合はスキップ
    if (store.yahooStoreId) {
      console.log(`⏭️  スキップ: ${store.name} (既にID設定済み)\n`)
      continue
    }
    
    const yahooId = await getYahooStoreId(store.name)
    
    if (yahooId) {
      // stores.json内の該当店舗を更新
      const storeIndex = storesData.findIndex(s => s.id === store.id)
      if (storeIndex !== -1) {
        storesData[storeIndex].yahooStoreId = yahooId
      }
    }
    
    // API制限を考慮して待機
    if (i < spicyStores.length - 1) {
      console.log('⏳ 1秒待機中...\n')
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  // 更新されたデータを保存
  fs.writeFileSync(storesPath, JSON.stringify(storesData, null, 2), 'utf8')
  
  console.log('✅ stores.json を更新しました!')
  
  // 結果サマリー
  const updatedStores = storesData.filter(store => store.yahooStoreId)
  console.log(`\n📈 結果サマリー:`)
  console.log(`- 総店舗数: ${storesData.length}`)
  console.log(`- Yahoo ID設定済み: ${updatedStores.length}`)
  console.log(`- 設定率: ${Math.round((updatedStores.length / storesData.length) * 100)}%`)
}

// スクリプト実行
main().catch(console.error)
