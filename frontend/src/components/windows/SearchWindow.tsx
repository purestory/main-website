import React, { useState } from 'react'

const SearchWindow: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const mockResults = [
    { name: '내 컴퓨터', type: '시스템', icon: '🖥️', path: 'C:\\' },
    { name: 'OpenWebUI', type: '프로그램', icon: '🤖', path: 'Programs\\OpenWebUI' },
    { name: '계산기', type: '프로그램', icon: '🧮', path: 'Programs\\Calculator' },
    { name: '지뢰찾기', type: '게임', icon: '💣', path: 'Programs\\Games\\Minesweeper' },
    { name: '내 문서', type: '폴더', icon: '📁', path: 'C:\\Users\\Documents' },
    { name: '바탕화면', type: '폴더', icon: '📁', path: 'C:\\Users\\Desktop' },
    { name: '제어판', type: '시스템', icon: '⚙️', path: 'Control Panel' },
    { name: 'Chrome', type: '프로그램', icon: '🌐', path: 'Programs\\Chrome' }
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // 검색 시뮬레이션
    setTimeout(() => {
      const filtered = mockResults.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filtered)
      setIsSearching(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="search-body" style={{ padding: '15px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0066cc' }}>🔍 검색</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="파일, 폴더, 프로그램 검색..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              opacity: isSearching ? 0.6 : 1
            }}
          >
            {isSearching ? '검색 중...' : '검색'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => { setSearchQuery('프로그램'); handleSearch(); }}
            style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }}
          >
            프로그램
          </button>
          <button 
            onClick={() => { setSearchQuery('문서'); handleSearch(); }}
            style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }}
          >
            문서
          </button>
          <button 
            onClick={() => { setSearchQuery('시스템'); handleSearch(); }}
            style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }}
          >
            시스템
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {searchResults.length > 0 && (
          <div>
            <h4 style={{ marginBottom: '10px' }}>검색 결과 ({searchResults.length}개)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '20px', marginRight: '12px' }}>{result.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{result.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{result.type} • {result.path}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
            <p>"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
            <p style={{ fontSize: '12px' }}>다른 검색어를 시도해보세요.</p>
          </div>
        )}

        {!searchQuery && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
            <p>검색어를 입력하여 파일, 폴더, 프로그램을 찾아보세요.</p>
            <p style={{ fontSize: '12px' }}>위의 빠른 검색 버튼을 사용할 수도 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchWindow 