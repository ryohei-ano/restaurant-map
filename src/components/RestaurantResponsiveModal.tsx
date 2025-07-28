'use client'

import { useState } from 'react'
import { ThumbsUp, MapPin } from 'lucide-react'
import { Restaurant, Reaction } from '@/types/map'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

interface RestaurantResponsiveModalProps {
  restaurant: Restaurant | null
  reactions: Reaction[]
  isOpen: boolean
  onClose: () => void
  onReactionClick: (restaurantId: string, reactionType: 'like' | 'bad') => void
}

export default function RestaurantResponsiveModal({ 
  restaurant, 
  reactions, 
  isOpen, 
  onClose, 
  onReactionClick 
}: RestaurantResponsiveModalProps) {
  const [isAnimating, setIsAnimating] = useState<'like' | 'bad' | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!restaurant) return null

  const likeReaction = reactions.find(r => r.restaurant_id === restaurant.id && r.reaction_type === 'like')

  const handleReactionClick = () => {
    setIsAnimating('like')
    setIsLiked(!isLiked)
    onReactionClick(restaurant.id, 'like')
    setTimeout(() => setIsAnimating(null), 300)
  }

  const ContentComponent = () => {
    return (
      <div className="space-y-4">
        {/* ヘッダー */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {restaurant.name}
          </h2>
        </div>
        
        {/* 説明 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">店舗情報</h3>
          <p className="text-gray-600 leading-relaxed">
            {restaurant.description}
          </p>
        </div>
        
        {/* 基本情報 */}
        <div className="space-y-3">
          {/* 住所 */}
          <div className="flex items-start space-x-2">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              {restaurant.address}
            </p>
          </div>

          {/* 電話番号 */}
          {restaurant.phone && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">電話:</span>
              <span className="text-gray-600">{restaurant.phone}</span>
            </div>
          )}

          {/* 営業時間 */}
          {restaurant.opening_hours && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">営業時間:</span>
              <span className="text-gray-600">{restaurant.opening_hours}</span>
            </div>
          )}

          {/* 価格帯 */}
          {restaurant.price_range && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">価格帯:</span>
              <span className="text-gray-600">{restaurant.price_range}</span>
            </div>
          )}
        </div>
        
        {/* リアクション */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">みんなの評価</h3>
          <div className="flex items-center">
            <Button
              onClick={handleReactionClick}
              variant={isLiked ? "default" : "outline"}
              size="lg"
              className={`flex items-center space-x-2 px-4 py-3 transition-all duration-300 ease-in-out ${
                isLiked
                  ? 'bg-black text-white border-black hover:bg-gray-800'
                  : 'bg-white text-black border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              } ${isAnimating === 'like' ? 'scale-105' : ''}`}
            >
              <ThumbsUp className="w-6 h-6" />
              <span className="text-lg font-semibold">
                {likeReaction?.count || 0}
              </span>
              <span className="text-sm">いいね</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isDesktop) {
    console.log('デスクトップ表示: Dialogを使用')
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="sr-only">{restaurant.name}</DialogTitle>
            <DialogDescription className="sr-only">
              {restaurant.description}
            </DialogDescription>
          </DialogHeader>
          <ContentComponent />
        </DialogContent>
      </Dialog>
    )
  }

  console.log('モバイル表示: Drawerを使用')
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="sr-only">{restaurant.name}</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <ContentComponent />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
