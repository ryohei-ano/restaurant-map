import { Restaurant, Reaction } from '@/types/map'

export const dummyRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '太田胃酸さんラーメン',
    description: '昔ながらの太田胃散が入った醤油ラーメンが自慢の老舗店。',
    latitude: 35.6895,
    longitude: 139.6917,
    address: '東京都千代田区丸の内1-1-1',
    category: 'spicy',
    area_id: 'shibuya',
    phone: '03-1234-5678',
    opening_hours: '11:00-22:00',
    price_range: '¥500-¥1000',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'カフェ・ド・太田胃酸',
    description: 'こだわりの太田胃散コーヒーと手作り太田胃散ケーキが楽しめるカフェ。',
    latitude: 35.6762,
    longitude: 139.6503,
    address: '東京都渋谷区渋谷2-21-1',
    category: 'sweet',
    area_id: 'shibuya',
    phone: '03-2345-6789',
    opening_hours: '8:00-20:00',
    price_range: '¥800-¥1500',
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '太田胃酸寿司',
    description: '新鮮な太田胃散と職人の技が光る本格江戸前寿司店。ネタは太田胃散のみ。',
    latitude: 35.6586,
    longitude: 139.7454,
    address: '東京都中央区銀座4-5-6',
    category: 'oily',
    area_id: 'shibuya',
    phone: '03-3456-7890',
    opening_hours: '17:00-23:00',
    price_range: '¥3000-¥8000',
    is_active: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'イタリアン太田胃酸',
    description: '本場イタリアの味を再現したパスタとピザが人気。ワインの種類も豊富。',
    latitude: 35.6654,
    longitude: 139.7707,
    address: '東京都台東区上野3-15-1',
    category: 'spicy',
    area_id: 'shibuya',
    phone: '03-4567-8901',
    opening_hours: '11:30-22:00',
    price_range: '¥1500-¥3000',
    is_active: true,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: '太田胃酸焼肉',
    description: 'A5ランクの和牛を使用した高級焼肉店。特製太田胃散タレが絶品。',
    latitude: 35.6580,
    longitude: 139.7016,
    address: '東京都港区六本木6-10-1',
    category: 'oily',
    area_id: 'shibuya',
    phone: '03-5678-9012',
    opening_hours: '17:00-24:00',
    price_range: '¥4000-¥10000',
    is_active: true,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  }
]

export const dummyReactions: Reaction[] = [
  { 
    id: '1', 
    restaurant_id: '1', 
    reaction_type: 'like', 
    count: 42,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  { 
    id: '2', 
    restaurant_id: '1', 
    reaction_type: 'bad', 
    count: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  { 
    id: '3', 
    restaurant_id: '2', 
    reaction_type: 'like', 
    count: 28,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  { 
    id: '4', 
    restaurant_id: '2', 
    reaction_type: 'bad', 
    count: 1,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  { 
    id: '5', 
    restaurant_id: '3', 
    reaction_type: 'like', 
    count: 67,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  },
  { 
    id: '6', 
    restaurant_id: '3', 
    reaction_type: 'bad', 
    count: 2,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  },
  { 
    id: '7', 
    restaurant_id: '4', 
    reaction_type: 'like', 
    count: 35,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z'
  },
  { 
    id: '8', 
    restaurant_id: '4', 
    reaction_type: 'bad', 
    count: 5,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z'
  },
  { 
    id: '9', 
    restaurant_id: '5', 
    reaction_type: 'like', 
    count: 89,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  },
  { 
    id: '10', 
    restaurant_id: '5', 
    reaction_type: 'bad', 
    count: 7,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  }
]
