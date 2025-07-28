'use client'

import { useState } from 'react'
import { ThumbsUp, MapPin, Phone, Clock, Car, DollarSign, Star } from 'lucide-react'
import { Restaurant, Reaction } from '@/lib/supabase'
import { YahooStoreInfo, GooglePlaceInfo } from '@/types/map'
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
  yahooStoreInfo: YahooStoreInfo | null
  googlePlaceInfo: GooglePlaceInfo | null
  reactions: Reaction[]
  isOpen: boolean
  onClose: () => void
  onReactionClick: (restaurantId: string, reactionType: 'like' | 'bad') => void
}

export default function RestaurantResponsiveModal({ 
  restaurant, 
  yahooStoreInfo,
  googlePlaceInfo,
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
    // 優先順位: Google Places > Yahoo > Restaurant
    const storeInfo = googlePlaceInfo || yahooStoreInfo
    const displayName = storeInfo?.name || restaurant.name
    const displayAddress = storeInfo?.address || restaurant.address
    const displayDescription = storeInfo?.description || restaurant.description

    return (
      <div className="space-y-4">
        {/* ヘッダー */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {displayName}
          </h2>
          {yahooStoreInfo?.catchCopy && (
            <p className="text-sm text-gray-500 mt-1">{yahooStoreInfo.catchCopy}</p>
          )}
        </div>
        
        {/* Google Places評価情報 */}
        {googlePlaceInfo && ((googlePlaceInfo.rating && googlePlaceInfo.rating > 0) || (googlePlaceInfo.reviewCount && googlePlaceInfo.reviewCount > 0)) && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Star className="w-5 h-5 text-blue-500" />
            <div>
              {googlePlaceInfo.rating && googlePlaceInfo.rating > 0 && (
                <span className="text-lg font-semibold text-gray-900">
                  {googlePlaceInfo.rating.toFixed(1)}
                </span>
              )}
              {googlePlaceInfo.reviewCount && googlePlaceInfo.reviewCount > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  ({googlePlaceInfo.reviewCount}件のレビュー)
                </span>
              )}
              <span className="text-xs text-blue-600 ml-2">Google</span>
            </div>
          </div>
        )}
        
        {/* Yahoo評価情報（Google Placesがない場合のみ表示） */}
        {!googlePlaceInfo && yahooStoreInfo && ((yahooStoreInfo.rating && yahooStoreInfo.rating > 0) || (yahooStoreInfo.reviewCount && yahooStoreInfo.reviewCount > 0)) && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
            <Star className="w-5 h-5 text-yellow-500" />
            <div>
              {yahooStoreInfo.rating && yahooStoreInfo.rating > 0 && (
                <span className="text-lg font-semibold text-gray-900">
                  {yahooStoreInfo.rating.toFixed(1)}
                </span>
              )}
              {yahooStoreInfo.reviewCount && yahooStoreInfo.reviewCount > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  ({yahooStoreInfo.reviewCount}件のレビュー)
                </span>
              )}
              <span className="text-xs text-yellow-600 ml-2">Yahoo</span>
            </div>
          </div>
        )}
        
        {/* 説明 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">店舗情報</h3>
          <p className="text-gray-600 leading-relaxed">
            {displayDescription}
          </p>
        </div>
        
        {/* 基本情報 */}
        <div className="space-y-3">
          {/* 住所 */}
          <div className="flex items-start space-x-2">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              {displayAddress}
            </p>
          </div>
        
        {/* 電話番号 */}
        {yahooStoreInfo?.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-600">{yahooStoreInfo.phone}</p>
          </div>
        )}
        
        {/* 営業時間 */}
        {yahooStoreInfo?.openTime && (
          <div className="flex items-start space-x-2">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-600">{yahooStoreInfo.openTime}</p>
              {yahooStoreInfo.holiday && (
                <p className="text-sm text-gray-500">定休日: {yahooStoreInfo.holiday}</p>
              )}
            </div>
          </div>
        )}
        
        {/* 予算 */}
        {yahooStoreInfo?.budget && (
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-600">{yahooStoreInfo.budget}</p>
          </div>
        )}
        
        {/* 駐車場 */}
        {yahooStoreInfo?.parking && (
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-600">{yahooStoreInfo.parking}</p>
          </div>
        )}
        
        {/* アクセス */}
        {yahooStoreInfo?.access && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">アクセス</h4>
            <p className="text-sm text-gray-600">{yahooStoreInfo.access}</p>
          </div>
        )}
        </div>
        
        {/* Yahoo店舗URL */}
        {yahooStoreInfo?.url && (
          <div className="pt-2">
            <a
              href={yahooStoreInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Yahoo!ロコで詳細を見る
            </a>
          </div>
        )}
        
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
