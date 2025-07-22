import L from 'leaflet'

export const createCustomIcon = (category: string) => {
  const getIconColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'ラーメン': '#000000', // black
      'カフェ': '#000000',   // black
      '寿司': '#000000',     // black
      'イタリアン': '#000000', // black
      '焼肉': '#000000'      // black
    }
    return colors[category] || '#000000' // black
  }

  const getIconEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'ラーメン': '🍜',
      'カフェ': '☕',
      '寿司': '🍣',
      'イタリアン': '🍝',
      '焼肉': '🥩'
    }
    return emojis[category] || '🍽️'
  }

  const color = getIconColor(category)
  const emoji = getIconEmoji(category)

  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="3"/>
      <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">${emoji}</text>
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
