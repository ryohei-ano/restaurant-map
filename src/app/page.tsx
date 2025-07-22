'use client'

import dynamic from 'next/dynamic'

const RestaurantMap = dynamic(() => import('@/components/Map'), { ssr: false })

export default function HomePage() {
  return (
    <main className="h-screen w-screen">
      <RestaurantMap />
    </main>
  )
}
