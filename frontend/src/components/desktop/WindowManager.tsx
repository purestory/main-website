import React from 'react'
import Window from '../ui/Window'
import MinesweeperWindow from '../windows/MinesweeperWindow'
import CalculatorWindow from '../windows/CalculatorWindow'
import PaintWindow from '../windows/PaintWindow'
import type { WindowState } from '../../types'

interface WindowManagerProps {
  windows: WindowState[]
  setWindows: React.Dispatch<React.SetStateAction<WindowState[]>>
}

const WindowManager: React.FC<WindowManagerProps> = ({ windows, setWindows }) => {
  // 컨텍스트 메뉴 방지
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleWindowClose = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId))
  }

  const handleWindowMinimize = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ))
  }

  const handleWindowMaximize = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }

  const handleWindowFocus = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId 
        ? { ...w, zIndex: Math.max(...prev.map(pw => pw.zIndex)) + 1 }
        : w
    ))
  }

  const handleWindowResize = (windowId: string, width: number, height: number) => {
    console.log(`창 크기 변경 요청: ${windowId}`, { width, height })
    setWindows(prev => {
      const newWindows = prev.map(w => 
        w.id === windowId 
          ? { ...w, size: { width, height } }
          : w
      )
      console.log('새 창 상태:', newWindows.find(w => w.id === windowId))
      return newWindows
    })
  }

  const getWindowContent = (window: WindowState) => {
    switch (window.id) {
      case 'minesweeper-app-window':
        return <MinesweeperWindow onResize={(width, height) => {
          handleWindowResize(window.id, width, height)
        }} />
      case 'calculator-app-window':
        return <CalculatorWindow />
      case 'paint-app-window':
        return <PaintWindow />
      case 'projects-window':
        return <div onContextMenu={handleContextMenu}>프로젝트 목록 (준비 중)</div>
      case 'my-computer-window':
        return (
          <div className="my-computer-body" onContextMenu={handleContextMenu}>
            <p><strong>시스템 정보 (가상)</strong></p>
            <ul>
              <li>운영체제: Web OS Simulation</li>
              <li>CPU: Simulated Web CPU</li>
              <li>RAM: User's Browser Memory</li>
            </ul>
            <hr />
            <p><strong>드라이브 (가상)</strong></p>
            <div className="drive-item">
              <span className="drive-icon">💾</span> C: (Web Drive)
            </div>
            <div className="drive-item">
              <span className="drive-icon">💿</span> D: (CD-ROM - 가상)
            </div>
          </div>
        )
      case 'explorer-app-window':
        return <div onContextMenu={handleContextMenu}>파일 탐색기 로딩 중...</div>
      case 'chrome-app-window':
        return (
          <div className="chrome-browser" onContextMenu={handleContextMenu}>
            <div className="chrome-url-bar" onContextMenu={handleContextMenu}>
              <input type="text" placeholder="https://oo.ai" defaultValue="https://oo.ai" onContextMenu={handleContextMenu} />
              <button onContextMenu={handleContextMenu}>이동</button>
            </div>
            <iframe 
              src="https://oo.ai" 
              style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none' }}
              allow="microphone; camera; fullscreen; autoplay; encrypted-media"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"
            />
          </div>
        )
      default:
        return <div onContextMenu={handleContextMenu}>알 수 없는 윈도우</div>
    }
  }

  return (
    <>
      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          isActive={window.zIndex === Math.max(...windows.map(w => w.zIndex))}
          onClose={() => handleWindowClose(window.id)}
          onMinimize={() => handleWindowMinimize(window.id)}
          onMaximize={() => handleWindowMaximize(window.id)}
          onFocus={() => handleWindowFocus(window.id)}
        >
          {getWindowContent(window)}
        </Window>
      ))}
    </>
  )
}

export default WindowManager 