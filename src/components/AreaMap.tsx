'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Area, Category, Store, MapPin, MapData, CategoryConfig, YahooStoreInfo, GooglePlaceInfo } from '@/types/map'
import { getYahooStoreById } from '@/lib/yahoo-api'
import RestaurantResponsiveModal from './RestaurantResponsiveModal'

// データインポート
import storesData from '@/data/stores.json'

const categoriesData = [
  {
    "category": "spicy",
    "label": "辛",
    "color": "#ef4444",
    "emoji": "🌶️"
  },
  {
    "category": "oily",
    "label": "油",
    "color": "#eab308",
    "emoji": "🍟"
  },
  {
    "category": "sweet",
    "label": "甘",
    "color": "#ec4899",
    "emoji": "🍰"
  }
]

const mapDataByArea = {
  shibuya: {
    area: "shibuya",
    imagePath: "/image/map01.webp",
    pins: [
      {
        id: "pin_1",
        storeId: "store_1",
        x: 45,
        y: 25
      },
      {
        id: "pin_2",
        storeId: "store_2",
        x: 55,
        y: 35
      },
      {
        id: "pin_3",
        storeId: "store_3",
        x: 40,
        y: 45
      },
      {
        id: "pin_4",
        storeId: "store_4",
        x: 60,
        y: 50
      },
      {
        id: "pin_5",
        storeId: "store_5",
        x: 35,
        y: 60
      },
      {
        id: "pin_6",
        storeId: "store_6",
        x: 65,
        y: 40
      },
      {
        id: "pin_7",
        storeId: "store_7",
        x: 50,
        y: 65
      },
      {
        id: "pin_8",
        storeId: "store_8",
        x: 30,
        y: 35
      },
      {
        id: "pin_9",
        storeId: "store_9",
        x: 70,
        y: 55
      },
      {
        id: "pin_10",
        storeId: "store_10",
        x: 45,
        y: 70
      },
      {
        id: "pin_11",
        storeId: "store_11",
        x: 25,
        y: 50
      },
      {
        id: "pin_12",
        storeId: "store_12",
        x: 75,
        y: 30
      }
    ]
  },
  shinjuku: {
    area: "shinjuku",
    imagePath: "/image/map01.webp",
    pins: [
      {
        id: "pin_13",
        storeId: "store_13",
        x: 25,
        y: 60
      }
    ]
  },
  shinbashi: {
    area: "shinbashi",
    imagePath: "/image/map01.webp",
    pins: [
      {
        id: "pin_14",
        storeId: "store_14",
        x: 75,
        y: 45
      }
    ]
  },
  ikebukuro: {
    area: "ikebukuro",
    imagePath: "/image/map01.webp",
    pins: []
  },
  kanda: {
    area: "kanda",
    imagePath: "/image/map01.webp",
    pins: []
  }
}

interface AreaMapProps {
  isDevelopment?: boolean
}

export default function AreaMap({ isDevelopment = false }: AreaMapProps) {
  // データ
  const [stores] = useState<Store[]>(storesData as Store[])
  const [categories] = useState<CategoryConfig[]>(categoriesData as CategoryConfig[])
  
  // 状態管理
  const [currentArea, setCurrentArea] = useState<Area>('shibuya')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['spicy', 'oily', 'sweet'])
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [yahooStoreInfo, setYahooStoreInfo] = useState<YahooStoreInfo | null>(null)
  const [googlePlaceInfo, setGooglePlaceInfo] = useState<GooglePlaceInfo | null>(null)
  const [loading, setLoading] = useState(false)
  
  // パン機能の状態
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  
  // 編集モードの状態
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingPin, setEditingPin] = useState<MapPin | null>(null)
  const [showPinEditor, setShowPinEditor] = useState(false)
  const [isAddingPin, setIsAddingPin] = useState(false)
  
  // ピンドラッグの状態
  const [isDraggingPin, setIsDraggingPin] = useState(false)
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // エリア定義
  const areas: { area: Area; label: string; available: boolean }[] = [
    { area: 'shibuya', label: '渋谷', available: true },
    { area: 'shinjuku', label: '新宿', available: false },
    { area: 'shinbashi', label: '新橋', available: false },
    { area: 'ikebukuro', label: '池袋', available: false },
    { area: 'kanda', label: '神田', available: false }
  ]

  // 地図データの読み込み
  useEffect(() => {
    const data = mapDataByArea[currentArea]
    if (data) {
      setMapData(data as MapData)
      setMapPosition({ x: 0, y: 0 }) // 地図切り替え時にリセット
    }
  }, [currentArea])

  // フィルタリングされたピンを取得
  const getFilteredPins = useCallback(() => {
    if (!mapData) return []
    
    return mapData.pins.filter(pin => {
      const store = stores.find(s => s.id === pin.storeId)
      return store && selectedCategories.includes(store.category)
    })
  }, [mapData, stores, selectedCategories])

  // カテゴリの色を取得
  const getCategoryColor = (category: Category) => {
    const categoryConfig = categories.find(c => c.category === category)
    return categoryConfig?.color || '#ef4444'
  }

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
  }

  // ピンドラッグ中
  const handlePinMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingPin || !draggingPinId || !mapData) return
    
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
      setMapData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          pins: prev.pins.map(pin => 
            pin.id === draggingPinId 
              ? { ...pin, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
              : pin
          )
        }
      })
    }
  }, [isDraggingPin, draggingPinId, mapData])

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
      const store = stores.find(s => s.id === pin.storeId)
      if (!store) return
      
      setSelectedPin(pin)
      setSelectedStore(store)
      setLoading(true)
      setIsModalOpen(true)
      
      // Google Places情報を優先的に取得
      if (store.googlePlaceId) {
        try {
          const response = await fetch(`/api/google-place/${store.googlePlaceId}`)
          if (response.ok) {
            const placeInfo = await response.json()
            setGooglePlaceInfo(placeInfo)
          } else {
            console.error('Google Places情報の取得に失敗:', response.status)
          }
        } catch (error) {
          console.error('Google Places情報の取得に失敗:', error)
        }
      }
      
      // Yahoo店舗情報を取得（Google Placesがない場合のフォールバック）
      if (!store.googlePlaceId && store.yahooStoreId) {
        try {
          const storeInfo = await getYahooStoreById(store.yahooStoreId)
          setYahooStoreInfo(storeInfo)
        } catch (error) {
          console.error('Yahoo店舗情報の取得に失敗:', error)
        }
      }
      
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
    if (!isDevelopment || !isEditMode || !isAddingPin || isDragging || !mapData) return
    
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
      storeId: `store_${Date.now()}`,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    }
    
    setMapData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        pins: [...prev.pins, newPin]
      }
    })
    setEditingPin(newPin)
    setShowPinEditor(true)
    setIsAddingPin(false) // ピン追加後は追加モードを終了
  }, [isDevelopment, isEditMode, isAddingPin, isDragging, mapData])

  // ピン削除機能
  const handleDeletePin = (pinId: string) => {
    setMapData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        pins: prev.pins.filter(pin => pin.id !== pinId)
      }
    })
    setShowPinEditor(false)
    setEditingPin(null)
  }

  // ピン更新機能
  const handleUpdatePin = (updatedPin: MapPin) => {
    setMapData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        pins: prev.pins.map(pin => pin.id === updatedPin.id ? updatedPin : pin)
      }
    })
    setShowPinEditor(false)
    setEditingPin(null)
  }

  // モード切り替え
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setShowPinEditor(false)
    setEditingPin(null)
  }

  // エリア切り替え
  const handleAreaChange = (area: Area) => {
    setCurrentArea(area)
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
    setSelectedPin(null)
    setSelectedStore(null)
    setYahooStoreInfo(null)
    setGooglePlaceInfo(null)
  }

  // モーダル用のレストランデータ変換
  const getRestaurantData = () => {
    if (!selectedStore) return null
    
    const storeInfo = yahooStoreInfo || selectedStore
    
    return {
      id: selectedStore.id,
      name: storeInfo.name || selectedStore.name,
      description: storeInfo.description || selectedStore.description || '',
      address: storeInfo.address || selectedStore.address || '',
      category: storeInfo.category || selectedStore.category || '',
      latitude: 0, // イラスト地図では使用しない
      longitude: 0, // イラスト地図では使用しない
      created_at: new Date().toISOString()
    }
  }

  const filteredPins = getFilteredPins()

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
        {/* コントロールパネル */}
        <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-lg p-4">
          {/* エリア選択 */}
          <div className="mb-4">
            <h3 className="text-sm font-bold mb-2">エリア選択</h3>
            <div className="flex gap-2 flex-wrap">
              {areas.map(({ area, label, available }) => (
                <button
                  key={area}
                  onClick={() => available && handleAreaChange(area)}
                  disabled={!available}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    currentArea === area
                      ? 'bg-blue-500 text-white'
                      : available
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {available ? label : `${label}（準備中）`}
                </button>
              ))}
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

        {/* 開発モード時のコントロール */}
        {isDevelopment && (
          <>
            {/* モード切り替えボタン */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
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
                    <label className="block text-sm font-medium mb-1">店舗データと紐づけ</label>
                    <select
                      value={editingPin.storeId || ''}
                      onChange={(e) => {
                        const selectedStore = stores.find(s => s.id === e.target.value)
                        setEditingPin({
                          ...editingPin,
                          storeId: e.target.value || 'store_1'
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">店舗を選択...</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name} ({store.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    位置: X={editingPin.x.toFixed(1)}%, Y={editingPin.y.toFixed(1)}%
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
          {mapData && (
            <img
              ref={imageRef}
              src={mapData.imagePath}
              alt={`${currentArea}地図イラスト`}
              className="absolute min-w-full min-h-full object-cover select-none"
              style={{
                transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              draggable={false}
            />
          )}
          
          {/* ピン表示 */}
          {filteredPins.map((pin) => {
            const store = stores.find(s => s.id === pin.storeId)
            if (!store) return null
            
            const image = imageRef.current
            if (!image) return null
            
            const imageRect = image.getBoundingClientRect()
            const mapRect = mapRef.current?.getBoundingClientRect()
            if (!mapRect) return null
            
            // ピンの絶対位置を計算
            const pinX = imageRect.left + (imageRect.width * pin.x / 100) - mapRect.left
            const pinY = imageRect.top + (imageRect.height * pin.y / 100) - mapRect.top
            
            const categoryColor = getCategoryColor(store.category)
            
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
                  <div 
                    className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      isDraggingPin && draggingPinId === pin.id ? 'opacity-75' : ''
                    }`}
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
                    {store.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* モーダル */}
      <RestaurantResponsiveModal
        restaurant={getRestaurantData()}
        yahooStoreInfo={yahooStoreInfo}
        googlePlaceInfo={googlePlaceInfo}
        reactions={[]} // イラスト地図では反応機能は使用しない
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReactionClick={() => {}} // 空の関数
      />
    </>
  )
}
