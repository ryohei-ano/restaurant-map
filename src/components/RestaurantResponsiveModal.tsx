'use client'

import { useState } from 'react'
import { ThumbsUp, MapPin } from 'lucide-react'
import { Restaurant, Reaction, Category } from '@/types/map'
import React from 'react'

// カテゴリに対応する色を取得する関数
const getCategoryColor = (category: Category): string => {
  const colorMap = {
    spicy: '#FF1B1B',
    oily: '#AAFF00',
    sweet: '#9535F4'
  }
  return colorMap[category] || '#6b7280'
}

// カテゴリに対応するレベルテキストを取得する関数
const getCategoryLevelText = (category: Category): string => {
  const textMap = {
    spicy: '辛さレベル：',
    oily: '脂レベル：',
    sweet: '甘さレベル：'
  }
  return textMap[category] || 'レベル：'
}

// レベル表示用の四角形を生成する関数
const renderLevelSquares = (level: number, category: Category): React.ReactElement => {
  const maxLevel = 5
  const color = getCategoryColor(category)
  const squares = []
  
  for (let i = 0; i < maxLevel; i++) {
    squares.push(
      <span
        key={i}
        className="inline-block w-3 h-3 border border-white"
        style={{
          backgroundColor: i < level ? color : 'transparent'
        }}
      />
    )
  }
  
  return <div className="flex gap-0.5">{squares}</div>
}
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
  const [likeCount, setLikeCount] = useState(0)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!restaurant) return null

  const likeReaction = reactions.find(r => r.restaurant_id === restaurant.id && r.reaction_type === 'like')

  const handleReactionClick = () => {
    setIsAnimating('like')
    setIsLiked(!isLiked)
    setLikeCount(prev => prev + 1)
    onReactionClick(restaurant.id, 'like')
    setTimeout(() => setIsAnimating(null), 300)
  }

  const ContentComponent = () => {
    return (
      <div className="retro-modal-content">
        {/* ヘッダー */}
        <div className="mb-4">
          <h2 className="retro-modal-text font-bold">
            {restaurant.name}
          </h2>
          {/* カテゴリレベル表示 */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="retro-modal-text-small font-medium">{getCategoryLevelText(restaurant.category)}</span>
            {renderLevelSquares(restaurant.level, restaurant.category)}
            <span className="retro-modal-text-small">({restaurant.level}/5)</span>
          </div>
        </div>
        
        {/* 説明 - descriptionが"TBD"の場合は非表示 */}
        {restaurant.description && restaurant.description !== "TBD" && (
          <div className="mb-4">
            <h3 className="retro-modal-text-small font-semibold mb-2">店舗情報</h3>
            <p className="retro-modal-text-small leading-relaxed">
              {restaurant.description}
            </p>
          </div>
        )}
        
        {/* 基本情報 */}
        <div className="space-y-3 mb-4">
          {/* 住所 */}
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-white mt-1 flex-shrink-0" />
            <p className="retro-modal-text-small">
              {restaurant.address}
            </p>
          </div>

          {/* 電話番号 */}
          <div className="flex items-center space-x-2">
            <span className="retro-modal-text-small font-medium">電話:</span>
            <span className="retro-modal-text-small">{restaurant.phone}</span>
          </div>

          {/* Google Mapリンク */}
          {restaurant.google_map_url && (
            <div className="flex items-center space-x-2">
              <span className="retro-modal-text-small font-medium">地図:</span>
              <a 
                href={restaurant.google_map_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="retro-modal-text-small text-yellow-300 hover:text-yellow-100 underline"
              >
                Google Mapで開く
              </a>
            </div>
          )}
        </div>
        
        {/* リアクション */}
        <div className="pt-4 border-t-2 border-white">
          <h3 className="retro-modal-text-small font-semibold mb-3">みんなの評価</h3>
          <div className="flex items-center">
            <button
              onClick={handleReactionClick}
              className={`retro-button flex items-center gap-2 ${
                isLiked ? 'active' : ''
              } ${isAnimating === 'like' ? 'scale-105' : ''}`}
            >
              <ThumbsUp className="w-4 h-4 text-black" />
              <span className="retro-modal-text-small font-semibold text-black">
                {likeCount + (likeReaction?.count || 0)}
              </span>
              <span className="retro-modal-text-small text-black">いいね</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isDesktop) {
    console.log('デスクトップ表示: Dialogを使用')
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] retro-modal p-0 border-0">
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
      <DrawerContent className="retro-modal border-0 mx-4 mb-4 bg-transparent">
        <ContentComponent />
      </DrawerContent>
    </Drawer>
  )
}
