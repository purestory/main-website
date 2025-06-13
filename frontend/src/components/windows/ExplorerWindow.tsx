import React from 'react'

const ExplorerWindow: React.FC = () => {
  return (
    <div className="explorer-app-body" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <iframe 
        src="/explorer/"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          background: '#f0f0f0',
          overflow: 'hidden'
        }}
        title="파일 탐색기"
        loading="lazy"
        scrolling="no"
      />
    </div>
  )
}

export default ExplorerWindow 