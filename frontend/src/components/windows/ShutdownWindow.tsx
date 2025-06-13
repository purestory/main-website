import React, { useState } from 'react'

const ShutdownWindow: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('shutdown')
  const [isProcessing, setIsProcessing] = useState(false)

  const shutdownOptions = [
    { 
      id: 'shutdown', 
      name: '시스템 종료', 
      icon: '🔌', 
      description: '컴퓨터를 완전히 끕니다.' 
    },
    { 
      id: 'restart', 
      name: '다시 시작', 
      icon: '🔄', 
      description: '컴퓨터를 다시 시작합니다.' 
    },
    { 
      id: 'standby', 
      name: '대기 모드', 
      icon: '😴', 
      description: '컴퓨터를 대기 상태로 전환합니다.' 
    },
    { 
      id: 'hibernate', 
      name: '최대 절전 모드', 
      icon: '💤', 
      description: '현재 상태를 저장하고 전원을 끕니다.' 
    },
    { 
      id: 'logoff', 
      name: '로그오프', 
      icon: '👤', 
      description: '현재 사용자를 로그오프합니다.' 
    }
  ]

  const handleAction = () => {
    const option = shutdownOptions.find(opt => opt.id === selectedOption)
    if (!option) return

    setIsProcessing(true)
    
    // 시뮬레이션
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="shutdown-body" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0066cc' }}>🔌 Windows 종료</h3>
        
        <p style={{ marginBottom: '20px', fontSize: '14px' }}>
          수행할 작업을 선택하십시오:
        </p>
      </div>

      <div style={{ flex: 1, marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {shutdownOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                border: selectedOption === option.id ? '2px solid #0066cc' : '2px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedOption === option.id ? '#f0f8ff' : 'white'
              }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '24px',
                marginRight: '15px'
              }}>
                {option.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '4px',
                  color: selectedOption === option.id ? '#0066cc' : '#333'
                }}>
                  {option.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {option.description}
                </div>
              </div>
              <div style={{ marginLeft: '10px' }}>
                <input
                  type="radio"
                  name="shutdownOption"
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        borderTop: '1px solid #ddd', 
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '12px', color: '#666' }}>
          ⚠️ 저장하지 않은 작업이 손실될 수 있습니다.
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#f0f0f0',
              border: '2px outset #c0c0c0',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
          <button
            onClick={handleAction}
            disabled={isProcessing}
            style={{
              padding: '10px 20px',
              backgroundColor: isProcessing ? '#ccc' : '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isProcessing ? '처리 중...' : '확인'}
          </button>
        </div>
      </div>

      {isProcessing && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {shutdownOptions.find(opt => opt.id === selectedOption)?.name} 중...
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            잠시만 기다려 주세요.
          </div>
        </div>
      )}
    </div>
  )
}

export default ShutdownWindow 