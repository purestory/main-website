import React from 'react'
import Window from './Window'
import MinesweeperWindow from './MinesweeperWindow'
import CalculatorWindow from './CalculatorWindow'
import ProjectsWindow from './ProjectsWindow'
import ChromeWindow from './ChromeWindow'
import PaintWindow from './PaintWindow'
import ExplorerWindow from './ExplorerWindow'
import type { WindowState } from '../../types'

interface WindowManagerProps {
  windows: WindowState[]
  setWindows: React.Dispatch<React.SetStateAction<WindowState[]>>
  onWindowMove?: (windowId: string, newPosition: { x: number; y: number }) => void
  onWindowResize?: (windowId: string, newSize: { width: number; height: number }) => void
}

const WindowManager: React.FC<WindowManagerProps> = ({ windows, setWindows, onWindowMove, onWindowResize }) => {
  // 무한 렌더링 방지를 위해 console.log 제거
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

  const getWindowContent = (window: WindowState) => {
    switch (window.id) {
      case 'minesweeper-app-window':
        return <MinesweeperWindow 
          onResize={(width, height) => {
            if (onWindowResize) {
              onWindowResize(window.id, { width, height })
            }
          }}
          onClose={() => handleWindowClose(window.id)}
        />
      case 'calculator-app-window':
        return <CalculatorWindow />
      case 'projects-window':
        return <ProjectsWindow />
      case 'my-computer-window':
        return (
          <div className="my-computer-body">
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
        return <ExplorerWindow />
      case 'chrome-app-window':
        return <ChromeWindow />
      case 'paint-app-window':
        return <PaintWindow />
      case 'test-window':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>🧪 테스트 창</h2>
            <p>이 창이 보이면 WindowManager가 정상 작동중입니다!</p>
            <button onClick={() => alert('버튼 클릭됨!')}>테스트 버튼</button>
          </div>
        )
      default:
        return <div>알 수 없는 윈도우</div>
    }
  }

  return (
    <>
      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onClose={() => handleWindowClose(window.id)}
          onMinimize={() => handleWindowMinimize(window.id)}
          onMaximize={() => handleWindowMaximize(window.id)}
          onFocus={() => handleWindowFocus(window.id)}
          onMove={onWindowMove}
          onResize={onWindowResize}
          isResizable={window.id !== 'minesweeper-app-window' && window.id !== 'calculator-app-window'}
        >
          {getWindowContent(window)}
        </Window>
      ))}
    </>
  )
}

export default WindowManager 