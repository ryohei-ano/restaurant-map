'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Area, Category, Restaurant, MapPin, CategoryConfig, Reaction } from '@/types/map'
import RestaurantResponsiveModal from './RestaurantResponsiveModal'
import { supabase } from '@/lib/supabase'
import { useMediaQuery } from '@/hooks/use-media-query'

// カテゴリ設定
const categoriesData: CategoryConfig[] = [
  {
    category: "spicy",
    label: "からい",
    color: "#ef4444",
    emoji: "🌶️"
  },
  {
    category: "oily",
    label: "あぶら",
    color: "#eab308",
    emoji: "🍟"
  },
  {
    category: "sweet",
    label: "あまい",
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
    address: "東京都渋谷区渋谷1-1-1",
    phone: "03-1234-5678",
    area: "渋谷",
    category: "spicy",
    level: 3,
    google_map_url: "https://maps.google.com/?q=35.6595,139.7006",
    x_position: 45.0,
    y_position: 25.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "カフェ・ド・太田",
    description: "こだわりのコーヒーと手作りスイーツが楽しめるおしゃれなカフェ。",
    address: "東京都渋谷区渋谷2-21-1",
    phone: "03-2345-6789",
    area: "渋谷",
    category: "sweet",
    level: 4,
    google_map_url: "https://maps.google.com/?q=35.6584,139.7016",
    x_position: 55.0,
    y_position: 35.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

interface AreaMapProps {
  isDevelopment?: boolean
}

export default function AreaMap({ }: AreaMapProps) {
  // データ
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [mapPins, setMapPins] = useState<MapPin[]>([])
  const [categories] = useState<CategoryConfig[]>(categoriesData)
  
  // localhost判定
  const [isLocalhost, setIsLocalhost] = useState(false)
  
  // デバイス判定（768px以下をモバイルとする）
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // 状態管理
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['spicy', 'oily', 'sweet'])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [reactions] = useState<Reaction[]>([]) // 仮のリアクションデータ
  
  // 編集モードの状態
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAddingPin, setIsAddingPin] = useState(false)
  const [editingPin, setEditingPin] = useState<MapPin | null>(null)
  const [showPinEditor, setShowPinEditor] = useState(false)
  
  // パン機能の状態
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  
  // ピンドラッグの状態
  const [isDraggingPin, setIsDraggingPin] = useState(false)
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // localhost判定
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1')
    }
  }, [])

  // 地図の初期位置を中央に設定
  useEffect(() => {
    const centerMap = () => {
      const mapContainer = mapRef.current
      if (!mapContainer) return
      
      const containerRect = mapContainer.getBoundingClientRect()
      
      // デバイスタイプに応じた拡大率を設定
      // モバイル: 1.7倍 (70%分のオフセット), PC: 1.2倍 (20%分のオフセット)
      const scale = isMobile ? 1.7 : 1.2
      const offsetRatio = (scale - 1) / 2
      const offsetX = -(containerRect.width * offsetRatio)
      const offsetY = -(containerRect.height * offsetRatio)
      
      setMapPosition({ x: offsetX, y: offsetY })
      setLastPosition({ x: offsetX, y: offsetY })
    }
    
    // 初期化時とリサイズ時に実行
    centerMap()
    window.addEventListener('resize', centerMap)
    
    return () => {
      window.removeEventListener('resize', centerMap)
    }
  }, [isMobile])

  // Supabaseからデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // レストランデータを取得（位置情報も含む）
        const { data: restaurantsData, error: restaurantsError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('area', '渋谷')
        
        if (restaurantsError) {
          console.warn('レストランデータの取得に失敗しました、モックデータを使用します:', restaurantsError.message)
          setRestaurants(mockRestaurants) // フォールバック
          // モックデータからピンを生成
          const mockPins = mockRestaurants.map(restaurant => ({
            id: `pin_${restaurant.id}`,
            restaurant_id: restaurant.id,
            area_id: 'shibuya',
            x_position: restaurant.x_position ?? 50,
            y_position: restaurant.y_position ?? 50,
            is_active: true,
            created_at: restaurant.created_at,
            updated_at: restaurant.updated_at
          }))
          setMapPins(mockPins)
        } else {
          setRestaurants(restaurantsData || mockRestaurants)
          // レストランデータからピンを生成
          const pins = (restaurantsData || []).map(restaurant => ({
            id: `pin_${restaurant.id}`,
            restaurant_id: restaurant.id,
            area_id: 'shibuya',
            x_position: restaurant.x_position ?? 50,
            y_position: restaurant.y_position ?? 50,
            is_active: true,
            created_at: restaurant.created_at,
            updated_at: restaurant.updated_at
          }))
          setMapPins(pins)
        }
      } catch (error) {
        console.warn('データ取得エラー、モックデータを使用します:', error)
        setRestaurants(mockRestaurants)
        const mockPins = mockRestaurants.map(restaurant => ({
          id: `pin_${restaurant.id}`,
          restaurant_id: restaurant.id,
          area_id: 'shibuya',
          x_position: restaurant.x_position ?? 50,
          y_position: restaurant.y_position ?? 50,
          is_active: true,
          created_at: restaurant.created_at,
          updated_at: restaurant.updated_at
        }))
        setMapPins(mockPins)
      }
    }
    
    fetchData()
  }, [])

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

  // カテゴリに応じたSVGファイルパスを取得
  const getCategorySvgPath = (category: Category) => {
    switch (category) {
      case 'spicy':
        return '/spicy.svg'
      case 'oily':
        return '/oil.svg'
      case 'sweet':
        return '/sweet.svg'
      default:
        return '/spicy.svg'
    }
  }

  // マウス/タッチイベントハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isDraggingPin) return
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setLastPosition(mapPosition)
  }, [mapPosition, isDraggingPin])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || isDraggingPin) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    const image = imageRef.current
    const mapContainer = mapRef.current
    if (!image || !mapContainer) return
    
    const imageRect = image.getBoundingClientRect()
    const containerRect = mapContainer.getBoundingClientRect()
    
    // 新しい位置を計算
    const newX = lastPosition.x + deltaX
    const newY = lastPosition.y + deltaY
    
    // 境界制限を計算
    const maxX = 0
    const minX = containerRect.width - imageRect.width
    const maxY = 0
    const minY = containerRect.height - imageRect.height
    
    // 境界内に制限
    const constrainedX = Math.max(minX, Math.min(maxX, newX))
    const constrainedY = Math.max(minY, Math.min(maxY, newY))
    
    setMapPosition({
      x: constrainedX,
      y: constrainedY
    })
  }, [isDragging, dragStart, lastPosition, isDraggingPin])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ピンドラッグ機能
  const handlePinMouseDown = (pin: MapPin, e: React.MouseEvent) => {
    if (!isEditMode || isAddingPin) return
    
    e.stopPropagation()
    setIsDraggingPin(true)
    setDraggingPinId(pin.id)
  }

  const handlePinMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingPin || !draggingPinId) return
    
    const image = imageRef.current
    if (!image) return
    
    const imageRect = image.getBoundingClientRect()
    const imageX = e.clientX - imageRect.left
    const imageY = e.clientY - imageRect.top
    
    const x = (imageX / imageRect.width) * 100
    const y = (imageY / imageRect.height) * 100
    
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      setMapPins(prev => prev.map(pin => 
        pin.id === draggingPinId 
          ? { ...pin, x_position: Math.max(0, Math.min(100, x)), y_position: Math.max(0, Math.min(100, y)) }
          : pin
      ))
    }
  }, [isDraggingPin, draggingPinId])

  const handlePinMouseUp = useCallback(async () => {
    if (isDraggingPin && draggingPinId) {
      const draggedPin = mapPins.find(pin => pin.id === draggingPinId)
      if (draggedPin) {
        try {
          // restaurantsテーブルの位置情報を更新
          const { error } = await supabase
            .from('restaurants')
            .update({
              x_position: draggedPin.x_position,
              y_position: draggedPin.y_position,
              updated_at: new Date().toISOString()
            })
            .eq('id', draggedPin.restaurant_id)
          
          if (error) {
            console.warn('ピン位置の更新に失敗しました:', error.message)
          } else {
            console.log('ピン位置を更新しました:', draggedPin.x_position, draggedPin.y_position)
            
            // ローカルのレストランデータも更新
            setRestaurants(prev => prev.map(restaurant => 
              restaurant.id === draggedPin.restaurant_id
                ? { ...restaurant, x_position: draggedPin.x_position, y_position: draggedPin.y_position }
                : restaurant
            ))
          }
        } catch (error) {
          console.warn('Supabase更新エラー:', error)
        }
      }
    }
    
    setIsDraggingPin(false)
    setDraggingPinId(null)
  }, [isDraggingPin, draggingPinId, mapPins])

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
    
    const image = imageRef.current
    const mapContainer = mapRef.current
    if (!image || !mapContainer) return
    
    const imageRect = image.getBoundingClientRect()
    const containerRect = mapContainer.getBoundingClientRect()
    
    // 新しい位置を計算
    const newX = lastPosition.x + deltaX
    const newY = lastPosition.y + deltaY
    
    // 境界制限を計算
    const maxX = 0
    const minX = containerRect.width - imageRect.width
    const maxY = 0
    const minY = containerRect.height - imageRect.height
    
    // 境界内に制限
    const constrainedX = Math.max(minX, Math.min(maxX, newX))
    const constrainedY = Math.max(minY, Math.min(maxY, newY))
    
    setMapPosition({
      x: constrainedX,
      y: constrainedY
    })
  }, [isDragging, dragStart, lastPosition])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ピンクリックハンドラー
  const handlePinClick = async (pin: MapPin, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isDraggingPin) return
    
    if (isEditMode && !isAddingPin) {
      // 編集モードの場合はピン編集
      setEditingPin(pin)
      setShowPinEditor(true)
    } else if (!isEditMode) {
      // プレビューモードの場合はモーダル表示
      const restaurant = restaurants.find(r => r.id === pin.restaurant_id)
      if (!restaurant) return
      
      setSelectedRestaurant(restaurant)
      setIsModalOpen(true)
    }
  }

  // 編集モード時のマップクリック（ピン追加）
  const handleMapClick = useCallback(async (e: React.MouseEvent) => {
    if (!isLocalhost || !isEditMode || !isAddingPin || isDragging) return
    
    const image = imageRef.current
    if (!image) return
    
    const imageRect = image.getBoundingClientRect()
    const imageX = e.clientX - imageRect.left
    const imageY = e.clientY - imageRect.top
    
    const x = (imageX / imageRect.width) * 100
    const y = (imageY / imageRect.height) * 100
    
    if (x < 0 || x > 100 || y < 0 || y > 100) return
    
    // 新しいレストランを作成
    const newRestaurant: Restaurant = {
      id: `restaurant_${Date.now()}`,
      name: '新しいレストラン',
      description: '説明を入力してください',
      address: '住所を入力してください',
      phone: '電話番号を入力してください',
      area: '渋谷',
      category: 'spicy',
      level: 3,
      google_map_url: '',
      x_position: Math.max(0, Math.min(100, x)),
      y_position: Math.max(0, Math.min(100, y)),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([newRestaurant])
        .select()
      
      if (error) {
        console.warn('レストランの追加に失敗しました:', error.message)
        return
      }
      
      const insertedRestaurant = data[0] as Restaurant
      setRestaurants(prev => [...prev, insertedRestaurant])
      
      // 新しいピンを作成
      const newPin: MapPin = {
        id: `pin_${insertedRestaurant.id}`,
        restaurant_id: insertedRestaurant.id,
        area_id: 'shibuya',
        x_position: insertedRestaurant.x_position ?? 50,
        y_position: insertedRestaurant.y_position ?? 50,
        is_active: true,
        created_at: insertedRestaurant.created_at,
        updated_at: insertedRestaurant.updated_at
      }
      
      setMapPins(prev => [...prev, newPin])
      setEditingPin(newPin)
      setShowPinEditor(true)
      setIsAddingPin(false)
      console.log('新しいレストランとピンを追加しました:', insertedRestaurant)
    } catch (error) {
      console.warn('Supabase挿入エラー:', error)
    }
  }, [isLocalhost, isEditMode, isAddingPin, isDragging, restaurants])

  // ピン追加モードの切り替え
  const toggleAddingPin = () => {
    setIsAddingPin(!isAddingPin)
    setShowPinEditor(false)
    setEditingPin(null)
  }

  // ピン削除機能
  const handleDeletePin = async (pinId: string) => {
    const pin = mapPins.find(p => p.id === pinId)
    if (!pin) return
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', pin.restaurant_id)
      
      if (error) {
        console.warn('レストランの削除に失敗しました:', error.message)
        return
      }
      
      setRestaurants(prev => prev.filter(restaurant => restaurant.id !== pin.restaurant_id))
      setMapPins(prev => prev.filter(p => p.id !== pinId))
      setShowPinEditor(false)
      setEditingPin(null)
      console.log('レストランとピンを削除しました:', pin.restaurant_id)
    } catch (error) {
      console.warn('Supabase削除エラー:', error)
    }
  }

  // ピン更新機能
  const handleUpdatePin = async (updatedPin: MapPin) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          x_position: updatedPin.x_position,
          y_position: updatedPin.y_position,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedPin.restaurant_id)
      
      if (error) {
        console.warn('レストラン位置の更新に失敗しました:', error.message)
        return
      }
      
      // ローカルのレストランデータを更新
      setRestaurants(prev => prev.map(restaurant => 
        restaurant.id === updatedPin.restaurant_id
          ? { ...restaurant, x_position: updatedPin.x_position, y_position: updatedPin.y_position }
          : restaurant
      ))
      
      setMapPins(prev => prev.map(pin => pin.id === updatedPin.id ? updatedPin : pin))
      setShowPinEditor(false)
      setEditingPin(null)
      console.log('レストラン位置を更新しました:', updatedPin)
    } catch (error) {
      console.warn('Supabase更新エラー:', error)
    }
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

  // 編集モード切り替え
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const filteredPins = getFilteredPins()

  // デバイスタイプに応じた拡大率を取得
  const mapScale = isMobile ? 1.7 : 1.2
  const scalePercentage = `${mapScale * 100}%`

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
        {/* メニューボタン */}
        <div className="fixed top-4 left-4 z-20">
          <div className="retro-modal max-w-xs">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="retro-modal-content py-2 px-4 hover:bg-gray-800 transition-colors cursor-pointer flex flex-col justify-center items-center"
            >
              <img 
                src="/image/logo.png" 
                alt="太田胃散ロゴ" 
                className="max-w-full h-auto"
                style={{ maxHeight: '40px' }}
              />
            </button>
          </div>
        </div>

        {/* コントロールパネル */}
        <div className={`fixed top-4 right-4 z-20 flex flex-col ${isMobile ? 'gap-2' : 'gap-4'}`}>
          <div className={`retro-modal ${isMobile ? 'max-w-[140px]' : 'max-w-xs'}`}>
            <div className="retro-modal-content">
              {/* エリア表示 */}
              <div className={`${isMobile ? 'mb-2' : 'mb-4'}`}>
                <div className="retro-modal-text-small font-semibold mb-2">エリア</div>
                <div className="retro-modal-text-small">
                  渋谷
                </div>
              </div>
              
              {/* カテゴリフィルター */}
              <div>
                <div className="retro-modal-text-small font-semibold mb-2">カテゴリ</div>
                <div className="flex flex-col gap-1">
                  {categories.map((categoryConfig) => (
                    <button
                      key={categoryConfig.category}
                      onClick={() => toggleCategory(categoryConfig.category)}
                      className="retro-modal-text-small text-left py-1 pl-0 pr-2 hover:bg-gray-800 transition-colors"
                    >
                      {selectedCategories.includes(categoryConfig.category) ? (
                        <span>▶{categoryConfig.label}</span>
                      ) : (
                        <span>{categoryConfig.label}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* アイテムボタン */}
          <div className={`retro-modal ${isMobile ? 'max-w-[140px]' : 'max-w-xs'}`}>
            <button 
              onClick={() => setIsItemDialogOpen(true)}
              className={`retro-modal-content ${isMobile ? 'py-1' : 'py-2'} hover:bg-gray-800 transition-colors cursor-pointer flex flex-col justify-center items-center w-full`}
            >
              <img 
                src="/image/item.png" 
                alt="アイテム" 
                className="mb-1"
                style={{ width: isMobile ? '50px' : '80px', height: 'auto' }}
              />
              <span 
                className="retro-modal-text-small text-white"
                style={{ fontSize: isMobile ? '10px' : '12px' }}
              >
                アイテムをみる
              </span>
            </button>
          </div>
        </div>

        {/* localhost時の編集コントロール */}
        {isLocalhost && (
          <>
            <div className="absolute top-32 left-4 z-20 flex flex-col gap-2 items-start">
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
              <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 z-30 w-80">
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

        {/* 地図表示 */}
        <div 
          ref={mapRef}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
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
            src="/image/map02.png"
            alt="渋谷地図イラスト"
            className="absolute select-none"
            style={{
              width: scalePercentage,
              height: scalePercentage,
              minWidth: scalePercentage,
              minHeight: scalePercentage,
              objectFit: 'cover',
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
            const mapContainer = mapRef.current
            if (!image || !mapContainer) return null
            
            // 画像の実際のサイズを取得
            const imageRect = image.getBoundingClientRect()
            
            // ピンの位置を画像上の相対位置として計算（地図の移動を考慮）
            const pinX = (imageRect.width * pin.x_position / 100) + mapPosition.x
            const pinY = (imageRect.height * pin.y_position / 100) + mapPosition.y
            
            const categoryColor = getCategoryColor(restaurant.category)
            
            return (
              <div
                key={pin.id}
                className={`absolute z-10 ${
                  isEditMode && !isAddingPin ? 'cursor-move' : 'cursor-pointer'
                } ${isDraggingPin && draggingPinId === pin.id ? 'opacity-75' : ''}`}
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
                  {/* SVGピンアイコン */}
                  <img
                    src={getCategorySvgPath(restaurant.category)}
                    alt={`${restaurant.category} pin`}
                    className="w-10 h-12 drop-shadow-lg"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                    }}
                  />
                  
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

      {/* メニューダイアログ */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="retro-modal max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="retro-modal-content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="retro-modal-text font-bold">PAUSE</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="retro-modal-text-small hover:bg-gray-800 px-2 py-1 rounded transition-colors"
                >
                  とじる
                </button>
              </div>
              
              <div className="space-y-8">
                <div className="text-center">
                  <div 
                    className="retro-modal-text-small text-white leading-relaxed"
                    style={{ fontSize: '20px' }}
                    dangerouslySetInnerHTML={{
                      __html: '太田胃散　を　もって<br>おいしい　を　攻略せよ！'
                    }}
                  />
                </div>
                
                <a
                  href="https://www.ohta-isan.co.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block retro-modal-text-small py-3 px-4 hover:bg-gray-800 transition-colors rounded border-2 border-white text-center"
                >
                  太田胃散公式サイト
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* アイテムダイアログ */}
      {isItemDialogOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setIsItemDialogOpen(false)}
        >
          <div 
            className="retro-modal max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="retro-modal-content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="retro-modal-text font-bold">ITEM</h2>
                <button
                  onClick={() => setIsItemDialogOpen(false)}
                  className="retro-modal-text-small hover:bg-gray-800 px-2 py-1 rounded transition-colors"
                >
                  とじる
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-6">
                  <img 
                    src="/image/item.png" 
                    alt="太田胃散" 
                    style={{ width: '120px', height: 'auto' }}
                  />
                  <div className="space-y-2">
                    <div 
                      className="retro-modal-text-small text-white font-bold"
                      style={{ fontSize: '14px' }}
                    >
                      回復■■■■■
                    </div>
                    <div 
                      className="retro-modal-text-small text-white font-bold"
                      style={{ fontSize: '14px' }}
                    >
                      即効■■■■■
                    </div>
                    <div 
                      className="retro-modal-text-small text-white font-bold"
                      style={{ fontSize: '14px' }}
                    >
                      爽快■■■■□
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div 
                      className="retro-modal-text-small text-white font-bold mb-3"
                      style={{ fontSize: '16px' }}
                    >
                      自然（生薬）の良さを生かした、長年愛用されている総合胃腸薬
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div 
                        className="retro-modal-text-small text-white font-semibold mb-1"
                        style={{ fontSize: '14px' }}
                      >
                        特徴1
                      </div>
                      <div 
                        className="retro-modal-text-small text-white leading-relaxed"
                        style={{ fontSize: '12px' }}
                      >
                        7種の健胃生薬が弱った胃を元気にします。
                      </div>
                    </div>
                    
                    <div>
                      <div 
                        className="retro-modal-text-small text-white font-semibold mb-1"
                        style={{ fontSize: '14px' }}
                      >
                        特徴2
                      </div>
                      <div 
                        className="retro-modal-text-small text-white leading-relaxed"
                        style={{ fontSize: '12px' }}
                      >
                        4種の制酸剤が胸やけ、胃痛に効きます。
                      </div>
                    </div>
                    
                    <div>
                      <div 
                        className="retro-modal-text-small text-white font-semibold mb-1"
                        style={{ fontSize: '14px' }}
                      >
                        特徴3
                      </div>
                      <div 
                        className="retro-modal-text-small text-white leading-relaxed"
                        style={{ fontSize: '12px' }}
                      >
                        独自製法でスッキリ爽やかな服用感。
                      </div>
                    </div>
                    
                    <div>
                      <div 
                        className="retro-modal-text-small text-white font-semibold mb-1"
                        style={{ fontSize: '14px' }}
                      >
                        効能・効果
                      </div>
                      <div 
                        className="retro-modal-text-small text-white leading-relaxed"
                        style={{ fontSize: '12px' }}
                      >
                        飲みすぎ、胸やけ、胃部不快感、胃弱、胃もたれ、食べすぎ、胃痛、消化不良、消化促進、食欲不振、胃酸過多、胃部・腹部膨満感、はきけ（胃のむかつき、二日酔・悪酔のむかつき、悪心）、嘔吐、胸つかえ、げっぷ、胃重
                      </div>
                    </div>
                  </div>
                </div>
                
                <a
                  href="https://ohta-isan.co.jp/product/medicine/ohtaisan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block retro-modal-text-small py-3 px-4 hover:bg-gray-800 transition-colors rounded border-2 border-white text-center"
                >
                  太田胃散のサイトでみる
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
