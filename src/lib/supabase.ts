import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型定義
export interface Restaurant {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  address: string
  category: string
  created_at: string
}

export interface Reaction {
  id: string
  restaurant_id: string
  reaction_type: 'like' | 'bad'
  count: number
}
