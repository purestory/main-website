import React, { useState, useEffect } from 'react'
import './MinesweeperWindow.css'

interface MinesweeperWinDialogProps {
  isVisible: boolean
  elapsedTime: number
  difficulty: string
  onClose: () => void
}

const getDifficultyName = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return '초급'
    case 'intermediate': return '중급'
    case 'expert': return '고급'
    default: return difficulty
  }
}

const MinesweeperWinDialog: React.FC<MinesweeperWinDialogProps> = ({ 
  isVisible, 
  elapsedTime, 
  difficulty, 
  onClose 
}) => {
  const [playerName, setPlayerName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // 점수 저장
  const saveScore = async () => {
    if (!playerName.trim()) {
      alert('이름을 입력해주세요!')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/main-api/minesweeper/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: playerName.trim(),
          time: elapsedTime,
          difficulty: difficulty
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const formattedTime = elapsedTime.toFixed(2)
        alert(`점수가 저장되었습니다!\n${playerName.trim()}: ${formattedTime}초`)
        onClose()
      } else {
        alert('점수 저장에 실패했습니다: ' + result.error)
      }
    } catch (error) {
      console.error('점수 저장 오류:', error)
      alert('점수 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  // 대화상자가 열릴 때 입력 필드 초기화
  useEffect(() => {
    if (isVisible) {
      setPlayerName('')
    }
  }, [isVisible])

  // 렌더링 로그를 useEffect로 이동
  useEffect(() => {
    if (isVisible) {
      console.log('🎯 MinesweeperWinDialog 렌더링:', { isVisible, elapsedTime, difficulty })
    }
  }, [isVisible, elapsedTime, difficulty])

  if (!isVisible) return null

  const formattedTime = elapsedTime.toFixed(2)

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99999,
        }}
        onClick={onClose}
      />
      
      {/* 대화상자 */}
      <div 
        className="window dialog" 
        style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '350px',
          height: 'auto',
          zIndex: 100000,
          backgroundColor: '#c0c0c0',
          border: '2px outset #c0c0c0'
        }}
      >
        <div className="window-header">
          <span className="window-title">축하합니다!</span>
          <div>
            <button 
              className="window-close-button" 
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
        </div>
        <div className="window-body dialog-body">
          <div className="dialog-content">
            <div className="dialog-icon">🎉</div>
            <div className="dialog-message">
              축하합니다! {getDifficultyName(difficulty)} 난이도를 {formattedTime}초에 클리어했습니다!
            </div>
            <div className="dialog-input-section">
              <label htmlFor="player-name-input">이름을 입력하세요:</label>
              <input
                id="player-name-input"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isSaving) {
                    saveScore()
                  }
                }}
                maxLength={20}
                placeholder="플레이어"
                autoComplete="off"
                autoFocus
              />
            </div>
            <div className="dialog-buttons">
              <button 
                className="btn btn-primary" 
                onClick={saveScore}
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MinesweeperWinDialog 