'use client'

import { useEffect, useState } from 'react'

interface IntroDialogProps {
  onComplete: () => void
}

export default function IntroDialog({ onComplete }: IntroDialogProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  
  const messages = [
    '太田胃散　を　もって　おいしい　を　攻略せよ！',
    '渋谷　の　おいしいお店　を　探す冒険　に　出よう！',
    'からい　あぶら　あまい　で　お店の絞り込み　が　できるよ',
  ]
  
  useEffect(() => {
    let currentIndex = 0
    const currentMessage = messages[currentMessageIndex]
    
    const typingInterval = setInterval(() => {
      if (currentIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(typingInterval)
        
        // 最後のメッセージの場合は3秒後に完了
        if (currentMessageIndex === messages.length - 1) {
          setTimeout(() => {
            onComplete()
          }, 3000)
        } else {
          // 次のメッセージに進む（1秒後）
          setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1)
            setDisplayedText('')
            setIsComplete(false)
          }, 1000)
        }
      }
    }, 100) // 100msごとに1文字追加

    return () => clearInterval(typingInterval)
  }, [currentMessageIndex, onComplete])

  return (
    <>
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
                  <span className="ml-2 blink">
                    ◀
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
