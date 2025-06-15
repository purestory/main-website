import React, { useState, useEffect } from 'react'
import './SystemMonitorWindow.css'

interface SystemMonitorWindowProps {
  onClose?: () => void
}

interface SystemInfo {
  uptime: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkStatus: 'connected' | 'disconnected'
  activeProcesses: number
  platform?: string
  arch?: string
  hostname?: string
  totalMemory?: number
  freeMemory?: number
}

interface ProjectStatus {
  name: string
  status: 'running' | 'stopped' | 'error'
  port?: number
  url?: string
  lastChecked?: string
  service?: string
}

interface AppStatus {
  name: string
  status: 'active' | 'inactive' | 'error'
  url?: string
  port?: number
  lastChecked?: string
  error?: string
}

const SystemMonitorWindow: React.FC<SystemMonitorWindowProps> = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'projects' | 'apps'>('system')
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    uptime: '0d 0h 0m',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkStatus: 'connected',
    activeProcesses: 0
  })
  
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([])
  const [appStatuses, setAppStatuses] = useState<AppStatus[]>([])

  // 백엔드에서 실제 데이터 가져오기
  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch('/main-api/system/info')
        if (response.ok) {
          const data = await response.json()
          setSystemInfo(data)
        }
      } catch (error) {
        console.error('시스템 정보 조회 실패:', error)
      }
    }

    const fetchProjectStatuses = async () => {
      try {
        const response = await fetch('/main-api/system/projects')
        if (response.ok) {
          const data = await response.json()
          setProjectStatuses(data)
        }
      } catch (error) {
        console.error('프로젝트 상태 조회 실패:', error)
      }
    }

    const fetchAppStatuses = async () => {
      try {
        const response = await fetch('/main-api/system/external-apps')
        if (response.ok) {
          const data = await response.json()
          setAppStatuses(data)
        }
      } catch (error) {
        console.error('앱 상태 조회 실패:', error)
      }
    }

    // 초기 로드
    fetchSystemInfo()
    fetchProjectStatuses()
    fetchAppStatuses()

    // 주기적 업데이트
    const interval = setInterval(() => {
      fetchSystemInfo()
      fetchProjectStatuses()
      fetchAppStatuses()
    }, 10000) // 10초마다 업데이트

    return () => clearInterval(interval)
  }, [])



  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running':
      case 'active':
        return '#00aa00'
      case 'stopped':
      case 'inactive':
        return '#cc6600'
      case 'error':
        return '#cc0000'
      default:
        return '#000000'
    }
  }

  const getUsageBarColor = (percentage: number): string => {
    if (percentage < 50) return '#00aa00'
    if (percentage < 80) return '#cc6600'
    return '#cc0000'
  }

  const renderSystemTab = () => (
    <div className="monitor-content">
      <div className="system-overview">
        <h3>🖥️ 하드웨어 정보</h3>
        <ul style={{ listStyle: 'none', padding: '0', margin: '10px 0' }}>
          <li style={{ marginBottom: '8px' }}>운영체제: Windows Server 2012 R2</li>
          <li style={{ marginBottom: '8px' }}>CPU: Intel Core i9-13900HK @ 5.4GHz (14 Cores, 20 Threads)</li>
          <li style={{ marginBottom: '8px' }}>메모리: 32,768MB DDR4</li>
          <li style={{ marginBottom: '8px' }}>GPU: NVIDIA GeForce RTX 3090 24GB</li>
          <li style={{ marginBottom: '8px' }}>저장장치 1: NVMe 0: Crucial CT2000P3PSSD8 (2TB)</li>
          <li style={{ marginBottom: '8px' }}>저장장치 2: NVMe 1: WD Blue SN580 (1TB)</li>
          <li style={{ marginBottom: '8px' }}>광학드라이브: ASUS DVD-RW Drive</li>
        </ul>
      </div>

      <div className="system-status">
        <h3>📊 시스템 상태</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>호스트명:</label>
            <span>{systemInfo.hostname || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>플랫폼:</label>
            <span>{systemInfo.platform || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>아키텍처:</label>
            <span>{systemInfo.arch || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>시스템 가동시간:</label>
            <span>{systemInfo.uptime}</span>
          </div>
          <div className="info-item">
            <label>네트워크 상태:</label>
            <span style={{ color: systemInfo.networkStatus === 'connected' ? '#00aa00' : '#cc0000' }}>
              {systemInfo.networkStatus === 'connected' ? '연결됨' : '연결 끊김'}
            </span>
          </div>
          <div className="info-item">
            <label>활성 프로세스:</label>
            <span>{systemInfo.activeProcesses}</span>
          </div>
          <div className="info-item">
            <label>총 메모리:</label>
            <span>{systemInfo.totalMemory ? `${systemInfo.totalMemory} GB` : 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>사용 가능 메모리:</label>
            <span>{systemInfo.freeMemory ? `${systemInfo.freeMemory} GB` : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="resource-usage">
        <h3>📊 리소스 사용량</h3>
        <div className="usage-item">
          <label>CPU 사용률:</label>
          <div className="usage-bar">
            <div 
              className="usage-fill" 
              style={{ 
                width: `${systemInfo.cpuUsage}%`,
                backgroundColor: getUsageBarColor(systemInfo.cpuUsage)
              }}
            />
          </div>
          <span>{systemInfo.cpuUsage.toFixed(1)}%</span>
        </div>
        
        <div className="usage-item">
          <label>메모리 사용률:</label>
          <div className="usage-bar">
            <div 
              className="usage-fill" 
              style={{ 
                width: `${systemInfo.memoryUsage}%`,
                backgroundColor: getUsageBarColor(systemInfo.memoryUsage)
              }}
            />
          </div>
          <span>{systemInfo.memoryUsage.toFixed(1)}%</span>
        </div>
        
        <div className="usage-item">
          <label>디스크 사용률:</label>
          <div className="usage-bar">
            <div 
              className="usage-fill" 
              style={{ 
                width: `${systemInfo.diskUsage}%`,
                backgroundColor: getUsageBarColor(systemInfo.diskUsage)
              }}
            />
          </div>
          <span>{systemInfo.diskUsage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )

  const renderProjectsTab = () => (
    <div className="monitor-content">
      <div className="projects-status">
        <h3>🚀 프로젝트 상태</h3>
        <div className="status-table">
          <div className="status-header">
            <span>프로젝트</span>
            <span>상태</span>
            <span>포트</span>
            <span>마지막 확인</span>
          </div>
          {projectStatuses.map((project, index) => (
            <div key={index} className="status-row">
              <span>{project.name}</span>
              <span style={{ color: getStatusColor(project.status) }}>
                ● {project.status}
              </span>
              <span>{project.port || 'N/A'}</span>
              <span>{project.lastChecked ? new Date(project.lastChecked).toLocaleString() : 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>⚡ 빠른 작업</h3>
        <div className="action-buttons">
          <button className="action-btn">프로젝트 재시작</button>
          <button className="action-btn">로그 보기</button>
          <button className="action-btn">백업 생성</button>
          <button className="action-btn">상태 새로고침</button>
        </div>
      </div>
    </div>
  )

  const renderAppsTab = () => (
    <div className="monitor-content">
      <div className="apps-status">
        <h3>📱 앱 상태</h3>
        <div className="status-table">
          <div className="status-header">
            <span>앱 이름</span>
            <span>상태</span>
            <span>포트</span>
            <span>마지막 확인</span>
          </div>
          {appStatuses.map((app, index) => (
            <div key={index} className="status-row">
              <span>{app.name}</span>
              <span style={{ color: getStatusColor(app.status) }}>
                ● {app.status}
              </span>
              <span>{app.port || 'N/A'}</span>
              <span>{app.lastChecked ? new Date(app.lastChecked).toLocaleString() : 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="app-summary">
        <h3>📈 앱 요약</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <label>총 앱 수:</label>
            <span>{appStatuses.length}</span>
          </div>
          <div className="summary-item">
            <label>활성 앱:</label>
            <span style={{ color: '#00aa00' }}>
              {appStatuses.filter(app => app.status === 'active').length}
            </span>
          </div>
          <div className="summary-item">
            <label>비활성 앱:</label>
            <span style={{ color: '#cc6600' }}>
              {appStatuses.filter(app => app.status === 'inactive').length}
            </span>
          </div>
          <div className="summary-item">
            <label>오류 앱:</label>
            <span style={{ color: '#cc0000' }}>
              {appStatuses.filter(app => app.status === 'error').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="system-monitor">
      <div className="monitor-tabs">
        <button 
          className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          시스템
        </button>
        <button 
          className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          프로젝트
        </button>
        <button 
          className={`tab-button ${activeTab === 'apps' ? 'active' : ''}`}
          onClick={() => setActiveTab('apps')}
        >
          앱
        </button>
      </div>

      <div className="monitor-body">
        {activeTab === 'system' && renderSystemTab()}
        {activeTab === 'projects' && renderProjectsTab()}
        {activeTab === 'apps' && renderAppsTab()}
      </div>
    </div>
  )
}

export default SystemMonitorWindow 