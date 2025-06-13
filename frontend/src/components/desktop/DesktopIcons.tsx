import React from 'react'
import type { DesktopIcon } from '../../types'

interface DesktopIconsProps {
  icons: DesktopIcon[]
  onIconClick: (windowId: string, title: string) => void
}

const DesktopIcons: React.FC<DesktopIconsProps> = ({ icons, onIconClick }) => {
  return (
    <>
      {icons.map((icon) => (
        <div 
          key={icon.id}
          className="desktop-icon"
          id={icon.id}
          onClick={() => onIconClick(icon.windowId, icon.label)}
        >
          <div className="icon-image">
            {typeof icon.image === 'string' && (icon.image.startsWith('/') || icon.image.includes('.')) ? (
              <img src={icon.image} alt={icon.label} />
            ) : (
              icon.image
            )}
          </div>
          <span className="icon-label">{icon.label}</span>
        </div>
      ))}
    </>
  )
}

export default DesktopIcons 