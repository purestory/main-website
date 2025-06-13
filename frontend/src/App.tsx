import { useState } from 'react'
import BootScreen from './components/boot/BootScreen'
import Desktop from './components/desktop/Desktop'
import type { BootState, WindowState } from './types'

function App() {
  const [bootState, setBootState] = useState<BootState>({
    currentPhase: 'post',
    progress: 0,
    messages: []
  })

  const [windows, setWindows] = useState<WindowState[]>([])
  const [isBootComplete, setIsBootComplete] = useState(false)

  const updateBootState = (updates: Partial<BootState>) => {
    setBootState(prev => ({ ...prev, ...updates }))
  }

  const handleBootComplete = () => {
    console.log('🏁 부팅 완료!')
    setIsBootComplete(true)
  }

  if (!isBootComplete) {
    return (
      <BootScreen 
        bootState={bootState}
        updateBootState={updateBootState}
        onBootComplete={handleBootComplete}
      />
    )
  }

  return <Desktop windows={windows} setWindows={setWindows} isBootComplete={isBootComplete} />
}

export default App
