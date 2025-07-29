'use client'

import { useEffect, useState, useRef } from 'react'

interface IntroDialogProps {
  onComplete: () => void
}

export default function IntroDialog({ onComplete }: IntroDialogProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isSkipped, setIsSkipped] = useState(false)
  
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const nextMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const completeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const messages = [
    '太田胃散　を　もって　おいしい　を　攻略せよ！',
    '渋谷　の　おいしいお店　を　探す冒険　に　出よう！',
    'からい　あぶら　あまい　で　お店の絞り込み　が　できるよ',
  ]
  
  // クリックでスキップ機能
  const handleClick = () => {
    if (isSkipped) return
    
    // 現在のタイマーをクリア
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
    if (nextMessageTimeoutRef.current) {
      clearTimeout(nextMessageTimeoutRef.current)
      nextMessageTimeoutRef.current = null
    }
    if (completeTimeoutRef.current) {
      clearTimeout(completeTimeoutRef.current)
      completeTimeoutRef.current = null
    }
    
    // 最後のメッセージの場合は完了
    if (currentMessageIndex === messages.length - 1) {
      setIsSkipped(true)
      onComplete()
    } else {
      // 現在のメッセージを完全表示して次へ
      setDisplayedText(messages[currentMessageIndex])
      setIsComplete(true)
      
      // 次のメッセージに進む
      setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1)
        setDisplayedText('')
        setIsComplete(false)
      }, 300)
    }
  }
  
  useEffect(() => {
    if (isSkipped) return
    
    let currentIndex = 0
    const currentMessage = messages[currentMessageIndex]
    
    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsComplete(true)
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current)
          typingIntervalRef.current = null
        }
        
        // 最後のメッセージの場合は3秒後に完了
        if (currentMessageIndex === messages.length - 1) {
          completeTimeoutRef.current = setTimeout(() => {
            onComplete()
          }, 3000)
        } else {
          // 次のメッセージに進む（1秒後）
          nextMessageTimeoutRef.current = setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1)
            setDisplayedText('')
            setIsComplete(false)
          }, 1000)
        }
      }
    }, 100) // 100msごとに1文字追加

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
      if (nextMessageTimeoutRef.current) {
        clearTimeout(nextMessageTimeoutRef.current)
      }
      if (completeTimeoutRef.current) {
        clearTimeout(completeTimeoutRef.current)
      }
    }
  }, [currentMessageIndex, onComplete, isSkipped])

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center pb-4 cursor-pointer"
        onClick={handleClick}
      >
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
            
            {/* スキップヒント */}
            <div className="mt-2 text-right">
              <span className="retro-modal-text-small text-gray-400">
                SKIP
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
