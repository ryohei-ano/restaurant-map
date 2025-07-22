import { Restaurant, Reaction } from '@/lib/supabase'

export const dummyRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '太田胃酸さんラーメン',
    description: '昔ながらの太田胃散が入った醤油ラーメンが自慢の老舗店。',
    latitude: 35.6895,
    longitude: 139.6917,
    address: '東京都千代田区丸の内1-1-1',
    category: 'ラーメン',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'カフェ・ド・太田胃酸',
    description: 'こだわりの太田胃散コーヒーと手作り太田胃散ケーキが楽しめるカフェ。',
    latitude: 35.6762,
    longitude: 139.6503,
    address: '東京都渋谷区渋谷2-21-1',
    category: 'カフェ',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '太田胃酸寿司',
    description: '新鮮な太田胃散と職人の技が光る本格江戸前寿司店。ネタは太田胃散のみ。',
    latitude: 35.6586,
    longitude: 139.7454,
    address: '東京都中央区銀座4-5-6',
    category: '寿司',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'イタリアン太田胃酸',
    description: '本場イタリアの味を再現したパスタとピザが人気。ワインの種類も豊富。',
    latitude: 35.6654,
    longitude: 139.7707,
    address: '東京都台東区上野3-15-1',
    category: 'イタリアン',
    created_at: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: '太田胃酸焼肉',
    description: 'A5ランクの和牛を使用した高級焼肉店。特製太田胃散タレが絶品。',
    latitude: 35.6580,
    longitude: 139.7016,
    address: '東京都港区六本木6-10-1',
    category: '焼肉',
    created_at: '2024-01-05T00:00:00Z'
  }
]

export const dummyReactions: Reaction[] = [
  { id: '1', restaurant_id: '1', reaction_type: 'like', count: 42 },
  { id: '2', restaurant_id: '1', reaction_type: 'bad', count: 3 },
  { id: '3', restaurant_id: '2', reaction_type: 'like', count: 28 },
  { id: '4', restaurant_id: '2', reaction_type: 'bad', count: 1 },
  { id: '5', restaurant_id: '3', reaction_type: 'like', count: 67 },
  { id: '6', restaurant_id: '3', reaction_type: 'bad', count: 2 },
  { id: '7', restaurant_id: '4', reaction_type: 'like', count: 35 },
  { id: '8', restaurant_id: '4', reaction_type: 'bad', count: 5 },
  { id: '9', restaurant_id: '5', reaction_type: 'like', count: 89 },
  { id: '10', restaurant_id: '5', reaction_type: 'bad', count: 7 }
]
