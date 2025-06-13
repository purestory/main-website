import { useState } from 'react'

const ChromeWindow = () => {
  const [url, setUrl] = useState('https://oo.ai')

  const handleGo = () => {
    // iframe의 src를 업데이트하기 위해 state를 변경
    const iframe = document.getElementById('chromeFrame') as HTMLIFrameElement
    if (iframe) {
      iframe.src = url
    }
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
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://oo.ai"
        />
        <button onClick={handleGo}>이동</button>
      </div>
      <iframe 
        id="chromeFrame"
        src={url} 
        style={{ 
          width: '100%', 
          height: 'calc(100% - 40px)', 
          border: 'none' 
        }} 
      />
    </div>
  )
}

export default ChromeWindow 