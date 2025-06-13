import React from 'react'

const DocumentsWindow: React.FC = () => {
  return (
    <div className="documents-body" style={{ padding: '15px', height: '100%', overflow: 'auto' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0066cc' }}>📄 내 문서</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="folder-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>📁</span>
          <span>바탕 화면</span>
        </div>
        
        <div className="folder-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>📁</span>
          <span>내 문서</span>
        </div>
        
        <div className="folder-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>🖼️</span>
          <span>내 그림</span>
        </div>
        
        <div className="folder-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>🎵</span>
          <span>내 음악</span>
        </div>
        
        <div className="folder-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>🎬</span>
          <span>내 비디오</span>
        </div>
        
        <div className="folder-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>📥</span>
          <span>다운로드</span>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
          💡 팁: 폴더를 더블클릭하여 내용을 확인할 수 있습니다.
        </p>
      </div>
    </div>
  )
}

export default DocumentsWindow 