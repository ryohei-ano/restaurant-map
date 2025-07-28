import { Category, LevelDisplay } from '@/types/map'

// カテゴリに対応する絵文字を取得する関数
export const getCategoryEmoji = (category: Category): string => {
  const emojiMap = {
    spicy: '🌶️',
    oily: '🍟',
    sweet: '🍰'
  }
  return emojiMap[category] || '🍽️'
}

// カテゴリレベルの表示情報を取得する関数
export const getLevelDisplay = (category: Category, level: number): LevelDisplay => {
  const emoji = getCategoryEmoji(category)
  const labelMap = {
    spicy: '辛さ',
    oily: '油っぽさ',
    sweet: '甘さ'
  }
  
  return {
    emoji,
    count: level,
    text: `${labelMap[category]} ${level}/5`
  }
}

// レベルを絵文字で表示する関数
export const renderLevelEmojis = (category: Category, level: number): string => {
  const emoji = getCategoryEmoji(category)
  return emoji.repeat(level)
}

// カテゴリの色を取得する関数
export const getCategoryColor = (category: Category): string => {
  const colorMap = {
    spicy: '#ef4444',
    oily: '#eab308',
    sweet: '#ec4899'
  }
  return colorMap[category] || '#6b7280'
}

// カテゴリの日本語ラベルを取得する関数
export const getCategoryLabel = (category: Category): string => {
  const labelMap = {
    spicy: '辛い',
    oily: '油っぽい',
    sweet: '甘い'
  }
  return labelMap[category] || category
}
