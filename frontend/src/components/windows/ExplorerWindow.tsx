import React from 'react'

const ExplorerWindow: React.FC = () => {
  return (
    <div className="explorer-app-body" style={{ height: '100%', width: '100%' }}>
      <iframe 
        src="/explorer/"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          background: '#f0f0f0'
        }}
        title="파일 탐색기"
        loading="lazy"
      />
    </div>
  )
}

export default ExplorerWindow 