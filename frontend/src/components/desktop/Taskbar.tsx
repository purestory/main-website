import React from 'react'
import type { WindowState } from '../../types'

interface TaskbarProps {
  time: Date
  windows: WindowState[]
  onWindowClick: (windowId: string) => void
  onStartClick: () => void
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  time, 
  onStartClick 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="taskbar">
      <button className="start-button" onClick={onStartClick}>
        시작
      </button>
      
      <div id="taskbar-clock">
        {formatTime(time)}
      </div>
    </div>
  )
}

export default Taskbar 