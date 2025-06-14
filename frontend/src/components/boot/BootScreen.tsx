import { useEffect, useState } from 'react'
import americanMegatrendsLogo from '../../assets/images/american_megatrends_logo2.png'
import type { BootState } from '../../types'

interface BootScreenProps {
  bootState: BootState
  updateBootState: (state: Partial<BootState>) => void
  onBootComplete: () => void
}

const BootScreen: React.FC<BootScreenProps> = ({ 
  bootState, 
  updateBootState, 
  onBootComplete 
}) => {
  // 컨텍스트 메뉴 방지
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  // 기존 boot.js의 메시지들 그대로 사용
  const postScreenMessages = [
    "AMIBIOS(C) 2023 American Megatrends Inc.",
    "CPU: Intel Core i9-13900HK @ 5.4GHz (14 Cores, 20 Threads)",
    "Memory Test: 32768M <span class='post-message-highlight-ok'>OK</span>",
    "GPU: NVIDIA GeForce RTX 3090 24GB",
    "Initializing USB Controllers .. <span class='post-message-highlight-ok'>Done</span>",
    "Detecting NVMe Devices...",
    "  NVMe Slot 0: Crucial CT2000P3PSSD8 2TB",
    "  NVMe Slot 1: WD Blue SN580 1TB",
    "Detecting SATA Devices...",
    "  SATA Port 0: None",
    "  SATA Port 1: None",
    "  SATA Port 2: None",
    "  SATA Port 3: None",
    "Detecting IDE Devices...",
    "  Primary Master: None",
    "  Primary Slave: None",
    "  Secondary Master: ASUS DVD-RW Drive",
    "  Secondary Slave: None",
    "Storage Summary:",
    "  NVMe 0: 2048GB Crucial CT2000P3PSSD8 <span class='post-message-highlight-ok'>Ready</span>",
    "  NVMe 1: 1024GB WD Blue SN580 <span class='post-message-highlight-ok'>Ready</span>",
    " ",
    "<span class='post-message-highlight-info'>Booting from Hard Disk...</span>",
  ]

  const bootMessages = [
    { text: "POST: System Check...", duration: 300 },
    { text: "Memory Test: 32768MB OK", duration: 350 },
    { text: "Initializing USB Controllers...", duration: 400 },
    { text: "AHCI Driver Loaded.", duration: 350 },
    { text: "Loading Kernel (core.sys)...", duration: 500 },
    { text: "Starting Windows Services...", duration: 450 },
    { text: "Welcome!", duration: 150 }
  ]

  const [currentBootMessageIndex, setCurrentBootMessageIndex] = useState(0)
  const [bootStartTime, setBootStartTime] = useState<number | null>(null)
  const [isPostStarted, setIsPostStarted] = useState(false)
  const [currentBootMessage, setCurrentBootMessage] = useState('')
  const [bootProgressPercent, setBootProgressPercent] = useState(0)

  // 기존 코드의 타이밍 그대로 사용
  const postMessageDelay = 100 // 0.1초
  const totalBootTime = 2500 // 2.5초

  useEffect(() => {
    if (!isPostStarted) {
      console.log('🚀 부팅 시퀀스 시작 - POST 화면')
      setIsPostStarted(true)
      
      // POST 단계 시작
      updateBootState({ currentPhase: 'post', progress: 0 })
      
      const showNextPostMessage = (messageIndex: number) => {
        if (messageIndex < postScreenMessages.length) {
          console.log(`📝 POST 메시지 ${messageIndex + 1}/${postScreenMessages.length}`)
          updateBootState({ 
            messages: postScreenMessages.slice(0, messageIndex + 1),
            progress: (messageIndex + 1) / postScreenMessages.length * 30
          })
          setTimeout(() => showNextPostMessage(messageIndex + 1), postMessageDelay)
        } else {
          // POST 메시지 완료 후 500ms 대기 후 Boot 단계로
          console.log('⏰ POST 완료, 500ms 후 Boot 화면으로 전환')
          setTimeout(() => {
            console.log('🔄 Boot 화면으로 자동 전환')
            updateBootState({ 
              currentPhase: 'boot', 
              progress: 0,
              messages: []
            })
            setBootStartTime(Date.now())
            setCurrentBootMessageIndex(0)
            setCurrentBootMessage('Starting Windows...')
            setBootProgressPercent(0)
          }, 500)
        }
      }

      showNextPostMessage(0)
    }
  }, []) // 빈 의존성 배열로 변경

  // Boot 메시지 표시 로직 - 원래 코드 방식으로 수정
  useEffect(() => {
    if (bootState.currentPhase === 'boot' && bootStartTime && currentBootMessageIndex === 0) {
      console.log(`🔄 Boot 화면 시작, 현재 메시지 인덱스: ${currentBootMessageIndex}`)
      
      const showNextBootMessage = (messageIndex: number) => {
        if (messageIndex < bootMessages.length) {
          const currentMessage = bootMessages[messageIndex]
          console.log(`💻 Boot 메시지 ${messageIndex + 1}/${bootMessages.length}: ${currentMessage.text}`)
          setCurrentBootMessage(currentMessage.text)
          setCurrentBootMessageIndex(messageIndex + 1)
          
          if (messageIndex + 1 < bootMessages.length) {
            setTimeout(() => showNextBootMessage(messageIndex + 1), currentMessage.duration)
          }
        }
      }

      // Progress 업데이트 로직 - 원래 코드 방식
      const updateBootProgress = () => {
        const elapsedTime = Date.now() - bootStartTime
        const progressPercent = Math.min(100, Math.floor((elapsedTime / totalBootTime) * 100))
        setBootProgressPercent(progressPercent)
        updateBootState({ progress: progressPercent })
        
        if (progressPercent >= 100) {
          return false // 인터벌 중지 신호
        }
        return true // 계속 진행
      }

      showNextBootMessage(0)
      
      // 100ms마다 progress 업데이트
      const progressInterval = setInterval(() => {
        if (!updateBootProgress()) {
          clearInterval(progressInterval)
        }
      }, 100)

      // Boot 완료 타이머
      const bootCompleteTimer = setTimeout(() => {
        clearInterval(progressInterval)
        setBootProgressPercent(100)
        updateBootState({ progress: 100 })
        console.log('✅ 부팅 완료 - 데스크톱으로 자동 전환')
        onBootComplete()
      }, totalBootTime)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(bootCompleteTimer)
      }
    }
  }, [bootState.currentPhase, bootStartTime]) // currentBootMessageIndex 제거

  if (bootState.currentPhase === 'post') {
    return (
      <div id="post-screen" onContextMenu={handleContextMenu}>
        <div id="postBiosLogo">
          <img src={americanMegatrendsLogo} alt="American Megatrends" />
        </div>
        <div id="postMessages">
          {bootState.messages.map((message, index) => (
            <div 
              key={index}
              dangerouslySetInnerHTML={{ __html: message + '\n' }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (bootState.currentPhase === 'boot') {
    return (
      <div id="boot-screen" onContextMenu={handleContextMenu}>
        <div className="boot-logo">
          <div className="logo-pane"></div>
          <div className="logo-pane"></div>
          <div className="logo-pane"></div>
          <div className="logo-pane"></div>
        </div>
        
        <div className="boot-progress-bar-container">
          <div 
            id="bootProgressBar"
            className="boot-progress-bar"
            style={{ 
              width: `${bootProgressPercent}%`,
              transition: 'width 0.1s ease-out'
            }}
          />
        </div>
        
        <p id="bootProgressText">{bootProgressPercent}%</p>
        
        <div className="boot-messages">
          <p id="bootMessageText">{currentBootMessage || 'Starting Windows...'}</p>
        </div>
      </div>
    )
  }

  return null
}

export default BootScreen 