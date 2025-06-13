import React, { useState } from 'react'

const SettingsWindow: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('display')

  const categories = [
    { id: 'display', name: '화면', icon: '🖥️' },
    { id: 'sound', name: '소리', icon: '🔊' },
    { id: 'network', name: '네트워크', icon: '🌐' },
    { id: 'system', name: '시스템', icon: '⚙️' },
    { id: 'security', name: '보안', icon: '🔒' },
    { id: 'updates', name: '업데이트', icon: '🔄' }
  ]

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'display':
        return (
          <div>
            <h4>화면 설정</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>해상도:</label>
              <select style={{ width: '200px', padding: '4px' }}>
                <option>1920 x 1080 (권장)</option>
                <option>1680 x 1050</option>
                <option>1440 x 900</option>
                <option>1024 x 768</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>색 품질:</label>
              <select style={{ width: '200px', padding: '4px' }}>
                <option>최고 (32비트)</option>
                <option>중간 (16비트)</option>
              </select>
            </div>
            <div>
              <label>
                <input type="checkbox" style={{ marginRight: '8px' }} />
                화면 보호기 사용
              </label>
            </div>
          </div>
        )
      case 'sound':
        return (
          <div>
            <h4>소리 설정</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>마스터 볼륨:</label>
              <input type="range" min="0" max="100" defaultValue="75" style={{ width: '200px' }} />
              <span style={{ marginLeft: '10px' }}>75%</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>
                <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                시스템 소리 사용
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" style={{ marginRight: '8px' }} />
                음소거
              </label>
            </div>
          </div>
        )
      case 'network':
        return (
          <div>
            <h4>네트워크 설정</h4>
            <div style={{ marginBottom: '15px' }}>
              <p><strong>연결 상태:</strong> <span style={{ color: 'green' }}>연결됨</span></p>
              <p><strong>IP 주소:</strong> 192.168.1.100</p>
              <p><strong>서브넷 마스크:</strong> 255.255.255.0</p>
              <p><strong>게이트웨이:</strong> 192.168.1.1</p>
            </div>
            <button style={{ padding: '8px 16px', marginRight: '10px' }}>네트워크 진단</button>
            <button style={{ padding: '8px 16px' }}>고급 설정</button>
          </div>
        )
      case 'system':
        return (
          <div>
            <h4>시스템 정보</h4>
            <div style={{ marginBottom: '15px' }}>
              <p><strong>운영체제:</strong> Windows Server 2012 R2</p>
              <p><strong>프로세서:</strong> Intel Core i9-13900HK @ 5.4GHz</p>
              <p><strong>메모리:</strong> 32,768MB DDR4</p>
              <p><strong>그래픽:</strong> NVIDIA GeForce RTX 3090 24GB</p>
            </div>
            <button style={{ padding: '8px 16px', marginRight: '10px' }}>시스템 정보</button>
            <button style={{ padding: '8px 16px' }}>장치 관리자</button>
          </div>
        )
      case 'security':
        return (
          <div>
            <h4>보안 설정</h4>
            <div style={{ marginBottom: '15px' }}>
              <label>
                <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                방화벽 사용
              </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>
                <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                자동 업데이트
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" style={{ marginRight: '8px' }} />
                원격 데스크톱 허용
              </label>
            </div>
          </div>
        )
      case 'updates':
        return (
          <div>
            <h4>Windows 업데이트</h4>
            <div style={{ marginBottom: '15px' }}>
              <p><strong>마지막 확인:</strong> 2024년 1월 15일</p>
              <p><strong>상태:</strong> <span style={{ color: 'green' }}>최신 상태</span></p>
            </div>
            <button style={{ padding: '8px 16px', marginRight: '10px' }}>업데이트 확인</button>
            <button style={{ padding: '8px 16px' }}>업데이트 기록</button>
          </div>
        )
      default:
        return <div>설정을 선택하세요.</div>
    }
  }

  return (
    <div className="settings-body" style={{ display: 'flex', height: '100%' }}>
      {/* 왼쪽 카테고리 목록 */}
      <div style={{ 
        width: '200px', 
        borderRight: '1px solid #ddd', 
        padding: '10px',
        backgroundColor: '#f8f8f8'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '15px' }}>⚙️ 설정</h4>
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              marginBottom: '5px',
              backgroundColor: selectedCategory === category.id ? '#e3f2fd' : 'transparent',
              border: selectedCategory === category.id ? '1px solid #2196f3' : '1px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ marginRight: '8px' }}>{category.icon}</span>
            {category.name}
          </div>
        ))}
      </div>
      
      {/* 오른쪽 설정 내용 */}
      <div style={{ flex: 1, padding: '20px' }}>
        {renderCategoryContent()}
      </div>
    </div>
  )
}

export default SettingsWindow 