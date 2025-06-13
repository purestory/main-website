import React, { useState, useEffect, useRef } from 'react'
import { projectsData, builtInPrograms, getProjectEmoji } from '../../data/projectsData'
import calculatorIcon from '../../assets/images/calculator-icon.png'
import explorerIcon from '../../assets/images/explorer_ICO_MYCOMPUTER.ico'
import chromeLogo from '../../assets/images/chrome-logo.svg'
import amicaIcon from '../../assets/images/amica_ai_icon.png'
import translationIcon from '../../assets/images/translation_service_icon.png'
import openwebuiIcon from '../../assets/images/openwebui-icon.png'
import youtubeLogo from '../../assets/images/youtube-logo.svg'

interface StartMenuProps {
  isVisible: boolean
  onClose: () => void
  onOpenWindow: (windowId: string, title: string) => void
  onOpenProject?: (projectName: string, windowId: string) => void
}

const StartMenu: React.FC<StartMenuProps> = ({ isVisible, onClose, onOpenWindow, onOpenProject }) => {
  const [showProgramsSubmenu, setShowProgramsSubmenu] = useState(false)
  const startMenuRef = useRef<HTMLDivElement>(null)
  const hideSubmenuTimer = useRef<NodeJS.Timeout | null>(null)

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        onClose()
        setShowProgramsSubmenu(false)
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      // 원본처럼 애니메이션을 위한 requestAnimationFrame 적용
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (startMenuRef.current) {
            startMenuRef.current.classList.add('active')
          }
        })
      })
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  const handleMenuItemClick = (windowId: string, title: string) => {
    onOpenWindow(windowId, title)
    onClose()
    setShowProgramsSubmenu(false)
  }

  const handleProgramsHover = () => {
    if (hideSubmenuTimer.current) {
      clearTimeout(hideSubmenuTimer.current)
      hideSubmenuTimer.current = null
    }
    setShowProgramsSubmenu(true)
  }

  const handleProgramsLeave = () => {
    hideSubmenuTimer.current = setTimeout(() => {
      setShowProgramsSubmenu(false)
    }, 300)
  }

  const handleSubmenuMouseEnter = () => {
    if (hideSubmenuTimer.current) {
      clearTimeout(hideSubmenuTimer.current)
      hideSubmenuTimer.current = null
    }
  }

  const handleSubmenuMouseLeave = () => {
    hideSubmenuTimer.current = setTimeout(() => {
      setShowProgramsSubmenu(false)
    }, 300)
  }

  const handleProjectClick = (project: any) => {
    if (project.windowId && onOpenProject) {
      onOpenProject(project.name, project.windowId)
    } else {
      // 윈도우 ID가 없으면 기존 방식으로 새 탭에서 열기
      if (project.link && project.link !== '#' && !project.link.startsWith('javascript:')) {
        window.open(project.link, '_blank')
      }
    }
    onClose()
    setShowProgramsSubmenu(false)
  }

  const handleBuiltInProgramClick = (program: any) => {
    if (program.name === 'YouTube') {
      window.open('https://youtube.com', '_blank')
    } else if (program.windowId) {
      onOpenWindow(program.windowId, program.name)
    }
    onClose()
    setShowProgramsSubmenu(false)
  }

  const getIconElement = (program: any) => {
    if (program.isImage && program.imageSrc) {
      let src = program.imageSrc
      if (program.name === '계산기') {
        src = calculatorIcon
      } else if (program.name === '파일 탐색기') {
        src = explorerIcon
      } else if (program.name === 'Chrome') {
        src = chromeLogo
      } else if (program.name === 'YouTube') {
        src = youtubeLogo
      }
      
      return (
        <img 
          src={src} 
          alt={program.name} 
          style={{ 
            width: '16px', 
            height: '16px', 
            marginRight: '8px', 
            objectFit: 'contain', 
            verticalAlign: 'middle' 
          }} 
        />
      )
    } else {
      return (
        <span style={{ fontSize: '16px', marginRight: '8px', verticalAlign: 'middle' }}>
          {program.emoji}
        </span>
      )
    }
  }

  const getProjectIcon = (project: any) => {
    if (project.iconUrl) {
      let src = project.iconUrl
      if (project.name === 'Amica AI') {
        src = amicaIcon
      } else if (project.name === 'Translation Service') {
        src = translationIcon
      } else if (project.name === 'OpenWebUI') {
        src = openwebuiIcon
      }
      
      return (
        <img 
          src={src} 
          alt={project.name} 
          style={{ 
            width: '16px', 
            height: '16px', 
            marginRight: '8px', 
            objectFit: 'contain', 
            verticalAlign: 'middle' 
          }} 
        />
      )
    } else {
      return (
        <span style={{ fontSize: '16px', marginRight: '8px', verticalAlign: 'middle' }}>
          {getProjectEmoji(project)}
        </span>
      )
    }
  }

  return (
    <div 
      id="start-menu" 
      className="" 
      style={{ display: isVisible ? 'block' : 'none' }}
      ref={startMenuRef}
    >
      <ul id="startMenuList">
        <li 
          className="has-submenu" 
          id="all-programs-menu-item"
          onMouseEnter={handleProgramsHover}
          onMouseLeave={handleProgramsLeave}
        >
          <span className="menu-text">모든 프로그램</span>
          <span className="submenu-arrow">▶</span>
          <ul 
            className={`submenu ${showProgramsSubmenu ? 'visible' : ''}`} 
            id="all-programs-submenu"
            onMouseEnter={handleSubmenuMouseEnter}
            onMouseLeave={handleSubmenuMouseLeave}
          >
            {/* 프로젝트 데이터 먼저 추가 */}
            {projectsData.map((project, index) => (
              <li key={`project-${index}`} onClick={() => handleProjectClick(project)}>
                <a style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'black', width: '100%' }}>
                  {getProjectIcon(project)}
                  <span className="menu-text">{project.name}</span>
                </a>
              </li>
            ))}
            
            {/* 내장 프로그램들 추가 */}
            {builtInPrograms.map((program, index) => (
              <li key={`builtin-${index}`} onClick={() => handleBuiltInProgramClick(program)}>
                <a style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'black', width: '100%' }}>
                  {getIconElement(program)}
                  <span className="menu-text">{program.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </li>
        <li onClick={() => handleMenuItemClick('documents-window', '내 문서')}>
          📄 문서(D)
        </li>
        <li onClick={() => handleMenuItemClick('settings-window', '설정')}>
          ⚙️ 설정(S)
        </li>
        <li onClick={() => handleMenuItemClick('search-window', '검색')}>
          🔍 검색(E)
        </li>
        <li onClick={() => handleMenuItemClick('run-window', '실행')}>
          ▶️ 실행(R)...
        </li>
        <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #999' }} />
        <li onClick={() => handleMenuItemClick('shutdown-window', 'Windows 종료')}>
          🔌 컴퓨터 끄기(U)...
        </li>
      </ul>
    </div>
  )
}

export default StartMenu 