'use client'

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [dotCount, setDotCount] = useState(0)

  useEffect(() => {
    // 最低2秒間ローディング画面を表示
    const timer = setTimeout(() => {
      setIsVisible(false)
      // フェードアウトアニメーション後にコールバック実行
      setTimeout(() => {
        onLoadingComplete()
      }, 500) // フェードアウト時間
    }, 2000)

    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  // ドットアニメーション
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4) // 0, 1, 2, 3をループ
    }, 500) // 500msごとに更新

    return () => clearInterval(dotTimer)
  }, [])

  const renderDots = () => {
    const dots = '.'.repeat(dotCount)
    const spaces = '\u00A0'.repeat(3 - dotCount) // 非改行スペースで固定幅を確保
    return dots + spaces
  }

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-500 opacity-0 pointer-events-none">
        <div className="flex flex-col items-center justify-center space-y-4">
          <img 
            src="/image/logo.png" 
            alt="太田胃散ロゴ" 
            className="h-20 w-auto"
          />
          <div className="text-white text-xl font-bold retro-modal-text text-center ml-4">
            ロード中{renderDots()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-500">
      <div className="flex flex-col items-center justify-center space-y-4">
        <img 
          src="/image/logo.png" 
          alt="太田胃散ロゴ" 
          className="h-20 w-auto animate-pulse"
        />
        <div className="text-white text-xl font-bold retro-modal-text text-center ml-4">
          ロード中{renderDots()}
        </div>
      </div>
    </div>
  )
}
