// エリアとカテゴリの型定義
export type Area = 'shibuya'
export type Category = 'spicy' | 'oily' | 'sweet'

// Supabaseのレストランテーブルに対応する型
export interface Restaurant {
  id: string
  name: string
  description?: string
  latitude?: number
  longitude?: number
  address: string
  category: Category
  area_id: Area
  google_place_id?: string
  phone?: string
  website_url?: string
  opening_hours?: string
  price_range?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Supabaseのエリアテーブルに対応する型
export interface AreaInfo {
  id: Area
  name: string
  description?: string
  image_path?: string
  is_active: boolean
  created_at: string
}

// Supabaseの地図ピンテーブルに対応する型
export interface MapPin {
  id: string
  restaurant_id: string
  area_id: Area
  x_position: number // 相対位置（0-100%）
  y_position: number // 相対位置（0-100%）
  is_active: boolean
  created_at: string
  updated_at: string
}

// Supabaseのリアクションテーブルに対応する型
export interface Reaction {
  id: string
  restaurant_id: string
  reaction_type: 'like' | 'bad'
  count: number
  created_at: string
  updated_at: string
}

// 地図データ
export interface MapData {
  area: Area
  imagePath: string
  pins: MapPin[]
}


// カテゴリ表示設定
export interface CategoryConfig {
  category: Category
  label: string
  color: string
  emoji: string
}

// 既存のmap-pins.jsonとの互換性のための型（削除予定）
export interface LegacyMapPin {
  id: string
  x: number
  y: number
  title: string
  category: string
  description: string
  address: string
}

// 既存のStore型（削除予定）
export interface Store {
  id: string
  name: string
  area: Area
  category: Category
  address?: string
  description?: string
}
