import React from 'react'
import './MinesweeperWindow.css'

interface MinesweeperAboutWindowProps {
  isVisible: boolean
  onClose: () => void
}

const MinesweeperAboutWindow: React.FC<MinesweeperAboutWindowProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div 
      className="window active" 
      style={{ 
        position: 'fixed',
        top: '150px',
        left: '250px',
        width: '400px',
        height: '280px',
        zIndex: 2000,
        display: 'block',
        opacity: 1,
        transform: 'scale(1)'
      }}
    >
      <div className="window-header">
        <span className="window-title">지뢰찾기 정보</span>
        <div>
          <button className="window-minimize-button" aria-label="Minimize"></button>
          <button className="window-maximize-button" aria-label="Maximize"></button>
          <button className="window-close-button" aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body">
        <div style={{ padding: '15px', lineHeight: '1.6', fontSize: '14px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💣</div>
            <h2 style={{ margin: '0', fontSize: '18px' }}>지뢰찾기 (Minesweeper)</h2>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '15px' }}>게임 방법:</strong>
            <ul style={{ marginTop: '6px', paddingLeft: '18px', fontSize: '13px' }}>
              <li>좌클릭: 셀 공개</li>
              <li>우클릭: 깃발 설치/제거</li>
              <li>가운데 클릭 또는 좌우 동시 클릭: 주변 셀 자동 공개</li>
            </ul>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '15px' }}>승리 조건:</strong>
            <ul style={{ marginTop: '6px', paddingLeft: '18px', fontSize: '13px' }}>
              <li>모든 지뢰가 아닌 셀을 공개하면 승리</li>
            </ul>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '15px' }}>난이도:</strong>
            <ul style={{ marginTop: '6px', paddingLeft: '18px', fontSize: '13px' }}>
              <li>초급: 9×9, 지뢰 10개</li>
              <li>중급: 16×16, 지뢰 40개</li>
              <li>고급: 16×30, 지뢰 99개</li>
            </ul>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              className="btn btn-primary"
              onClick={onClose}
              style={{ padding: '8px 20px', fontSize: '14px' }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
      <div className="resize-handle"></div>
    </div>
  )
}

export default MinesweeperAboutWindow 