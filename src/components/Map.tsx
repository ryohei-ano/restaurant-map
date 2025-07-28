'use client'

import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Restaurant, Reaction } from '@/types/map'
import { dummyRestaurants, dummyReactions } from '@/data/dummyData'
import RestaurantResponsiveModal from './RestaurantResponsiveModal'
import { createCustomIcon } from './CustomMarkerIcon'

export default function Map() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // ダミーデータを読み込み（後でSupabaseに置き換え）
    setRestaurants(dummyRestaurants)
    setReactions(dummyReactions)
    setLoading(false)
  }, [])

  // モーダルが閉じられた後にマップのサイズを再計算
  useEffect(() => {
    if (!isModalOpen && mapRef.current) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize()
        }
      }, 300) // アニメーション完了後に実行
    }
  }, [isModalOpen])

  const handleMarkerClick = (restaurant: Restaurant) => {
    console.log('マーカーがクリックされました:', restaurant.name)
    setSelectedRestaurant(restaurant)
    setIsModalOpen(true)
    console.log('モーダル状態設定後:', { selectedRestaurant: restaurant.name, isModalOpen: true })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRestaurant(null)
  }

  const handleReactionClick = (restaurantId: string, reactionType: 'like' | 'bad') => {
    setReactions(prevReactions => {
      const existingReaction = prevReactions.find(
        r => r.restaurant_id === restaurantId && r.reaction_type === reactionType
      )

      if (existingReaction) {
        // 既存のリアクションのカウントを増やす
        return prevReactions.map(r =>
          r.id === existingReaction.id
            ? { ...r, count: r.count + 1 }
            : r
        )
      } else {
        // 新しいリアクションを追加
        const newReaction: Reaction = {
          id: `${Date.now()}`,
          restaurant_id: restaurantId,
          reaction_type: reactionType,
          count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        return [...prevReactions, newReaction]
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-gray-600">マップを読み込み中...</div>
      </div>
    )
  }

  return (
    <>
      <MapContainer
        center={[35.6895, 139.6917]} // 東京の緯度経度
        zoom={13}
        style={{ height: '100vh', width: '100vw' }}
        className=""
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {restaurants.map((restaurant) => {
          // Google MapのURLから座標を抽出するか、デフォルト値を使用
          let lat = 35.6895; // 東京のデフォルト緯度
          let lng = 139.6917; // 東京のデフォルト経度
          
          if (restaurant.google_map_url) {
            const match = restaurant.google_map_url.match(/q=([0-9.-]+),([0-9.-]+)/);
            if (match) {
              lat = parseFloat(match[1]);
              lng = parseFloat(match[2]);
            }
          }
          
          return (
            <Marker
              key={restaurant.id}
              position={[lat, lng]}
              icon={createCustomIcon(restaurant.category)}
              eventHandlers={{
                click: () => handleMarkerClick(restaurant)
              }}
            />
          );
        })}
      </MapContainer>
      
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
