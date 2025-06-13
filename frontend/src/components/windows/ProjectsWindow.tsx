import amicaIcon from '../../assets/images/amica_ai_icon.png'
import translationIcon from '../../assets/images/translation_service_icon.png'
import openwebuiIcon from '../../assets/images/openwebui-icon.png'

interface Project {
  name: string
  description: string
  link: string
  type: 'AI/ML Service' | 'Web Service' | 'Dev/Ops Tool'
  status: 'Active' | 'Docker'
  iconUrl?: string
}

const ProjectsWindow = () => {
  const projectsData: Project[] = [
    // AI/ML 서비스
    { name: 'OpenWebUI', description: 'Ollama용 웹 인터페이스', link: 'http://itsmyzone.iptime.org:3000/', type: 'AI/ML Service', status: 'Docker', iconUrl: openwebuiIcon },
    { name: 'Amica AI', description: '3D AI 가상 비서 (내부용)', link: '/amica/', type: 'AI/ML Service', status: 'Active', iconUrl: amicaIcon },
    { name: 'Translation Service', description: 'AI 기반 다중 엔진 번역', link: '/translation/', type: 'AI/ML Service', status: 'Active', iconUrl: translationIcon },
    { name: 'Whisper STT', description: '고속 음성-텍스트 변환 (100+ 언어)', link: '/whisper/', type: 'AI/ML Service', status: 'Active' },
    { name: 'EdgeTTS', description: 'Microsoft Edge 고품질 TTS', link: '/edgetts/', type: 'AI/ML Service', status: 'Active' },
    { name: 'Zonos TTS', description: '고품질 텍스트-음성 변환 (200k시간 학습)', link: '/zonos/', type: 'AI/ML Service', status: 'Active' },
    { name: 'Kokoro FastAPI', description: '다국어 TTS 서비스', link: 'http://itsmyzone.iptime.org:3200/web/', type: 'AI/ML Service', status: 'Docker' },

    // 웹 서비스
    { name: 'N8N', description: '워크플로우 자동화', link: 'http://itsmyzone.iptime.org:5678/', type: 'Web Service', status: 'Docker' },
    { name: 'Tribler', description: 'P2P 파일 공유', link: '/tribler/', type: 'Web Service', status: 'Docker' },
    { name: 'Cobalt', description: '소셜 미디어 다운로더', link: '/cobalt/', type: 'Web Service', status: 'Active' }
  ]

  const getProjectIcon = (project: Project): string => {
    if (project.iconUrl) {
      return project.iconUrl
    }

    // 각 프로젝트별 맞춤 이모지
    switch (project.name) {
      // AI/ML 서비스들
      case 'OpenWebUI':
        return '🤖' // AI 인터페이스
      case 'Whisper STT':
        return '🎤' // 음성-텍스트 변환
      case 'EdgeTTS':
        return '🔊' // 텍스트-음성 변환
      case 'Zonos TTS':
        return '🗣️' // 고품질 TTS
      case 'Kokoro FastAPI':
        return '🎵' // 다국어 TTS
      
      // 웹 서비스들
      case '파일 탐색기':
        return '📁' // 파일 탐색기
      case 'N8N':
        return '⚙️' // 워크플로우 자동화
      case 'Tribler':
        return '🔗' // P2P 파일 공유
      case 'Cobalt':
        return '📥' // 소셜 미디어 다운로더
      
      // 타입별 기본값 (새로운 프로젝트용)
      default:
        switch (project.type) {
          case 'AI/ML Service':
            return '🤖' // Robot for AI/ML
          case 'Web Service':
            return '🌐' // Globe for Web
          case 'Dev/Ops Tool':
            return '🛠️' // Hammer and wrench for Dev/Ops
          default:
            return '📁' // Default folder
        }
    }
  }

  const handleProjectClick = (project: Project) => {
    if (project.link && project.link !== '#') {
      window.open(project.link, '_blank')
    }
  }

  return (
    <div className="project-icons-container">
      {projectsData.map((project) => (
        <a
          key={project.name}
          className="project-icon-item"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handleProjectClick(project)
          }}
          title={`${project.name} - ${project.description}\n종류: ${project.type}\n상태: ${project.status}`}
        >
          <div className="project-icon-image">
            {project.iconUrl ? (
              <img 
                src={project.iconUrl} 
                alt={project.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              getProjectIcon(project)
            )}
          </div>
          <span className="project-icon-label">{project.name}</span>
        </a>
      ))}
    </div>
  )
}

export default ProjectsWindow 