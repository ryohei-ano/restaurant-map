import { Restaurant, Reaction } from '@/types/map'

export const dummyRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '太田胃酸さんラーメン',
    description: '昔ながらの太田胃散が入った醤油ラーメンが自慢の老舗店。',
    address: '東京都千代田区丸の内1-1-1',
    phone: '03-1234-5678',
    area: '渋谷',
    category: 'spicy',
    level: 3,
    google_map_url: 'https://maps.google.com/?q=35.6895,139.6917',
    x_position: 45.0,
    y_position: 25.0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'カフェ・ド・太田胃酸',
    description: 'こだわりの太田胃散コーヒーと手作り太田胃散ケーキが楽しめるカフェ。',
    address: '東京都渋谷区渋谷2-21-1',
    phone: '03-2345-6789',
    area: '渋谷',
    category: 'sweet',
    level: 4,
    google_map_url: 'https://maps.google.com/?q=35.6762,139.6503',
    x_position: 55.0,
    y_position: 35.0,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '太田胃酸寿司',
    description: '新鮮な太田胃散と職人の技が光る本格江戸前寿司店。ネタは太田胃散のみ。',
    address: '東京都中央区銀座4-5-6',
    phone: '03-3456-7890',
    area: '渋谷',
    category: 'oily',
    level: 2,
    google_map_url: 'https://maps.google.com/?q=35.6586,139.7454',
    x_position: 40.0,
    y_position: 45.0,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'イタリアン太田胃酸',
    description: '本場イタリアの味を再現したパスタとピザが人気。ワインの種類も豊富。',
    address: '東京都台東区上野3-15-1',
    phone: '03-4567-8901',
    area: '渋谷',
    category: 'spicy',
    level: 4,
    google_map_url: 'https://maps.google.com/?q=35.6654,139.7707',
    x_position: 60.0,
    y_position: 50.0,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: '太田胃酸焼肉',
    description: 'A5ランクの和牛を使用した高級焼肉店。特製太田胃散タレが絶品。',
    address: '東京都港区六本木6-10-1',
    phone: '03-5678-9012',
    area: '渋谷',
    category: 'oily',
    level: 5,
    google_map_url: 'https://maps.google.com/?q=35.6580,139.7016',
    x_position: 35.0,
    y_position: 60.0,
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
