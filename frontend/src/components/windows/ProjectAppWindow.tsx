import { useState } from 'react'

interface ProjectAppWindowProps {
  url: string
  title: string
}

const ProjectAppWindow: React.FC<ProjectAppWindowProps> = ({ url, title }) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleIframeError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const openInNewTab = () => {
    window.open(url, '_blank')
  }

  return (
    <div className="project-app-body">
      {isLoading && !hasError && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div>🔄 로딩 중...</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {title}을(를) 불러오고 있습니다.
          </div>
        </div>
      )}
      
      {hasError ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flexDirection: 'column',
          gap: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px' }}>🚫</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {title}을(를) 로드할 수 없습니다
          </div>
          <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
            이 서비스는 보안 정책으로 인해 iframe에서 로드할 수 없습니다.<br/>
            새 탭에서 열어서 사용하세요.
          </div>
          <button 
            onClick={openInNewTab}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0078d4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            새 탭에서 열기
          </button>
        </div>
      ) : (
        <iframe
          src={url}
          title={title}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '0 0 3px 3px',
            display: isLoading ? 'none' : 'block'
          }}
          allow="microphone; camera; fullscreen; autoplay; encrypted-media"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
        />
      )}
    </div>
  )
}

export default ProjectAppWindow 