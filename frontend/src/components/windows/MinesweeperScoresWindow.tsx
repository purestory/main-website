import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './MinesweeperWindow.css'

interface Score {
  name: string
  time: number
  date: string
}

interface MinesweeperScoresWindowProps {
  isVisible: boolean
  onClose: () => void
}

const MinesweeperScoresWindow: React.FC<MinesweeperScoresWindowProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('beginner')
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // 점수 로드
  const loadScores = async (difficulty: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/main-api/minesweeper/scores/${difficulty}`)
      const scoresData = await response.json()
      setScores(scoresData || [])
    } catch (error) {
      console.error('점수 로딩 오류:', error)
      setScores([])
    } finally {
      setLoading(false)
    }
  }

  // 모든 기록 삭제
  const resetAllScores = async () => {
    try {
      const response = await fetch('/main-api/minesweeper/scores', {
        method: 'DELETE'
      })
      const result = await response.json()
      
      if (result.success) {
        loadScores(activeTab)
        setShowPasswordDialog(false)
        setPassword('')
        setPasswordError('')
      } else {
        setPasswordError('기록 삭제에 실패했습니다: ' + result.error)
      }
    } catch (error) {
      console.error('기록 삭제 오류:', error)
      setPasswordError('기록 삭제 중 오류가 발생했습니다.')
    }
  }

  // 비밀번호 확인
  const handlePasswordSubmit = () => {
    if (password === '11111') {
      resetAllScores()
    } else {
      setPasswordError('비밀번호가 올바르지 않습니다.')
    }
  }

  // 탭 변경
  const handleTabChange = (difficulty: string) => {
    setActiveTab(difficulty)
    loadScores(difficulty)
  }

  // 새로고침
  const refreshScores = () => {
    loadScores(activeTab)
  }

  // 초기 로드
  useEffect(() => {
    if (isVisible) {
      loadScores(activeTab)
    }
  }, [isVisible, activeTab])

  // 비밀번호 대화상자 상태 디버깅
  useEffect(() => {
    console.log('showPasswordDialog 상태 변경:', showPasswordDialog)
    if (showPasswordDialog) {
      console.log('🔒 비밀번호 대화상자 렌더링 시도')
    }
  }, [showPasswordDialog])

  if (!isVisible) return null

  return (
    <>
      <div 
        className="window active" 
        style={{ 
          position: 'fixed',
          top: '100px',
          left: '200px',
          width: '450px',
          height: '400px',
          zIndex: 2000,
          display: 'block',
          opacity: 1,
          transform: 'scale(1)'
        }}
      >
        <div className="window-header">
          <span className="window-title">지뢰찾기 순위</span>
          <div>
            <button className="window-minimize-button" aria-label="Minimize"></button>
            <button className="window-maximize-button" aria-label="Maximize"></button>
            <button className="window-close-button" aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body scores-body">
          <div className="scores-tabs">
            <button 
              className={`scores-tab ${activeTab === 'beginner' ? 'active' : ''}`}
              onClick={() => handleTabChange('beginner')}
            >
              초급
            </button>
            <button 
              className={`scores-tab ${activeTab === 'intermediate' ? 'active' : ''}`}
              onClick={() => handleTabChange('intermediate')}
            >
              중급
            </button>
            <button 
              className={`scores-tab ${activeTab === 'expert' ? 'active' : ''}`}
              onClick={() => handleTabChange('expert')}
            >
              고급
            </button>
          </div>
          <div className="scores-content">
            {loading && <div id="scores-loading">로딩 중...</div>}
            <div className="scores-list">
              {!loading && scores.length === 0 && (
                <div className="no-scores">등록된 기록이 없습니다.</div>
              )}
              {!loading && scores.length > 0 && scores.map((score, index) => (
                <div key={index} className="score-item">
                  <div className="score-rank">{index + 1}.</div>
                  <div className="score-name">{score.name}</div>
                  <div className="score-time">{parseFloat(score.time.toString()).toFixed(2)}초</div>
                  <div className="score-date">{score.date}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="scores-buttons">
            <button 
              className="btn btn-danger"
              onClick={() => {
                console.log('기록 초기화 버튼 클릭됨')
                setShowPasswordDialog(true)
                console.log('showPasswordDialog 상태:', true)
              }}
            >
              기록 초기화
            </button>
            <button 
              className="btn btn-primary"
              onClick={refreshScores}
            >
              새로고침
            </button>
          </div>
        </div>
        <div className="resize-handle"></div>
      </div>

      {/* 비밀번호 대화상자 - Portal 방식 */}
      {showPasswordDialog && createPortal(
        <div 
          className="window dialog" 
          style={{ 
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '350px',
            minHeight: '220px',
            height: 'auto',
            zIndex: 99999,
            backgroundColor: '#c0c0c0',
            border: '2px outset #c0c0c0',
            display: 'block',
            visibility: 'visible'
          }}
        >
          <div className="window-header">
            <span className="window-title">비밀번호 입력</span>
            <div>
              <button 
                className="window-close-button" 
                aria-label="Close"
                onClick={() => {
                  console.log('🔒 비밀번호 창 닫기 버튼 클릭')
                  setShowPasswordDialog(false)
                  setPassword('')
                  setPasswordError('')
                }}
              ></button>
            </div>
          </div>
          <div className="window-body dialog-body" style={{ padding: '20px' }}>
            <div className="dialog-content">
              <div className="dialog-icon" style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
              <div className="dialog-message" style={{ marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                모든 기록을 삭제하시겠습니까?<br/>
                비밀번호를 입력하세요.
              </div>
              
              {passwordError && (
                <div style={{ 
                  color: '#d32f2f', 
                  backgroundColor: '#ffebee', 
                  border: '1px solid #f44336',
                  borderRadius: '4px',
                  padding: '8px',
                  marginBottom: '15px',
                  fontSize: '13px',
                  textAlign: 'center'
                }}>
                  {passwordError}
                </div>
              )}
              
              <div className="dialog-input-section" style={{ marginBottom: '25px' }}>
                <label htmlFor="password-input" style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>비밀번호:</label>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError('')
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handlePasswordSubmit()
                    }
                  }}
                  autoComplete="off"
                  autoFocus
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    fontSize: '14px',
                    border: passwordError ? '1px solid #f44336' : '1px solid #999',
                    borderRadius: '3px'
                  }}
                />
              </div>
              <div className="dialog-buttons" style={{ textAlign: 'center', marginBottom: '10px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handlePasswordSubmit}
                  style={{ marginRight: '10px', padding: '8px 16px', fontSize: '14px' }}
                >
                  확인
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    console.log('🔒 비밀번호 창 취소 버튼 클릭')
                    setShowPasswordDialog(false)
                    setPassword('')
                    setPasswordError('')
                  }}
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default MinesweeperScoresWindow 