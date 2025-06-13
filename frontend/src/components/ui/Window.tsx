import React, { type ReactNode, useState, useEffect } from 'react'
import type { WindowState } from '../../types'

interface WindowProps {
  window: WindowState
  isActive: boolean
  children: ReactNode
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMove?: (windowId: string, newPosition: { x: number; y: number }) => void
}

const Window: React.FC<WindowProps> = ({
  window,
  isActive,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    // 버튼 클릭은 무시
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    
    console.log('🖱️ 드래그 시작:', window.id)
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    })
    
    onFocus()
    e.preventDefault()
  }

  // 전역 마우스 이벤트 처리
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!onMove) return
      
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // 화면 경계 제한
      const maxX = globalThis.window.innerWidth - window.size.width
      const maxY = globalThis.window.innerHeight - window.size.height - 40
      
      const boundedX = Math.max(0, Math.min(newX, maxX))
      const boundedY = Math.max(0, Math.min(newY, maxY))
      
      onMove(window.id, { x: boundedX, y: boundedY })
    }

    const handleMouseUp = () => {
      console.log('🖱️ 드래그 종료:', window.id)
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, onMove, window.id, window.size])

  const windowStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${window.position.x}px`,
    top: `${window.position.y}px`,
    width: `${window.size.width}px`,
    height: `${window.size.height}px`,
    zIndex: window.zIndex,
    display: window.isMinimized ? 'none' : 'block'
  }

  console.log('Window 렌더링:', window.id, windowStyle)

  return (
    <div
      className={`window ${isActive ? 'active' : ''} ${window.isMaximized ? 'maximized' : ''}`}
      style={windowStyle}
      onClick={onFocus}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span className="window-title">{window.title}</span>
        <div>
          <button 
            className="window-minimize-button" 
            onClick={(e) => {
              e.stopPropagation()
              onMinimize()
            }}
            aria-label="Minimize"
          />
          <button 
            className="window-maximize-button" 
            onClick={(e) => {
              e.stopPropagation()
              onMaximize()
            }}
            aria-label="Maximize"
          />
          <button 
            className="window-close-button" 
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close"
          />
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
      <div className="resize-handle" />
    </div>
  )
}

export default Window 