export interface ProjectData {
  name: string
  description: string
  link: string
  type: string
  status: string
  iconUrl?: string
}

export const projectsData: ProjectData[] = [
  // AI/ML 서비스
  { name: 'OpenWebUI', description: 'Ollama용 웹 인터페이스', link: 'http://itsmyzone.iptime.org:3000/', type: 'AI/ML Service', status: 'Docker', iconUrl: 'images/openwebui-icon.png' },
  { name: 'Amica AI', description: '3D AI 가상 비서 (내부용)', link: '/amica/', type: 'AI/ML Service', status: 'Active', iconUrl: 'images/amica_ai_icon.png' },
  { name: 'Translation Service', description: 'AI 기반 다중 엔진 번역', link: '/translation/', type: 'AI/ML Service', status: 'Active', iconUrl: 'images/translation_service_icon.png' },
  { name: 'Whisper STT', description: '고속 음성-텍스트 변환 (100+ 언어)', link: '/whisper/', type: 'AI/ML Service', status: 'Active' },
  { name: 'EdgeTTS', description: 'Microsoft Edge 고품질 TTS', link: '/edgetts/', type: 'AI/ML Service', status: 'Active' },
  { name: 'Zonos TTS', description: '고품질 텍스트-음성 변환 (200k시간 학습)', link: '/zonos/', type: 'AI/ML Service', status: 'Active' },
  { name: 'Kokoro FastAPI', description: '다국어 TTS 서비스', link: 'http://itsmyzone.iptime.org:3200/web/', type: 'AI/ML Service', status: 'Docker' },

  // 웹 서비스
  { name: 'N8N', description: '워크플로우 자동화', link: 'http://itsmyzone.iptime.org:5678/', type: 'Web Service', status: 'Docker' },
  { name: 'Tribler', description: 'P2P 파일 공유', link: '/tribler/', type: 'Web Service', status: 'Docker' },
  { name: 'Cobalt', description: '소셜 미디어 다운로더', link: '/cobalt/', type: 'Web Service', status: 'Active' }
]

export const builtInPrograms = [
  { name: 'Calculator', emoji: '🧮', isImage: true, imageSrc: 'images/calculator-icon.png', windowId: 'calculator-app-window' },
  { name: 'Minesweeper', emoji: '💣', windowId: 'minesweeper-app-window' },
  { name: 'Paint', emoji: '🎨', windowId: 'paint-app-window' },
  { name: '파일 탐색기', emoji: '📁', isImage: true, imageSrc: 'images/explorer_ICO_MYCOMPUTER.ico', windowId: 'explorer-app-window' },
  { name: 'Chrome', emoji: '🌐', isImage: true, imageSrc: 'images/chrome-logo.svg', windowId: 'chrome-app-window' },
  { name: 'YouTube', emoji: '📺', isImage: true, imageSrc: 'images/youtube-logo.svg', windowId: 'youtube-app-window' }
]

export const getProjectEmoji = (project: ProjectData): string => {
  switch (project.name) {
    // AI/ML 서비스들
    case 'OpenWebUI': return '🤖'
    case 'Whisper STT': return '🎤'
    case 'EdgeTTS': return '🔊'
    case 'Zonos TTS': return '🗣️'
    case 'Kokoro FastAPI': return '🎵'
    // 웹 서비스들
    case 'N8N': return '⚙️'
    case 'Tribler': return '🔗'
    case 'Cobalt': return '📥'
    // 타입별 기본값
    default:
      switch (project.type) {
        case 'AI/ML Service': return '🤖'
        case 'Web Service': return '🌐'
        case 'Dev/Ops Tool': return '🛠️'
        default: return '📁'
      }
  }
} 