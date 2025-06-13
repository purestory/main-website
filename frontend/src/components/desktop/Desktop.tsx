import { useEffect, useState } from 'react'
import Taskbar from './Taskbar'
import StartMenu from './StartMenu'
import DesktopIcons from './DesktopIcons'
import WindowManager from '../windows/WindowManager'
import calculatorIcon from '../../assets/images/calculator-icon.png'
import explorerIcon from '../../assets/images/explorer_ICO_MYCOMPUTER.ico'
import chromeLogo from '../../assets/images/chrome-logo.svg'
import youtubeLogo from '../../assets/images/youtube-logo.svg'
import type { WindowState, DesktopIcon } from '../../types'

interface DesktopProps {
  windows: WindowState[]
  setWindows: React.Dispatch<React.SetStateAction<WindowState[]>>
}

const Desktop: React.FC<DesktopProps> = ({ windows, setWindows }) => {
  const [time, setTime] = useState(new Date())
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false)

  // 데스크톱 아이콘 데이터 정의
  const desktopIcons: DesktopIcon[] = [
    {
      id: 'icon-my-computer',
      label: '내 컴퓨터',
      image: '🖥️',
      windowId: 'my-computer-window'
    },
    {
      id: 'icon-projects',
      label: 'Projects',
      image: '📁',
      windowId: 'projects-window'
    },
    {
      id: 'icon-minesweeper',
      label: 'Minesweeper',
      image: '💣',
      windowId: 'minesweeper-app-window'
    },
    {
      id: 'icon-paint',
      label: 'Paint',
      image: '🎨',
      windowId: 'paint-app-window'
    },
    {
      id: 'icon-calculator',
      label: 'Calculator',
      image: calculatorIcon,
      windowId: 'calculator-app-window'
    },
    {
      id: 'icon-explorer',
      label: '파일 탐색기',
      image: explorerIcon,
      windowId: 'explorer-app-window'
    },
    {
      id: 'icon-chrome',
      label: 'Chrome',
      image: chromeLogo,
      windowId: 'chrome-app-window'
    },
    {
      id: 'icon-youtube',
      label: 'YouTube',
      image: youtubeLogo,
      windowId: 'youtube-app-window'
    }
  ]

  const openWindow = (windowId: string, title: string) => {
    console.log('Opening window:', windowId, title)
    
    // 유튜브는 새 탭에서 열기
    if (windowId === 'youtube-app-window') {
      window.open('https://youtube.com', '_blank')
      return
    }
    

    
    // 이미 열린 창이 있는지 확인
    const existingWindow = windows.find(w => w.id === windowId)
    if (existingWindow) {
      // 이미 열린 창이 있으면 포커스만 주고 최소화 해제
      setWindows(prev => prev.map(w => 
        w.id === windowId 
          ? { ...w, isMinimized: false, zIndex: Math.max(...prev.map(pw => pw.zIndex)) + 1 }
          : w
      ))
      return
    }

    // 창별 기본 크기 설정
    let defaultSize = { width: 800, height: 600 }
    
    if (windowId === 'calculator-app-window') {
      defaultSize = { width: 280, height: 400 }
    } else if (windowId === 'minesweeper-app-window') {
      // 지뢰찾기는 초급 난이도 기본 크기로 시작하되, onResize로 동적 변경 가능
      defaultSize = { width: 295, height: 372 } // 초급 난이도 기본 크기
    } else if (windowId === 'projects-window') {
      defaultSize = { width: 400, height: 350 }
    } else if (windowId === 'my-computer-window') {
      defaultSize = { width: 500, height: 400 }
    } else if (windowId === 'explorer-app-window') {
      defaultSize = { width: 1000, height: 800 }
    } else if (windowId === 'paint-app-window') {
      defaultSize = { width: 700, height: 550 }
    } else if (windowId === 'chrome-app-window') {
      defaultSize = { width: 1200, height: 800 }
    }

    // 화면 크기 정보
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const taskbarHeight = 40 // 태스크바 높이
    const margin = 40 // 창 주변 여백

    // 브라우저 창에 맞게 크기 조정 (지뢰찾기, 계산기 제외)
    if (windowId !== 'minesweeper-app-window' && windowId !== 'calculator-app-window') {
      const maxWidth = screenWidth - margin
      const maxHeight = screenHeight - taskbarHeight - margin
      
      if (defaultSize.width > maxWidth) {
        defaultSize.width = maxWidth
      }
      if (defaultSize.height > maxHeight) {
        defaultSize.height = maxHeight
      }
    }
    
    const centerX = (screenWidth - defaultSize.width) / 2
    const centerY = (screenHeight - defaultSize.height - taskbarHeight) / 2
    
    // 여러 창이 겹치지 않도록 약간씩 오프셋
    const offset = windows.length * 25
    const finalX = Math.max(20, centerX + offset)
    const finalY = Math.max(20, centerY + offset)

    // 새 윈도우 생성
    const newWindow: WindowState = {
      id: windowId,
      title: title,
      isMinimized: false,
      isMaximized: false,
      position: { x: finalX, y: finalY },
      size: defaultSize,
      zIndex: Math.max(0, ...windows.map(w => w.zIndex)) + 1
    }

    console.log(`✅ 새 창 생성:`, newWindow)
    setWindows(prev => {
      const updated = [...prev, newWindow]
      console.log(`📊 현재 창 목록:`, updated.map(w => ({ id: w.id, title: w.title })))
      return updated
    })
  }

  const handleWindowMove = (windowId: string, newPosition: { x: number; y: number }) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, position: newPosition }
          : w
      )
    )
  }

  const handleWindowResize = (windowId: string, newSize: { width: number; height: number }) => {
    console.log(`🔧 창 크기 변경: ${windowId}`, newSize)
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, size: newSize }
          : w
      )
    )
  }

  useEffect(() => {
    console.log('🖥️ 데스크톱 로드됨')
    
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="desktop visible">
      <Taskbar 
        time={time} 
        windows={windows} 
        onWindowClick={(windowId) => {
          setWindows(prev => prev.map(w => 
            w.id === windowId 
              ? { ...w, isMinimized: !w.isMinimized, zIndex: Math.max(...prev.map(pw => pw.zIndex)) + 1 }
              : w
          ))
        }}
        onStartClick={() => setIsStartMenuVisible(!isStartMenuVisible)}
      />
      
      {/* Desktop icons - DesktopIcons 컴포넌트 사용 */}
      <DesktopIcons 
        icons={desktopIcons}
        onIconClick={openWindow}
      />

      <StartMenu
        isVisible={isStartMenuVisible}
        onClose={() => setIsStartMenuVisible(false)}
        onOpenWindow={openWindow}
      />

      <WindowManager 
        windows={windows} 
        setWindows={setWindows}
        onWindowMove={handleWindowMove}
        onWindowResize={handleWindowResize}
      />
    </div>
  )
}

export default Desktop 