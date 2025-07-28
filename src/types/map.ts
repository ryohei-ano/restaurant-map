// エリアとカテゴリの型定義
export type Area = 'shibuya' | 'shinjuku' | 'shinbashi' | 'ikebukuro' | 'kanda'
export type Category = 'spicy' | 'oily' | 'sweet'

// 店舗マスターデータ
export interface Store {
  id: string
  name: string
  area: Area
  category: Category
  address?: string
  yahooStoreId?: string
  googlePlaceId?: string
  description?: string
}

// 地図ピン情報（座標のみ）
export interface MapPin {
  id: string
  storeId: string // 店舗マスターとの紐づけ
  x: number // 相対位置（0-100%）
  y: number // 相対位置（0-100%）
}

// 地図データ
export interface MapData {
  area: Area
  imagePath: string
  pins: MapPin[]
}

// Yahoo店舗情報
export interface YahooStoreInfo {
  id: string
  name: string
  description?: string
  address: string
  category: string
  phone?: string
  url?: string
  rating?: number
  reviewCount?: number
  openTime?: string
  holiday?: string
  access?: string
  parking?: string
  budget?: string
  catchCopy?: string
}

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

// カテゴリ表示設定
export interface CategoryConfig {
  category: Category
  label: string
  color: string
  emoji: string
}
