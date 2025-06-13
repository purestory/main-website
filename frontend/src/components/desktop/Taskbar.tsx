import React from 'react'
import type { WindowState } from '../../types'
import explorerIcon from '../../assets/images/explorer_ICO_MYCOMPUTER.ico'
import chromeLogo from '../../assets/images/chrome-logo.svg'

interface TaskbarProps {
  time: Date
  windows: WindowState[]
  onWindowClick: (windowId: string) => void
  onStartClick: () => void
  onOpenWindow?: (windowId: string, title: string) => void
  onMinimizeAll?: () => void
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  time, 
  onStartClick,
  onOpenWindow,
  onMinimizeAll
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // 컨텍스트 메뉴 방지
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleQuickLaunch = (windowId: string, title: string) => {
    if (onOpenWindow) {
      onOpenWindow(windowId, title)
    }
  }

  const handleMinimizeAll = () => {
    if (onMinimizeAll) {
      onMinimizeAll()
    }
  }

  return (
    <div className="taskbar" onContextMenu={handleContextMenu}>
      <button className="start-button" onClick={onStartClick} onContextMenu={handleContextMenu}>
        시작
      </button>
      
      {/* 빠른 실행 영역 */}
      <div className="quick-launch" onContextMenu={handleContextMenu}>
        <button 
          className="quick-launch-btn"
          onClick={handleMinimizeAll}
          onContextMenu={handleContextMenu}
          title="바탕화면 보기"
        >
          🖥️
        </button>
        <button 
          className="quick-launch-btn"
          onClick={() => handleQuickLaunch('explorer-app-window', '파일 탐색기')}
          onContextMenu={handleContextMenu}
          title="파일 탐색기"
        >
          <img src={explorerIcon} alt="탐색기" style={{ width: '16px', height: '16px' }} />
        </button>
        <button 
          className="quick-launch-btn"
          onClick={() => handleQuickLaunch('chrome-app-window', 'Chrome')}
          onContextMenu={handleContextMenu}
          title="Chrome"
        >
          <img src={chromeLogo} alt="Chrome" style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
      
      <div className="taskbar-right" onContextMenu={handleContextMenu}>
        <div className="volume-icon" onContextMenu={handleContextMenu}>
          🔊
        </div>
        <div id="taskbar-clock" onContextMenu={handleContextMenu}>
          {formatTime(time)}
          <br />
          {formatDate(time)}
        </div>
      </div>
    </div>
  )
}

export default Taskbar 