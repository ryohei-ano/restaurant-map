'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Restaurant, Reaction } from '@/types/map'
import RestaurantResponsiveModal from './RestaurantResponsiveModal'

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

interface IllustrationMapProps {
  isDevelopment?: boolean
}

export default function IllustrationMap({ isDevelopment = false }: IllustrationMapProps) {
  const [pins, setPins] = useState<MapPin[]>([])
  const [restaurants] = useState<Restaurant[]>(mockRestaurants)
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // 編集モードの状態
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingPin, setEditingPin] = useState<MapPin | null>(null)
  const [showPinEditor, setShowPinEditor] = useState(false)
  const [isAddingPin, setIsAddingPin] = useState(false)
  
  // パン機能の状態
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  
  // ピンドラッグの状態
  const [isDraggingPin, setIsDraggingPin] = useState(false)
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null)
  const [pinDragStart, setPinDragStart] = useState({ x: 0, y: 0 })
  
  const mapRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // ピンデータの読み込み
  useEffect(() => {
    setPins(mockMapPins)
  }, [])

  // マウス/タッチイベントハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // ピンドラッグ中は地図のパンを無効にする
    if (isDraggingPin) return
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setLastPosition(mapPosition)
  }, [mapPosition, isDraggingPin])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // ピンドラッグ中は地図のパンを無効にする
    if (!isDragging || isDraggingPin) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setMapPosition({
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY
    })
  }, [isDragging, dragStart, lastPosition, isDraggingPin])

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

  // ピンドラッグ開始
  const handlePinMouseDown = (pin: MapPin, e: React.MouseEvent) => {
    if (!isEditMode || isAddingPin) return
    
    e.stopPropagation()
    setIsDraggingPin(true)
    setDraggingPinId(pin.id)
    setPinDragStart({ x: e.clientX, y: e.clientY })
  }

  // ピンドラッグ中
  const handlePinMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingPin || !draggingPinId) return
    
    const image = imageRef.current
    if (!image) return
    
    // 画像の実際の境界を取得
    const imageRect = image.getBoundingClientRect()
    
    // マウス位置を画像内の相対位置に変換
    const imageX = e.clientX - imageRect.left
    const imageY = e.clientY - imageRect.top
    
    // パーセンテージに変換
    const x = (imageX / imageRect.width) * 100
    const y = (imageY / imageRect.height) * 100
    
    // 範囲チェックして更新
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      setPins(prev => prev.map(pin => 
        pin.id === draggingPinId 
          ? { ...pin, x_position: Math.max(0, Math.min(100, x)), y_position: Math.max(0, Math.min(100, y)) }
          : pin
      ))
    }
  }, [isDraggingPin, draggingPinId])

  // ピンドラッグ終了
  const handlePinMouseUp = useCallback(() => {
    setIsDraggingPin(false)
    setDraggingPinId(null)
  }, [])

  // ピンクリックハンドラー
  const handlePinClick = async (pin: MapPin, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // ドラッグ中の場合はクリックイベントを無視
    if (isDraggingPin) return
    
    if (isEditMode && !isAddingPin) {
      // 編集モードの場合はピン編集
      setEditingPin(pin)
      setShowPinEditor(true)
    } else if (!isEditMode) {
      // プレビューモードの場合はモーダル表示
      setSelectedPin(pin)
      setLoading(true)
      setIsModalOpen(true)
      
      setLoading(false)
    }
  }

  // ピン追加モードの切り替え
  const toggleAddingPin = () => {
    setIsAddingPin(!isAddingPin)
    setShowPinEditor(false)
    setEditingPin(null)
  }

  // 編集モード時のピン追加機能
  const handleMapClick = useCallback((e: React.MouseEvent) => {
    if (!isDevelopment || !isEditMode || !isAddingPin || isDragging) return
    
    const image = imageRef.current
    if (!image) return
    
    // 画像の実際の境界を取得
    const imageRect = image.getBoundingClientRect()
    
    // クリック位置を画像内の相対位置に変換
    const imageX = e.clientX - imageRect.left
    const imageY = e.clientY - imageRect.top
    
    // パーセンテージに変換
    const x = (imageX / imageRect.width) * 100
    const y = (imageY / imageRect.height) * 100
    
    // 範囲チェック
    if (x < 0 || x > 100 || y < 0 || y > 100) return
    
    const newPin: MapPin = {
      id: Date.now().toString(),
      restaurant_id: restaurants[0]?.id || '',
      area_id: 'shibuya',
      x_position: Math.max(0, Math.min(100, x)),
      y_position: Math.max(0, Math.min(100, y)),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setPins(prev => [...prev, newPin])
    setEditingPin(newPin)
    setShowPinEditor(true)
    setIsAddingPin(false) // ピン追加後は追加モードを終了
    console.log('新しいピンを追加:', newPin, { clickX: imageX, clickY: imageY, imageRect })
  }, [isDevelopment, isEditMode, isAddingPin, isDragging, restaurants])

  // ピン削除機能
  const handleDeletePin = (pinId: string) => {
    setPins(prev => prev.filter(pin => pin.id !== pinId))
    setShowPinEditor(false)
    setEditingPin(null)
  }

  // ピン更新機能
  const handleUpdatePin = (updatedPin: MapPin) => {
    setPins(prev => prev.map(pin => pin.id === updatedPin.id ? updatedPin : pin))
    setShowPinEditor(false)
    setEditingPin(null)
  }

  // モード切り替え
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setShowPinEditor(false)
    setEditingPin(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPin(null)
  }

  // モーダル用のレストランデータ変換
  const getRestaurantData = () => {
    if (!selectedPin) return null
    
    return restaurants.find(r => r.id === selectedPin.restaurant_id) || null
  }

  return (
    <>
      <div 
        ref={mapRef}
        className="relative w-screen h-screen overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMove(e)
          handlePinMouseMove(e)
        }}
        onMouseUp={() => {
          handleMouseUp()
          handlePinMouseUp()
        }}
        onMouseLeave={() => {
          handleMouseUp()
          handlePinMouseUp()
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleMapClick}
      >
        {/* 地図イラスト */}
        <img
          ref={imageRef}
          src="/image/map01.webp"
          alt="地図イラスト"
          className="absolute min-w-full min-h-full object-cover select-none"
          style={{
            transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          draggable={false}
        />
        
        {/* ピン表示 */}
        {pins.map((pin) => {
          // 画像の実際のサイズと位置を取得してピンの絶対位置を計算
          const image = imageRef.current
          if (!image) return null
          
          const imageRect = image.getBoundingClientRect()
          const mapRect = mapRef.current?.getBoundingClientRect()
          if (!mapRect) return null
          
          // ピンの絶対位置を計算
          const pinX = imageRect.left + (imageRect.width * pin.x_position / 100) - mapRect.left
          const pinY = imageRect.top + (imageRect.height * pin.y_position / 100) - mapRect.top
          
          const restaurant = restaurants.find(r => r.id === pin.restaurant_id)
          
          return (
            <div
              key={pin.id}
              className={`absolute z-10 ${
                isEditMode && !isAddingPin ? 'cursor-move' : 'cursor-pointer'
              }`}
              style={{
                left: `${pinX}px`,
                top: `${pinY}px`,
                transform: 'translate(-50%, -100%)'
              }}
              onClick={(e) => handlePinClick(pin, e)}
              onMouseDown={(e) => handlePinMouseDown(pin, e)}
            >
              {/* ピンアイコン */}
              <div className="relative">
                <div className={`w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                  isDraggingPin && draggingPinId === pin.id ? 'opacity-75' : ''
                }`}>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                {/* ピンの先端 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                
                {/* ホバー時のタイトル表示 */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {restaurant?.name || 'レストラン'}
                </div>
              </div>
            </div>
          )
        })}
        
        {/* 開発モード時のコントロール */}
        {isDevelopment && (
          <>
            {/* モード切り替えボタン */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={toggleEditMode}
                  className={`px-4 py-2 rounded font-bold text-sm transition-colors ${
                    isEditMode
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isEditMode ? '編集モード' : 'プレビューモード'}
                </button>
              </div>
              
              {isEditMode && (
                <div className="flex gap-2">
                  <button
                    onClick={toggleAddingPin}
                    className={`px-4 py-2 rounded font-bold text-sm transition-colors ${
                      isAddingPin
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {isAddingPin ? 'ピン追加中...' : 'ピンを追加'}
                  </button>
                  {isAddingPin && (
                    <div className="bg-yellow-400 text-black px-3 py-2 rounded text-sm font-bold">
                      地図をクリックしてピンを配置
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ピンエディター */}
            {showPinEditor && editingPin && (
              <div className="absolute top-20 left-4 bg-white rounded-lg shadow-lg p-4 z-30 w-80">
                <h3 className="text-lg font-bold mb-4">ピン編集</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">レストラン選択</label>
                    <select
                      value={editingPin.restaurant_id}
                      onChange={(e) => setEditingPin({ ...editingPin, restaurant_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {restaurants.map((restaurant) => (
                        <option key={restaurant.id} value={restaurant.id}>
                          {restaurant.name} ({restaurant.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    位置: X={editingPin.x_position.toFixed(1)}%, Y={editingPin.y_position.toFixed(1)}%
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleUpdatePin(editingPin)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => handleDeletePin(editingPin.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    削除
                  </button>
                  <button
                    onClick={() => {
                      setShowPinEditor(false)
                      setEditingPin(null)
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* モーダル */}
      <RestaurantResponsiveModal
        restaurant={getRestaurantData()}
        reactions={[]} // イラスト地図では反応機能は使用しない
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReactionClick={() => {}} // 空の関数
      />
    </>
  )
}
