import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import MinesweeperScoresWindow from './MinesweeperScoresWindow'
import MinesweeperAboutWindow from './MinesweeperAboutWindow'
import './MinesweeperWindow.css'

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

interface Difficulty {
  rows: number
  cols: number
  mines: number
  cellSize: number
}

interface MinesweeperWindowProps {
  onResize?: (width: number, height: number) => void
  onClose?: () => void
}

const MinesweeperWindow: React.FC<MinesweeperWindowProps> = ({ onResize, onClose }) => {
  const difficulties: Record<string, Difficulty> = {
    beginner: { rows: 9, cols: 9, mines: 10, cellSize: 25 },
    intermediate: { rows: 16, cols: 16, mines: 40, cellSize: 25 },
    expert: { rows: 16, cols: 30, mines: 99, cellSize: 25 }
  }

  const [currentDifficulty, setCurrentDifficulty] = useState('beginner')
  const [settings, setSettings] = useState<Difficulty>(difficulties.beginner)
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [flagsUsed, setFlagsUsed] = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [showHelpMenu, setShowHelpMenu] = useState(false)
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false)
  const [showScoresWindow, setShowScoresWindow] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // 창 크기 계산
  const calculateWindowSize = (difficulty: Difficulty) => {
    const headerHeight = 35  // 윈도우 헤더
    const menubarHeight = 30  // 메뉴바 높이 (padding 포함)
    const gameInfoHeight = 51  // 게임 정보 영역 (35px + padding)
    const boardPadding = 16  // 게임 보드 padding
    const boardBorder = 2   // 게임 보드 border
    const cellGap = 1       // 셀 간격
    
    // 너비 계산: 셀 크기 * 열 수 + 간격 + 패딩 + 테두리
    const boardWidth = difficulty.cols * difficulty.cellSize + (difficulty.cols - 1) * cellGap
    const width = Math.max(
      boardWidth + boardPadding * 2 + boardBorder * 2 + 16,
      300  // 최소 너비
    )
    
    // 높이 계산: 헤더 + 메뉴 + 게임정보 + 보드 (아래쪽 여백 최소화)
    const boardHeight = difficulty.rows * difficulty.cellSize + (difficulty.rows - 1) * cellGap
    const height = headerHeight + menubarHeight + gameInfoHeight + 
                   boardHeight + boardPadding * 2 + boardBorder * 2 + 8

    console.log('창 크기 계산:', { width, height, difficulty, boardWidth, boardHeight })
    return { width, height }
  }

  // 게임 초기화
  const initializeGame = (gameSettings: Difficulty = settings) => {
    console.log('🎮 게임 초기화:', gameSettings)
    
    setSettings(gameSettings)
    setGameStarted(false)
    setGameOver(false)
    setIsWin(false)
    setElapsedTime(0)
    setFlagsUsed(0)
    setRevealedCount(0)
    setShowGameMenu(false)
    setShowHelpMenu(false)
    setShowDifficultyMenu(false)
    setShowAboutDialog(false)
    setSaveMessage('')
    setIsSaving(false)
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    startTimeRef.current = null
    
    // 빈 보드 생성
    const newBoard: Cell[][] = []
    for (let r = 0; r < gameSettings.rows; r++) {
      const row: Cell[] = []
      for (let c = 0; c < gameSettings.cols; c++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0
        })
      }
      newBoard.push(row)
    }
    setBoard(newBoard)
    
    // 창 크기 변경 알림
    if (onResize) {
      const { width, height } = calculateWindowSize(gameSettings)
      console.log('게임 초기화로 인한 창 크기 변경:', { width, height })
      onResize(width, height)
    }
  }

  // 지뢰 배치
  const placeMines = (firstClickRow: number, firstClickCol: number, gameBoard: Cell[][]) => {
    console.log('💣 지뢰 배치 시작')
    
    const newBoard = gameBoard.map(row => row.map(cell => ({ ...cell })))
    const minePositions: [number, number][] = []
    
    while (minePositions.length < settings.mines) {
      const row = Math.floor(Math.random() * settings.rows)
      const col = Math.floor(Math.random() * settings.cols)
      
      // 첫 클릭 위치와 인접한 위치는 제외
      const isFirstClick = row === firstClickRow && col === firstClickCol
      const isAdjacent = Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1
      const alreadyHasMine = minePositions.some(([r, c]) => r === row && c === col)
      
      if (!isFirstClick && !isAdjacent && !alreadyHasMine) {
        minePositions.push([row, col])
        newBoard[row][col].isMine = true
      }
    }
    
    // 인접 지뢰 수 계산
    for (let r = 0; r < settings.rows; r++) {
      for (let c = 0; c < settings.cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr
              const nc = c + dc
              if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
                if (newBoard[nr][nc].isMine) count++
              }
            }
          }
          newBoard[r][c].adjacentMines = count
        }
      }
    }
    
    return newBoard
  }

  // 타이머 시작
  const startTimer = () => {
    console.log('⏰ 타이머 시작')
    if (timerRef.current) return
    
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsedMs = Date.now() - startTimeRef.current
        const seconds = Math.floor(elapsedMs / 1000)
        const centiseconds = Math.floor((elapsedMs % 1000) / 10)
        const displayTime = seconds + (centiseconds / 100)
        setElapsedTime(displayTime)
      }
    }, 100)
  }

  // 셀 공개 (큐 기반)
  const revealCells = (startRow: number, startCol: number, gameBoard: Cell[][]) => {
    const newBoard = gameBoard.map(row => row.map(cell => ({ ...cell })))
    const queue: [number, number][] = []
    const visited = new Set<string>()
    
    queue.push([startRow, startCol])
    let newlyRevealed = 0
    
    while (queue.length > 0) {
      const [row, col] = queue.shift()!
      const key = `${row}-${col}`
      
      if (visited.has(key)) continue
      visited.add(key)
      
      if (row < 0 || row >= settings.rows || col < 0 || col >= settings.cols) continue
      if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) continue
      
      newBoard[row][col].isRevealed = true
      newlyRevealed++
      
      if (newBoard[row][col].isMine) {
        return { board: newBoard, revealedCount: newlyRevealed, hitMine: true }
      }
      
      if (newBoard[row][col].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            queue.push([row + dr, col + dc])
          }
        }
      }
    }
    
    return { board: newBoard, revealedCount: newlyRevealed, hitMine: false }
  }

  // 보드 상태 기반 승리 조건 확인
  const checkWinFromBoard = (gameBoard: Cell[][]) => {
    let revealedNonMines = 0
    const totalCells = settings.rows * settings.cols
    const nonMineCells = totalCells - settings.mines
    
    for (let r = 0; r < settings.rows; r++) {
      for (let c = 0; c < settings.cols; c++) {
        const cell = gameBoard[r][c]
        
        // 지뢰가 아닌 셀이 공개되었는지 확인
        if (!cell.isMine && cell.isRevealed) {
          revealedNonMines++
        }
      }
    }
    
    // 승리 조건: 모든 지뢰가 아닌 셀이 공개되면 승리
    const allNonMinesRevealed = revealedNonMines === nonMineCells
    
    console.log('보드 기반 승리 체크:', {
      revealedNonMines,
      nonMineCells,
      allNonMinesRevealed
    })
    
    return allNonMinesRevealed
  }

  // 게임 종료 처리
  const endGame = (won: boolean, gameBoard: Cell[][]) => {
    console.log('🎮 게임 종료:', won ? '승리' : '패배')
    
    setGameOver(true)
    setIsWin(won)
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    if (won) {
      // 승리시에도 패배와 동일하게 보드 상태 업데이트
      setBoard(gameBoard)
    } else {
      // 패배시 모든 지뢰 공개
      const newBoard = gameBoard.map(row => row.map(cell => ({ ...cell })))
      for (let r = 0; r < settings.rows; r++) {
        for (let c = 0; c < settings.cols; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true
          }
        }
      }
      setBoard(newBoard)
    }
  }

  // 가운데 버튼/좌우 동시 클릭: 주변 셀 자동 공개
  const handleMiddleClick = (row: number, col: number) => {
    console.log('🖱️ 가운데 클릭/좌우 동시 클릭:', row, col)
    
    if (gameOver || !gameStarted) return
    
    const currentCell = board[row][col]
    
    // 공개된 숫자 셀에서만 작동
    if (!currentCell.isRevealed || currentCell.isMine || currentCell.adjacentMines === 0) return
    
    // 주변 8방향 셀 확인
    const neighbors = []
    let flagCount = 0
    
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        
        const nr = row + dr
        const nc = col + dc
        
        if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
          const neighbor = board[nr][nc]
          neighbors.push({ row: nr, col: nc, cell: neighbor })
          
          if (neighbor.isFlagged) flagCount++
        }
      }
    }
    
    // 깃발 수가 인접 지뢰 수와 같으면 나머지 셀들 공개
    if (flagCount === currentCell.adjacentMines) {
      console.log('✅ 깃발 수 일치! 주변 셀 자동 공개')
      
      let newBoard = [...board]
      let totalNewRevealed = 0
      let hitMine = false
      
      for (const neighbor of neighbors) {
        if (!neighbor.cell.isRevealed && !neighbor.cell.isFlagged) {
          const result = revealCells(neighbor.row, neighbor.col, newBoard)
          newBoard = result.board
          totalNewRevealed += result.revealedCount
          
          if (result.hitMine) {
            hitMine = true
            break
          }
        }
      }
      
      setBoard(newBoard)
      const newRevealedCount = revealedCount + totalNewRevealed
      setRevealedCount(newRevealedCount)
      
      if (hitMine) {
        endGame(false, newBoard)
      } else if (checkWinFromBoard(newBoard)) {
        endGame(true, newBoard)
      }
    }
  }

  // 셀 클릭 처리
  const handleCellClick = (row: number, col: number, isRightClick: boolean = false) => {
    console.log('🖱️ 셀 클릭:', row, col, isRightClick ? '우클릭' : '좌클릭')
    
    if (gameOver) return
    
    const currentCell = board[row][col]
    
    if (isRightClick) {
      // 우클릭: 깃발 토글
      if (currentCell.isRevealed) return
      
      const newBoard = board.map((r, rIdx) => 
        r.map((cell, cIdx) => 
          rIdx === row && cIdx === col 
            ? { ...cell, isFlagged: !cell.isFlagged }
            : cell
        )
      )
      
      setBoard(newBoard)
      setFlagsUsed(prev => currentCell.isFlagged ? prev - 1 : prev + 1)
      
      // 깃발 토글 후에도 승리 조건 확인
      if (gameStarted && checkWinFromBoard(newBoard)) {
        endGame(true, newBoard)
      }
      return
    }
    
    // 좌클릭: 셀 공개
    if (currentCell.isRevealed || currentCell.isFlagged) return
    
    let currentBoard = board
    
    // 첫 클릭이면 지뢰 배치
    if (!gameStarted) {
      console.log('🎯 첫 클릭! 지뢰 배치 시작')
      currentBoard = placeMines(row, col, board)
      setGameStarted(true)
      startTimer()
    }
    
    // 셀 공개
    const result = revealCells(row, col, currentBoard)
    setBoard(result.board)
    
    const newRevealedCount = revealedCount + result.revealedCount
    setRevealedCount(newRevealedCount)
    
    if (result.hitMine) {
      endGame(false, result.board)
    } else if (checkWinFromBoard(result.board)) {
      endGame(true, result.board)
    }
  }

  // 난이도 변경
  const changeDifficulty = (newDifficulty: string) => {
    console.log('📊 난이도 변경:', newDifficulty)
    setCurrentDifficulty(newDifficulty)
    const newSettings = difficulties[newDifficulty]
    
    // 게임 초기화 먼저
    initializeGame(newSettings)
    
    setShowGameMenu(false)
    setShowDifficultyMenu(false)
  }

  // 새 게임
  const newGame = () => {
    console.log('🎮 새 게임 시작')
    initializeGame()
  }

  // 순위 보기
  const showScores = () => {
    console.log('📊 순위 창 열기')
    setShowScoresWindow(true)
    setShowGameMenu(false)
  }

  // 종료
  const exitGame = () => {
    console.log('게임 종료 - 창 닫기')
    if (onClose) {
      onClose()
    }
    setShowGameMenu(false)
  }

  // 도움말
  const showAbout = () => {
    console.log('지뢰찾기 정보 표시')
    setShowAboutDialog(true)
    setShowHelpMenu(false)
  }

  // 점수 저장
  const saveScore = async (playerName: string) => {
    if (!playerName.trim()) {
      setSaveMessage('이름을 입력해주세요!')
      return
    }

    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const response = await fetch('/main-api/minesweeper/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: playerName.trim(),
          time: elapsedTime,
          difficulty: currentDifficulty
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSaveMessage(`점수가 저장되었습니다! ${playerName.trim()}: ${elapsedTime.toFixed(2)}초`)
        setTimeout(() => {
          newGame()
        }, 2000)
      } else {
        setSaveMessage('점수 저장에 실패했습니다: ' + result.error)
      }
    } catch (error) {
      console.error('점수 저장 오류:', error)
      setSaveMessage('점수 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  // 셀 내용 표시
  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return '🚩'
    if (!cell.isRevealed) return ''
    if (cell.isMine) return '💣'
    if (cell.adjacentMines > 0) return cell.adjacentMines.toString()
    return ''
  }

  // 셀 스타일
  const getCellStyle = (cell: Cell) => {
    let className = 'cell'
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        className += ' mine'
      } else {
        className += ' revealed'
        if (cell.adjacentMines > 0) {
          className += ` number-${cell.adjacentMines}`
        }
      }
    } else if (cell.isFlagged) {
      className += ' flagged'
    } else {
      className += ' hidden'
    }
    
    return className
  }

  // 메뉴 외부 클릭시 닫기
  const handleDocumentClick = (e: MouseEvent) => {
    const target = e.target as Element
    if (!target.closest('.menu-item') && !target.closest('.dropdown-menu') && !target.closest('.submenu')) {
      setShowGameMenu(false)
      setShowHelpMenu(false)
      setShowDifficultyMenu(false)
    }
  }

  // 메뉴 마우스오버 핸들러 (바닐라 버전과 동일)
  const handleGameMenuHover = () => {
    if (showHelpMenu) {
      setShowHelpMenu(false)
      setShowGameMenu(true)
      setShowDifficultyMenu(false)
    }
  }

  const handleHelpMenuHover = () => {
    if (showGameMenu) {
      setShowGameMenu(false)
      setShowHelpMenu(true)
      setShowDifficultyMenu(false)
    }
  }

  // 게임 메뉴 클릭 핸들러
  const handleGameMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowGameMenu(!showGameMenu)
    setShowHelpMenu(false)
    setShowDifficultyMenu(false)
  }

  // 도움말 메뉴 클릭 핸들러
  const handleHelpMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowHelpMenu(!showHelpMenu)
    setShowGameMenu(false)
    setShowDifficultyMenu(false)
  }

  // 옵션 메뉴 클릭 핸들러
  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDifficultyMenu(!showDifficultyMenu)
  }

  // 초기화
  useEffect(() => {
    initializeGame()
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  // settings 변경 시 창 크기 업데이트
  useEffect(() => {
    if (onResize) {
      const { width, height } = calculateWindowSize(settings)
      console.log('Settings 변경으로 인한 창 크기 업데이트:', { width, height, settings })
      onResize(width, height)
    }
  }, [settings])

  // 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])



  return (
    <>
      <div className="minesweeper-container">
        {/* 메뉴바 - 원본과 동일 */}
        <div className="menu-bar">
          <div 
            className="menu-item"
            onClick={handleGameMenuClick}
            onMouseEnter={handleGameMenuHover}
          >
            게임(G)
            {showGameMenu && (
              <div className="dropdown-menu">
                <div onClick={(e) => { e.stopPropagation(); newGame(); }}>새 게임(N)</div>
                <div onClick={(e) => { e.stopPropagation(); showScores(); }}>순위(R)...</div>
                <div 
                  onClick={handleOptionsClick}
                >
                  옵션(O)...
                  {showDifficultyMenu && (
                    <div className="submenu">
                      <div onClick={(e) => { e.stopPropagation(); changeDifficulty('beginner'); }}>초급</div>
                      <div onClick={(e) => { e.stopPropagation(); changeDifficulty('intermediate'); }}>중급</div>
                      <div onClick={(e) => { e.stopPropagation(); changeDifficulty('expert'); }}>고급</div>
                    </div>
                  )}
                </div>
                <div onClick={(e) => { e.stopPropagation(); exitGame(); }}>끝내기(X)</div>
              </div>
            )}
          </div>
          
          <div 
            className="menu-item"
            onClick={handleHelpMenuClick}
            onMouseEnter={handleHelpMenuHover}
          >
            도움말(H)
            {showHelpMenu && (
              <div className="dropdown-menu">
                <div onClick={(e) => { e.stopPropagation(); showAbout(); }}>정보(A)...</div>
              </div>
            )}
          </div>
        </div>

        {/* 게임 정보 */}
        <div className="game-info">
          <div className="timer">Time: {elapsedTime.toFixed(2)}</div>
          <button className="reset-btn" onClick={newGame}>
            {gameOver ? (isWin ? '😎' : '😵') : '🙂'}
          </button>
          <div className="mine-count">Mines: {settings.mines - flagsUsed}</div>
        </div>

        {/* 게임 보드 */}
        <div 
          className="game-board"
          style={{
            gridTemplateColumns: `repeat(${settings.cols}, ${settings.cellSize}px)`,
            gridTemplateRows: `repeat(${settings.rows}, ${settings.cellSize}px)`,
            gap: '1px'
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={getCellStyle(cell)}
                style={{
                  width: settings.cellSize,
                  height: settings.cellSize,
                  fontSize: Math.max(10, settings.cellSize - 10)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  
                  if (e.button === 1) { // 가운데 버튼
                    handleMiddleClick(r, c)
                    return
                  }
                  
                  // 좌우 동시 클릭 감지 (buttons 속성 사용)
                  if (e.buttons === 3) { // 좌클릭(1) + 우클릭(2) = 3
                    console.log('🖱️ 좌우 동시 클릭 감지!')
                    handleMiddleClick(r, c)
                    return
                  }
                  
                  // 일반 클릭 처리
                  if (e.button === 0) {
                    handleCellClick(r, c, false) // 좌클릭
                  } else if (e.button === 2) {
                    handleCellClick(r, c, true) // 우클릭
                  }
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {getCellContent(cell)}
              </div>
            ))
          )}
        </div>

        {/* 게임 결과 - 승리/패배시 표시 */}
        {gameOver && (
          <div className="game-result">
            {isWin ? (
              <>
                <div>🎉 승리!</div>
                <div>{elapsedTime.toFixed(2)}초에 클리어했습니다!</div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    style={{
                      padding: '4px 8px',
                      border: '2px inset #c0c0c0',
                      fontSize: '11px',
                      width: '150px',
                      textAlign: 'center'
                    }}
                    maxLength={20}
                    disabled={isSaving}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isSaving) {
                        const input = e.target as HTMLInputElement;
                        saveScore(input.value);
                      }
                    }}
                  />
                  <button 
                    onClick={(e) => {
                      const input = (e.target as HTMLButtonElement).parentElement?.querySelector('input') as HTMLInputElement;
                      if (input && !isSaving) {
                        saveScore(input.value);
                      }
                    }}
                    disabled={isSaving}
                  >
                    {isSaving ? '저장 중...' : '확인'}
                  </button>
                  {saveMessage && (
                    <div style={{ 
                      fontSize: '11px', 
                      color: saveMessage.includes('저장되었습니다') ? '#008000' : '#ff0000',
                      textAlign: 'center',
                      marginTop: '4px'
                    }}>
                      {saveMessage}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>💥 패배! 다시 시도해보세요.</div>
                <button onClick={newGame}>새 게임</button>
              </>
            )}
          </div>
        )}


      </div>

      {/* Portal을 사용해서 body에 직접 렌더링 */}
      {showScoresWindow && createPortal(
        <MinesweeperScoresWindow 
          isVisible={showScoresWindow}
          onClose={() => setShowScoresWindow(false)}
        />,
        document.body
      )}

      {/* 도움말 창 - Portal 방식 */}
      {showAboutDialog && createPortal(
        <MinesweeperAboutWindow
          isVisible={showAboutDialog}
          onClose={() => setShowAboutDialog(false)}
        />,
        document.body
      )}
    </>
  )
}

export default MinesweeperWindow 