'use client'

import dynamic from 'next/dynamic'

const AreaMap = dynamic(() => import('@/components/AreaMap'), { ssr: false })

export default function HomePage() {
  // 開発環境かどうかを判定
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <main className="h-screen w-screen">
      <AreaMap isDevelopment={isDevelopment} />
    </main>
  )
}
