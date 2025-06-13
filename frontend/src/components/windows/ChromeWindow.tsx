import { useState } from 'react'

const ChromeWindow = () => {
  const [inputUrl, setInputUrl] = useState('https://oo.ai') // 주소창에 입력되는 URL
  const [currentUrl, setCurrentUrl] = useState('https://oo.ai') // 실제 iframe에서 로드되는 URL

  const formatUrl = (url: string) => {
    // 빈 문자열이면 그대로 반환
    if (!url.trim()) return url
    
    // 이미 http:// 또는 https://로 시작하면 그대로 반환
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // 그렇지 않으면 https:// 추가
    return `https://${url}`
  }

  const handleGo = () => {
    const formattedUrl = formatUrl(inputUrl)
    setCurrentUrl(formattedUrl)
    setInputUrl(formattedUrl) // 주소창도 포맷된 URL로 업데이트
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGo()
    }
  }

  return (
    <div className="chrome-browser">
      <div className="chrome-url-bar">
        <input 
          type="text" 
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="주소를 입력하세요"
        />
        <button onClick={handleGo}>이동</button>
      </div>
      <iframe 
        id="chromeFrame"
        src={currentUrl} 
        style={{ 
          width: '100%', 
          height: 'calc(100% - 40px)', 
          border: 'none' 
        }}
        allow="microphone; camera; fullscreen; autoplay; encrypted-media"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"
      />
    </div>
  )
}

export default ChromeWindow 