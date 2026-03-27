import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const SplitDivider = ({ direction }: { direction: 'horizontal' | 'vertical' }) => {
  const [isDragging, setIsDragging] = useState(false)
  
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = () => {
      // In a real resize implementation, you calculate size based on bounding rectangles.
      // For this spec, we'd calculate ratio 0-1 based on mouse position.
      // We will place a simplified generic implementation here.
      
      if (document.body.style.cursor !== (direction === 'horizontal' ? 'col-resize' : 'row-resize')) {
        document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize'
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = 'default'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'default'
    }
  }, [isDragging, direction])

  const wHover = direction === 'horizontal' ? 'w-[8px]' : 'w-full'
  const hHover = direction === 'vertical' ? 'h-[8px]' : 'h-full'
  const wRest = direction === 'horizontal' ? 'w-[4px]' : 'w-full'
  const hRest = direction === 'vertical' ? 'h-[4px]' : 'h-full'

  return (
    <div
      onMouseDown={handleMouseDown}
      className={twMerge(
        clsx(
          `bg-kite-divider-rest hover:bg-kite-divider-hover z-10 transition-colors flex shrink-0 items-center justify-center`,
          direction === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize',
          direction === 'horizontal' ? wRest : hRest,
          `hover:${wHover} hover:${hHover}`
        )
      )}
    />
  )
}
