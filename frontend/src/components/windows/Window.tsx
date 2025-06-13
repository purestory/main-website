import React, { type ReactNode, useState, useRef } from 'react'
import type { WindowState } from '../../types'

interface WindowProps {
  window: WindowState
  children: ReactNode
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  onMove?: (windowId: string, newPosition: { x: number; y: number }) => void
  onResize?: (windowId: string, newSize: { width: number; height: number }) => void
  isResizable?: boolean
}

const Window: React.FC<WindowProps> = ({
  window,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  isResizable = true
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 })
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number }>({ 
    startX: 0, startY: 0, startWidth: 0, startHeight: 0 
  })
  const isResizingRef = useRef(false) // 즉시 상태 추적용

  const handleMouseDown = () => {
    onFocus()
  }

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    // 최대화된 상태에서는 드래그 안됨
    if (window.isMaximized) return
    
    // 버튼 클릭은 드래그 안됨
    if ((e.target as HTMLElement).closest('button')) return

    e.preventDefault()
    setIsDragging(true)
    onFocus()

    const rect = (e.currentTarget as HTMLElement).closest('.window')?.getBoundingClientRect()
    if (rect) {
      dragRef.current = {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || window.isMaximized) return

    const newX = e.clientX - dragRef.current.offsetX
    const newY = e.clientY - dragRef.current.offsetY

    // 화면 경계 체크
    const maxX = globalThis.innerWidth - window.size.width
    const maxY = globalThis.innerHeight - window.size.height - 40 // 태스크바 고려

    const clampedX = Math.max(0, Math.min(maxX, newX))
    const clampedY = Math.max(0, Math.min(maxY, newY))

    if (onMove) {
      onMove(window.id, { x: clampedX, y: clampedY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!isResizable || window.isMaximized) {
      return
    }
    
    // 이벤트 전파 완전 차단
    e.preventDefault()
    e.stopPropagation()
    
    // 텍스트 선택 방지
    const bodyStyle = document.body.style as any
    bodyStyle.userSelect = 'none'
    bodyStyle.webkitUserSelect = 'none'
    bodyStyle.mozUserSelect = 'none'
    bodyStyle.msUserSelect = 'none'
    
    // 상태 설정을 먼저 하고 확인
    setIsResizing(true)
    isResizingRef.current = true // 즉시 상태 업데이트
    onFocus()

    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: window.size.width,
      startHeight: window.size.height
    }
    
    // 강제로 모든 이벤트 리스너 제거 후 새로 추가
    const cleanup = () => {
      isResizingRef.current = false
      setIsResizing(false)
      
      // 텍스트 선택 복원
      bodyStyle.userSelect = ''
      bodyStyle.webkitUserSelect = ''
      bodyStyle.mozUserSelect = ''
      bodyStyle.msUserSelect = ''
      
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
    
    const handleMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) {
        cleanup()
        return
      }
      
      const deltaX = moveEvent.clientX - resizeRef.current.startX
      const deltaY = moveEvent.clientY - resizeRef.current.startY

      const newWidth = Math.max(200, resizeRef.current.startWidth + deltaX)
      const newHeight = Math.max(150, resizeRef.current.startHeight + deltaY)
      
      if (onResize) {
        onResize(window.id, { width: newWidth, height: newHeight })
      }
    }
    
    const handleUp = (upEvent: MouseEvent) => {
      upEvent.preventDefault()
      upEvent.stopPropagation()
      cleanup()
    }
    
    // 이벤트 리스너 추가
    document.addEventListener('mousemove', handleMove, { passive: false })
    document.addEventListener('mouseup', handleUp, { passive: false })
    
    // 5초 후 강제 해제 (안전장치)
    setTimeout(() => {
      if (isResizingRef.current) {
        cleanup()
      }
    }, 5000)
  }

  if (window.isMinimized) {
    return null
  }

  const windowStyle = window.isMaximized ? {
    position: 'fixed' as const,
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    zIndex: window.zIndex,
    display: 'block',
    opacity: 1,
    transform: 'scale(1)'
  } : {
    position: 'absolute' as const,
    left: `${window.position.x}px`,
    top: `${window.position.y}px`,
    width: `${window.size.width}px`,
    height: `${window.size.height}px`,
    zIndex: window.zIndex,
    display: 'block',
    opacity: 1,
    transform: 'scale(1)'
  }

  return (
    <div
      className={`window active ${window.isMaximized ? 'maximized' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={windowStyle}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="window-header"
        onMouseDown={handleHeaderMouseDown}
        style={{ cursor: window.isMaximized ? 'default' : 'move' }}
      >
        <span className="window-title">{window.title}</span>
        <div>
          <button 
            className="window-minimize-button" 
            aria-label="Minimize"
            onClick={onMinimize}
          />
          <button 
            className="window-maximize-button" 
            aria-label="Maximize"
            onClick={onMaximize}
          />
          <button 
            className="window-close-button" 
            aria-label="Close"
            onClick={onClose}
          />
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
      {isResizable && !window.isMaximized && (
        <div 
          className="resize-handle" 
          onMouseDown={handleResizeMouseDown}
          style={{ cursor: 'se-resize' }}
          title="리사이즈 핸들 - 드래그해서 크기 조절"
        />
      )}
    </div>
  )
}

export default Window 