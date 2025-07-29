'use client'

import { useEffect, useState } from 'react'

interface IntroDialogProps {
  onComplete: () => void
}

export default function IntroDialog({ onComplete }: IntroDialogProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const fullText = '太田胃散　を　もって　おいしい　を　攻略せよ！'
  
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(typingInterval)
        // テキスト完了後3秒待ってから次に進む
        setTimeout(() => {
          onComplete()
        }, 3000)
      }
    }, 100) // 100msごとに1文字追加

    return () => clearInterval(typingInterval)
  }, [fullText, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-4">
      {/* ダイアログボックス */}
      <div className="retro-modal w-full mx-4">
        <div className="retro-modal-content">
          {/* テキスト表示エリア */}
          <div className="min-h-[80px] flex items-center">
            <div className="retro-modal-text text-white leading-relaxed">
              {displayedText}
              {/* カーソル点滅 */}
              {isComplete && (
                <span className="ml-2 animate-pulse">
                  ◀
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
