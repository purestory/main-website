import React, { useEffect, useRef } from 'react'

interface ContextMenuItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  separator?: boolean
  submenu?: ContextMenuItem[]
}

interface ContextMenuProps {
  isVisible: boolean
  position: { x: number; y: number }
  items: ContextMenuItem[]
  onClose: () => void
  onItemClick: (itemId: string) => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  position,
  items,
  onClose,
  onItemClick
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible, onClose])

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled && !item.separator) {
      onItemClick(item.id)
      onClose()
    }
  }

  if (!isVisible) return null

  // 화면 경계를 벗어나지 않도록 위치 조정
  const adjustedPosition = { ...position }
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  if (position.x + 200 > screenWidth) {
    adjustedPosition.x = screenWidth - 200
  }
  if (position.y + 300 > screenHeight) {
    adjustedPosition.y = screenHeight - 300
  }

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        position: 'fixed',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        zIndex: 10000
      }}
    >
      {items.map((item, index) => (
        item.separator ? (
          <div key={index} className="context-menu-separator" />
        ) : (
          <div
            key={item.id}
            className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item.icon && <span className="context-menu-icon">{item.icon}</span>}
            <span className="context-menu-label">{item.label}</span>
            {item.submenu && <span className="context-menu-arrow">▶</span>}
          </div>
        )
      ))}
    </div>
  )
}

export default ContextMenu 