'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import LoadingScreen from '@/components/LoadingScreen'
import IntroDialog from '@/components/IntroDialog'

const AreaMap = dynamic(() => import('@/components/AreaMap'), { ssr: false })

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showIntroDialog, setShowIntroDialog] = useState(false)
  
  // 開発環境かどうかを判定
  const isDevelopment = process.env.NODE_ENV === 'development'

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setShowIntroDialog(true)
  }

  const handleIntroComplete = () => {
    setShowIntroDialog(false)
  }

  return (
    <main className="h-screen w-screen">
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <AreaMap isDevelopment={isDevelopment} />
      {showIntroDialog && <IntroDialog onComplete={handleIntroComplete} />}
    </main>
  )
}
