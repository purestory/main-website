import React, { useState } from 'react'

const RunWindow: React.FC = () => {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>([
    'calc',
    'notepad',
    'mspaint',
    'cmd',
    'regedit'
  ])

  const commonCommands = [
    { cmd: 'calc', desc: '계산기' },
    { cmd: 'notepad', desc: '메모장' },
    { cmd: 'mspaint', desc: '그림판' },
    { cmd: 'cmd', desc: '명령 프롬프트' },
    { cmd: 'regedit', desc: '레지스트리 편집기' },
    { cmd: 'msconfig', desc: '시스템 구성' },
    { cmd: 'dxdiag', desc: 'DirectX 진단 도구' },
    { cmd: 'control', desc: '제어판' }
  ]

  const handleRun = () => {
    if (!command.trim()) return

    // 히스토리에 추가 (중복 제거)
    if (!history.includes(command)) {
      setHistory(prev => [command, ...prev.slice(0, 9)]) // 최대 10개 유지
    }
    
    setCommand('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRun()
    }
  }

  const handleCommandClick = (cmd: string) => {
    setCommand(cmd)
  }

  return (
    <div className="run-body" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0066cc' }}>▶️ 실행</h3>
        
        <p style={{ marginBottom: '15px', fontSize: '14px' }}>
          실행할 프로그램, 폴더, 문서 또는 인터넷 리소스의 이름을 입력하십시오.
        </p>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            열기(O):
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="명령어를 입력하세요..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '2px inset #c0c0c0',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleRun}
              style={{
                padding: '8px 20px',
                backgroundColor: '#c0c0c0',
                border: '2px outset #c0c0c0',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              확인
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCommand('')}
            style={{
              padding: '8px 20px',
              backgroundColor: '#c0c0c0',
              border: '2px outset #c0c0c0',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
          <button
            style={{
              padding: '8px 20px',
              backgroundColor: '#c0c0c0',
              border: '2px outset #c0c0c0',
              cursor: 'pointer'
            }}
          >
            찾아보기...
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '20px' }}>
        {/* 자주 사용하는 명령어 */}
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: '10px' }}>자주 사용하는 명령어</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {commonCommands.map((item, index) => (
              <div
                key={index}
                onClick={() => handleCommandClick(item.cmd)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{item.cmd}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 사용한 명령어 */}
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: '10px' }}>최근 사용한 명령어</h4>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {history.map((cmd, index) => (
                <div
                  key={index}
                  onClick={() => handleCommandClick(cmd)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    fontFamily: 'monospace'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {cmd}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontSize: '12px' }}>최근 사용한 명령어가 없습니다.</p>
          )}
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        💡 팁: Enter 키를 눌러 명령을 실행하거나, 아래 목록에서 명령을 클릭하세요.
      </div>
    </div>
  )
}

export default RunWindow 