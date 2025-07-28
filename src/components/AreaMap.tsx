'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Area, Category, Restaurant, MapPin, CategoryConfig, Reaction } from '@/types/map'
import RestaurantResponsiveModal from './RestaurantResponsiveModal'

// カテゴリ設定
const categoriesData: CategoryConfig[] = [
  {
    category: "spicy",
    label: "辛",
    color: "#ef4444",
    emoji: "🌶️"
  },
  {
    category: "oily",
    label: "油",
    color: "#eab308",
    emoji: "🍟"
  },
  {
    category: "sweet",
    label: "甘",
    color: "#ec4899",
    emoji: "🍰"
  }
]

// 仮のレストランデータ（後でSupabaseから取得）
const mockRestaurants: Restaurant[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "太田さんラーメン",
    description: "昔ながらの醤油ラーメンが自慢の老舗店。",
    latitude: 35.6595,
    longitude: 139.7006,
    address: "東京都渋谷区渋谷1-1-1",
    category: "spicy",
    area_id: "shibuya",
    phone: "03-1234-5678",
    opening_hours: "11:00-22:00",
    price_range: "¥500-¥1000",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "カフェ・ド・太田",
    description: "こだわりのコーヒーと手作りスイーツが楽しめるおしゃれなカフェ。",
    latitude: 35.6584,
    longitude: 139.7016,
    address: "東京都渋谷区渋谷2-21-1",
    category: "sweet",
    area_id: "shibuya",
    phone: "03-2345-6789",
    opening_hours: "8:00-20:00",
    price_range: "¥800-¥1500",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// 仮の地図ピンデータ（後でSupabaseから取得）
const mockMapPins: MapPin[] = [
  {
    id: "pin_1",
    restaurant_id: "550e8400-e29b-41d4-a716-446655440001",
    area_id: "shibuya",
    x_position: 45,
    y_position: 25,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "pin_2",
    restaurant_id: "550e8400-e29b-41d4-a716-446655440002",
    area_id: "shibuya",
    x_position: 55,
    y_position: 35,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

interface AreaMapProps {
  isDevelopment?: boolean
}

export default function AreaMap({ isDevelopment = false }: AreaMapProps) {
  // データ
  const [restaurants] = useState<Restaurant[]>(mockRestaurants)
  const [mapPins] = useState<MapPin[]>(mockMapPins)
  const [categories] = useState<CategoryConfig[]>(categoriesData)
  
  // 状態管理
  const [currentArea] = useState<Area>('shibuya') // 渋谷のみ
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['spicy', 'oily', 'sweet'])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reactions] = useState<Reaction[]>([]) // 仮のリアクションデータ
  const [loading, setLoading] = useState(false)
  
  // パン機能の状態
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  
  const mapRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // フィルタリングされたピンを取得
  const getFilteredPins = useCallback(() => {
    return mapPins.filter(pin => {
      const restaurant = restaurants.find(r => r.id === pin.restaurant_id)
      return restaurant && selectedCategories.includes(restaurant.category) && pin.is_active
    })
  }, [mapPins, restaurants, selectedCategories])

  // カテゴリの色を取得
  const getCategoryColor = (category: Category) => {
    const categoryConfig = categories.find(c => c.category === category)
    return categoryConfig?.color || '#ef4444'
  }

  // マウス/タッチイベントハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setLastPosition(mapPosition)
  }, [mapPosition])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setMapPosition({
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY
    })
  }, [isDragging, dragStart, lastPosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // タッチイベントハンドラー
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
    setLastPosition(mapPosition)
  }, [mapPosition])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    
    e.preventDefault()
    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y
    
    setMapPosition({
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY
    })
  }, [isDragging, dragStart, lastPosition])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ピンクリックハンドラー
  const handlePinClick = async (pin: MapPin, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const restaurant = restaurants.find(r => r.id === pin.restaurant_id)
    if (!restaurant) return
    
    setSelectedRestaurant(restaurant)
    setLoading(true)
    setIsModalOpen(true)
    
    
    setLoading(false)
  }

  // カテゴリフィルター切り替え
  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRestaurant(null)
  }

  // リアクションクリックハンドラー（仮実装）
  const handleReactionClick = (restaurantId: string, reactionType: 'like' | 'bad') => {
    console.log('Reaction clicked:', restaurantId, reactionType)
    // 後でSupabaseのリアクション更新機能を実装
  }

  const filteredPins = getFilteredPins()

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
        {/* コントロールパネル */}
        <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-lg p-4">
          {/* エリア表示 */}
          <div className="mb-4">
            <h3 className="text-sm font-bold mb-2">エリア</h3>
            <div className="px-3 py-1 rounded text-sm font-medium bg-blue-500 text-white">
              渋谷
            </div>
          </div>
          
          {/* カテゴリフィルター */}
          <div>
            <h3 className="text-sm font-bold mb-2">カテゴリフィルター</h3>
            <div className="flex gap-2 flex-wrap">
              {categories.map((categoryConfig) => (
                <button
                  key={categoryConfig.category}
                  onClick={() => toggleCategory(categoryConfig.category)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                    selectedCategories.includes(categoryConfig.category)
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={{
                    backgroundColor: selectedCategories.includes(categoryConfig.category)
                      ? categoryConfig.color
                      : undefined
                  }}
                >
                  <span>{categoryConfig.emoji}</span>
                  <span>{categoryConfig.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 地図表示 */}
        <div 
          ref={mapRef}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 地図イラスト */}
          <img
            ref={imageRef}
            src="/image/map01.webp"
            alt="渋谷地図イラスト"
            className="absolute min-w-full min-h-full object-cover select-none"
            style={{
              transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            draggable={false}
          />
          
          {/* ピン表示 */}
          {filteredPins.map((pin) => {
            const restaurant = restaurants.find(r => r.id === pin.restaurant_id)
            if (!restaurant) return null
            
            const image = imageRef.current
            if (!image) return null
            
            const imageRect = image.getBoundingClientRect()
            const mapRect = mapRef.current?.getBoundingClientRect()
            if (!mapRect) return null
            
            // ピンの絶対位置を計算
            const pinX = imageRect.left + (imageRect.width * pin.x_position / 100) - mapRect.left
            const pinY = imageRect.top + (imageRect.height * pin.y_position / 100) - mapRect.top
            
            const categoryColor = getCategoryColor(restaurant.category)
            
            return (
              <div
                key={pin.id}
                className="absolute z-10 cursor-pointer"
                style={{
                  left: `${pinX}px`,
                  top: `${pinY}px`,
                  transform: 'translate(-50%, -100%)'
                }}
                onClick={(e) => handlePinClick(pin, e)}
              >
                {/* ピンアイコン */}
                <div className="relative">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: categoryColor }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  {/* ピンの先端 */}
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                    style={{ borderTopColor: categoryColor }}
                  ></div>
                  
                  {/* ホバー時のタイトル表示 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {restaurant.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* モーダル */}
      <RestaurantResponsiveModal
        restaurant={selectedRestaurant}
        reactions={reactions}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReactionClick={handleReactionClick}
      />
    </>
  )
}
