// エリアとカテゴリの型定義
export type Area = string // エリアはテキストで管理
export type Category = 'spicy' | 'oily' | 'sweet'

// Supabaseのレストランテーブルに対応する型（シンプル版）
export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  phone: string
  area: string
  category: Category
  level: number // 0-5のカテゴリレベル
  google_map_url?: string
  x_position?: number // 相対位置（0-100%）
  y_position?: number // 相対位置（0-100%）
  created_at: string
  updated_at: string
}

// カテゴリ表示設定
export interface CategoryConfig {
  category: Category
  label: string
  color: string
  emoji: string
}

// レベル表示用のヘルパー関数の型
export interface LevelDisplay {
  emoji: string
  count: number
  text: string
}

// 地図データ（後方互換性のため残す）
export interface MapData {
  area: string
  imagePath: string
  pins: Restaurant[]
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
  area: string
  category: Category
  address?: string
  description?: string
}

// 既存のMapPin型（削除予定）
export interface MapPin {
  id: string
  restaurant_id: string
  area_id: string
  x_position: number
  y_position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// 既存のReaction型（削除予定）
export interface Reaction {
  id: string
  restaurant_id: string
  reaction_type: 'like' | 'bad'
  count: number
  created_at: string
  updated_at: string
}
