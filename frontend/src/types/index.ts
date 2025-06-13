// Boot 관련 타입
export interface BootState {
  currentPhase: 'post' | 'boot' | 'desktop'
  progress: number
  messages: string[]
}

// Window 관련 타입 - 단순화
export interface WindowState {
  id: string
  title: string
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

// 데스크톱 아이콘 타입
export interface DesktopIcon {
  id: string
  label: string
  image: string
  windowId: string
}

// 프로젝트 관련 타입
export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
  created_at: string
}

// 지뢰찾기 관련 타입 - 기존 구조 복원
export interface MinesweeperSettings {
  rows: number
  cols: number
  mines: number
  cellSize: number
}

export interface MinesweeperCell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export interface GameState {
  grid: MinesweeperCell[][]
  gameStatus: 'playing' | 'won' | 'lost'
  minesLeft: number
  timeElapsed: number
  isFirstClick: boolean
  gameStartTime: number | null
  isGameOver: boolean
  isWin: boolean
  flagsUsed: number
  revealedCells: number
}

// 앱 전체 상태 타입
export interface AppState {
  bootState: BootState
  windows: WindowState[]
} 