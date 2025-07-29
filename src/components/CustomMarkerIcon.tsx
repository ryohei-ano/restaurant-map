import L from 'leaflet'
import categories from '@/data/categories.json'

export const createCustomIcon = (category: string) => {
  // categories.jsonからカテゴリ情報を取得
  const categoryData = categories.find(cat => cat.category === category)
  
  if (!categoryData) {
    // デフォルトアイコン
    const svgIcon = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#000000" stroke="white" stroke-width="3"/>
        <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">🍽️</text>
      </svg>
    `
    return L.divIcon({
      html: svgIcon,
      className: 'custom-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    })
  }

  // itemカテゴリの場合はitem.pngを使用
  if (category === 'item' && categoryData.iconPath) {
    const imageIcon = `
      <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        <img src="${categoryData.iconPath}" alt="item" style="width: 32px; height: 32px; object-fit: contain;" />
      </div>
    `
    return L.divIcon({
      html: imageIcon,
      className: 'custom-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    })
  }

  // 通常のカテゴリアイコン
  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="${categoryData.color}" stroke="white" stroke-width="3"/>
      <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">${categoryData.emoji}</text>
    </svg>
  `

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  })
}
