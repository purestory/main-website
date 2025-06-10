// Assumes this script is loaded after DOM is ready (e.g. via defer)
// Depends on openWindow (from windowManager.js) to be called to initialize or show the game.

// --- Minesweeper DOM Selectors ---
let msGridElement;
let msFlagsLeftElement;
let msResetButton;
// msDifficultyElement removed as the static display div was removed from HTML.
// Menu items are selected in msInitGame or event delegation is used.
let msGameMenuItem;
let msGameDropdown;
let msHelpMenuItem;
let msHelpDropdown;


// --- Minesweeper Game Parameters and State Variables ---
const msDifficultySettings = {
    beginner: { rows: 9, cols: 9, mines: 10, cellSize: 25 },
    intermediate: { rows: 16, cols: 16, mines: 40, cellSize: 25 },
    expert: { rows: 16, cols: 30, mines: 99, cellSize: 25 }
};
let msCurrentDifficulty = 'beginner';

let msRows = msDifficultySettings[msCurrentDifficulty].rows;
let msCols = msDifficultySettings[msCurrentDifficulty].cols;
let msMines = msDifficultySettings[msCurrentDifficulty].mines;
let msCellSize = msDifficultySettings[msCurrentDifficulty].cellSize;


let msBoard = [];
let msMinesPlaced = false;
let msFlagsUsed = 0;
let msGameOver = false;
let msRevealedCells = 0;
let minesweeperEventListenersInitialized = false;
let activeMinesweeperMenu = null; // Tracks currently open dropdown
let isMenuToggling = false; // Menu toggle prevention variable

// Timer related variables
let msGameStartTime = null;
let msGameEndTime = null;
let msTimerInterval = null;
let msTimerElement = null;

// Score related variables
let msScoresButton = null;

// Mouse button tracking for chord clicks
let msMouseButtonsPressed = {
    left: false,
    right: false,
    middle: false
};
let msChordClickCell = null;

// --- Minesweeper Helper Functions ---
function getDifficultyName(difficulty) {
    switch (difficulty) {
        case 'beginner': return '초급';
        case 'intermediate': return '중급';
        case 'expert': return '고급';
        default: return '알 수 없음';
    }
}

// --- Timer Functions ---
function msStartTimer() {
    if (msTimerInterval) {
        clearInterval(msTimerInterval);
    }
    
    msGameStartTime = Date.now();
    msGameEndTime = null;
    
    msTimerInterval = setInterval(() => {
        if (msGameOver) return;
        
        const elapsed = Math.floor((Date.now() - msGameStartTime) / 1000);
        msUpdateTimerDisplay(elapsed);
    }, 1000);
}

function msStopTimer() {
    if (msTimerInterval) {
        clearInterval(msTimerInterval);
        msTimerInterval = null;
    }
    msGameEndTime = Date.now();
}

function msUpdateTimerDisplay(seconds) {
    if (msTimerElement) {
        msTimerElement.textContent = `Time: ${seconds.toString().padStart(3, '0')}`;
    }
}

function msGetElapsedTime() {
    if (!msGameStartTime) return 0;
    const endTime = msGameEndTime || Date.now();
    return Math.floor((endTime - msGameStartTime) / 1000);
}

// --- Mouse Button Tracking Functions ---
function msUpdateMouseButtons(event, isDown) {
    switch (event.button) {
        case 0: // Left button
            msMouseButtonsPressed.left = isDown;
            break;
        case 1: // Middle button
            msMouseButtonsPressed.middle = isDown;
            break;
        case 2: // Right button
            msMouseButtonsPressed.right = isDown;
            break;
    }
}

function msIsChordClick() {
    return (msMouseButtonsPressed.left && msMouseButtonsPressed.right) || msMouseButtonsPressed.middle;
}

function msPerformChordClick(r, c) {
    const cellData = msBoard[r][c];
    console.log(`Chord click on cell (${r}, ${c}), revealed: ${cellData.isRevealed}, mines: ${cellData.adjacentMines}`);
    
    if (cellData.isRevealed && cellData.adjacentMines > 0) {
        let flaggedCount = 0;
        const neighbors = [];
        
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < msRows && nc >= 0 && nc < msCols) {
                    neighbors.push({r: nr, c: nc});
                    if (msBoard[nr][nc].isFlagged) {
                        flaggedCount++;
                    }
                }
            }
        }

        console.log(`Flagged count: ${flaggedCount}, Adjacent mines: ${cellData.adjacentMines}`);
        if (flaggedCount === cellData.adjacentMines) {
            console.log('Chord click activated - revealing neighbors');
            for (const neighbor of neighbors) {
                if (!msBoard[neighbor.r][neighbor.c].isFlagged && !msBoard[neighbor.r][neighbor.c].isRevealed) {
                    msRevealCell(neighbor.r, neighbor.c);
                    if (msGameOver) break;
                }
            }
            msCheckWinCondition();
        } else {
            console.log('Chord click not activated - flag count mismatch');
        }
    } else {
        console.log('Chord click not applicable - cell not revealed or no adjacent mines');
    }
}

// --- Score Functions ---
function msShowScoreDialog(elapsedTime) {
    const playerName = prompt(`축하합니다! ${getDifficultyName(msCurrentDifficulty)} 난이도를 ${elapsedTime}초에 클리어했습니다!\n\n이름을 입력하세요:`);
    
    if (playerName && playerName.trim()) {
        msSaveScore(playerName.trim(), elapsedTime, msCurrentDifficulty);
    }
}

async function msSaveScore(playerName, time, difficulty) {
    try {
        const response = await fetch('/main-api/minesweeper/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player_name: playerName,
                time: time,
                difficulty: difficulty
            })
        });

        const result = await response.json();
        
        if (result.success) {
            alert(`점수가 저장되었습니다!\n${playerName}: ${time}초`);
        } else {
            alert('점수 저장에 실패했습니다: ' + result.error);
        }
    } catch (error) {
        console.error('점수 저장 오류:', error);
        alert('점수 저장 중 오류가 발생했습니다.');
    }
}

function msShowScoresWindow() {
    if (typeof openWindow === 'function') {
        openWindow('minesweeper-scores-window');
        msLoadScores('beginner'); // Load beginner scores by default
    }
}

async function msLoadScores(difficulty) {
    const loadingElement = document.getElementById('scores-loading');
    const scoresListElement = document.getElementById('scores-list');
    
    if (loadingElement) loadingElement.style.display = 'block';
    if (scoresListElement) scoresListElement.innerHTML = '';

    try {
        const response = await fetch(`/main-api/minesweeper/scores/${difficulty}`);
        const scores = await response.json();
        
        if (loadingElement) loadingElement.style.display = 'none';
        
        msDisplayScores(scores, difficulty);
    } catch (error) {
        console.error('점수 로딩 오류:', error);
        if (loadingElement) loadingElement.style.display = 'none';
        if (scoresListElement) {
            scoresListElement.innerHTML = '<div class="no-scores">점수를 불러올 수 없습니다.</div>';
        }
    }
}

function msDisplayScores(scores, difficulty) {
    const scoresListElement = document.getElementById('scores-list');
    
    if (!scoresListElement) return;
    
    if (!scores || scores.length === 0) {
        scoresListElement.innerHTML = '<div class="no-scores">등록된 기록이 없습니다.</div>';
        return;
    }
    
    scoresListElement.className = 'scores-list';
    scoresListElement.innerHTML = scores.map((score, index) => `
        <div class="score-item">
            <div class="score-rank">${index + 1}.</div>
            <div class="score-name">${score.name}</div>
            <div class="score-time">${score.time}초</div>
            <div class="score-date">${score.date}</div>
        </div>
    `).join('');
}

async function msResetAllScores() {
    if (!confirm('모든 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        return;
    }
    
    try {
        const response = await fetch('/main-api/minesweeper/scores', {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('모든 기록이 삭제되었습니다.');
            // Reload current tab's scores
            const activeTab = document.querySelector('.scores-tab.active');
            if (activeTab) {
                const difficulty = activeTab.dataset.difficulty;
                msLoadScores(difficulty);
            }
        } else {
            alert('기록 삭제에 실패했습니다: ' + result.error);
        }
    } catch (error) {
        console.error('기록 삭제 오류:', error);
        alert('기록 삭제 중 오류가 발생했습니다.');
    }
}

// --- Minesweeper Game Functions ---
function msCreateBoardData() {
    msBoard = [];
    for (let r = 0; r < msRows; r++) {
        msBoard[r] = [];
        for (let c = 0; c < msCols; c++) {
            msBoard[r][c] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            };
        }
    }
}

function msPlaceMines(firstClickR, firstClickC) {
    let minesToPlace = msMines;
    while (minesToPlace > 0) {
        const r = Math.floor(Math.random() * msRows);
        const c = Math.floor(Math.random() * msCols);
        if (!(r === firstClickR && c === firstClickC) && !msBoard[r][c].isMine) {
            msBoard[r][c].isMine = true;
            minesToPlace--;
        }
    }
    msMinesPlaced = true;
    msCalculateAdjacentNumbers();
}

function msCalculateAdjacentNumbers() {
    for (let r = 0; r < msRows; r++) {
        for (let c = 0; c < msCols; c++) {
            if (msBoard[r][c].isMine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < msRows && nc >= 0 && nc < msCols && msBoard[nr][nc].isMine) {
                        count++;
                    }
                }
            }
            msBoard[r][c].adjacentMines = count;
        }
    }
}

function msUpdateCellAppearance(r, c) {
    if (!msGridElement) return;
    const cellElement = msGridElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (!cellElement) return;
    const cellData = msBoard[r][c];

    cellElement.innerHTML = '';
    cellElement.className = 'ms-cell';

    if (cellData.isFlagged) {
        cellElement.innerHTML = '🚩';
        cellElement.classList.add('flagged');
    } else if (cellData.isRevealed) {
        cellElement.classList.add('revealed');
        if (cellData.isMine) {
            cellElement.innerHTML = '💣';
            cellElement.classList.add('mine');
        } else if (cellData.adjacentMines > 0) {
            cellElement.textContent = cellData.adjacentMines;
            cellElement.classList.add(`n${cellData.adjacentMines}`);
        }
    }
}

function msHandleCellMouseDown(event, r, c) {
    event.preventDefault();
    if (msGameOver) return;

    // Update button state
    msUpdateMouseButtons(event, true);
    
    // Store cell for potential chord click
    if (msIsChordClick()) {
        msChordClickCell = {r, c};
        return; // Don't perform normal click actions during chord
    }

    const cellData = msBoard[r][c];

    switch (event.button) {
        case 0: // Left-click
            if (cellData.isRevealed || cellData.isFlagged) return;
            if (!msMinesPlaced) {
                msPlaceMines(r, c);
                msStartTimer(); // Start timer on first click
            }
            msRevealCell(r, c);
            msCheckWinCondition();
            break;
        case 1: // Middle-click (Chord) - now handled by chord system
            msPerformChordClick(r, c);
            break;
        case 2: // Right-click
            if (cellData.isRevealed) return;
            cellData.isFlagged = !cellData.isFlagged;
            if (cellData.isFlagged) {
                msFlagsUsed++;
            } else {
                msFlagsUsed--;
            }
            if(msFlagsLeftElement) msFlagsLeftElement.textContent = `Mines: ${msMines - msFlagsUsed}`;
            msUpdateCellAppearance(r, c);
            break;
    }
}

function msHandleCellMouseUp(event, r, c) {
    event.preventDefault();
    if (msGameOver) return;

    // Check if this was a chord click before updating button state
    const wasChordClick = msIsChordClick();
    
    // Update button state
    msUpdateMouseButtons(event, false);
    
    // If it was a chord click and now no buttons are pressed, perform the chord action
    if (wasChordClick && !msMouseButtonsPressed.left && !msMouseButtonsPressed.right && !msMouseButtonsPressed.middle) {
        if (msChordClickCell && msChordClickCell.r === r && msChordClickCell.c === c) {
            msPerformChordClick(r, c);
        }
        msChordClickCell = null;
    }
}


function msRenderBoard() {
    if (!msGridElement) return;
    msGridElement.innerHTML = '';
    msGridElement.style.gridTemplateColumns = `repeat(${msCols}, ${msCellSize}px)`;
    msGridElement.style.gridTemplateRows = `repeat(${msRows}, ${msCellSize}px)`;

    for (let r = 0; r < msRows; r++) {
        for (let c = 0; c < msCols; c++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('ms-cell');
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;
            cellElement.style.width = `${msCellSize}px`;
            cellElement.style.height = `${msCellSize}px`;

            cellElement.addEventListener('mousedown', (event) => msHandleCellMouseDown(event, r, c));
            cellElement.addEventListener('mouseup', (event) => msHandleCellMouseUp(event, r, c));
            cellElement.addEventListener('mouseleave', (event) => {
                // Reset button states if mouse leaves the cell
                msMouseButtonsPressed.left = false;
                msMouseButtonsPressed.right = false;
                msMouseButtonsPressed.middle = false;
                msChordClickCell = null;
            });
            cellElement.addEventListener('auxclick', (event) => {
                // auxclick fires for middle button clicks
                if (event.button === 1) {
                    event.preventDefault();
                }
            });
            cellElement.addEventListener('contextmenu', (event) => event.preventDefault());

            msGridElement.appendChild(cellElement);
            msUpdateCellAppearance(r,c);
        }
    }
}


function msRevealCell(r, c) {
    if (r < 0 || r >= msRows || c < 0 || c >= msCols || msBoard[r][c].isRevealed || msBoard[r][c].isFlagged) {
        return;
    }

    msBoard[r][c].isRevealed = true;
    msRevealedCells++;
    msUpdateCellAppearance(r, c);

    if (msBoard[r][c].isMine) {
        msHandleGameOver(false);
    } else if (msBoard[r][c].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                msRevealCell(r + dr, c + dc);
            }
        }
    }
}

function msHandleGameOver(isWin) {
    msGameOver = true;
    msStopTimer(); // Stop the timer
    
    if (msResetButton) msResetButton.textContent = isWin ? '🥳' : '😵';

    if (isWin) {
        for (let r = 0; r < msRows; r++) {
            for (let c = 0; c < msCols; c++) {
                if (msBoard[r][c].isMine && !msBoard[r][c].isFlagged) {
                    msBoard[r][c].isFlagged = true;
                    msUpdateCellAppearance(r,c);
                }
            }
        }
        if(msFlagsLeftElement) msFlagsLeftElement.textContent = `Mines: 0`;
        
        // Handle win - show score input dialog
        const elapsedTime = msGetElapsedTime();
        setTimeout(() => {
            msShowScoreDialog(elapsedTime);
        }, 500);
    } else {
        for (let r = 0; r < msRows; r++) {
            for (let c = 0; c < msCols; c++) {
                if (msBoard[r][c].isMine) {
                    msBoard[r][c].isRevealed = true;
                    msUpdateCellAppearance(r, c);
                }
            }
        }
        setTimeout(() => alert('Game Over!'), 100);
    }
}

function msCheckWinCondition() {
    if (msGameOver) return;
    if ((msRows * msCols - msMines) === msRevealedCells) {
        msHandleGameOver(true);
    }
}

function msAdjustWindowSize() {
    const minesweeperWindow = document.getElementById('minesweeper-app-window');
    if (!minesweeperWindow || !msGridElement) return;

    const menubar = minesweeperWindow.querySelector('.ms-menubar');
    const controls = minesweeperWindow.querySelector('.minesweeper-controls');
    const header = minesweeperWindow.querySelector('.window-header');

    if (!menubar || !controls || !header) return;

    const menubarHeight = menubar.offsetHeight;
    const controlsHeight = controls.offsetHeight;
    const gridHeight = msGridElement.offsetHeight;
    const headerHeight = header.offsetHeight;

    const windowBodyPadding = 20; // Approx 10px top + 10px bottom from .minesweeper-body
    const totalInternalHeight = menubarHeight + controlsHeight + gridHeight + windowBodyPadding + 10; // Extra 10 for margin-bottom on controls

    const newWindowHeight = headerHeight + totalInternalHeight;

    const gridWidth = msCols * msCellSize + 6; // 6 for 3px border on each side
    const windowBodySidePadding = 20;
    const windowBorderWidth = 2;
    const newWindowWidth = Math.max(230, gridWidth + windowBodySidePadding + windowBorderWidth); // Ensure a min reasonable width for controls

    minesweeperWindow.style.height = newWindowHeight + 'px';
    minesweeperWindow.style.width = newWindowWidth + 'px';
}

// --- Minesweeper Menu Logic ---
function closeAllMinesweeperDropdowns() {
    document.querySelectorAll('#minesweeper-app-window .ms-dropdown-menu, #minesweeper-app-window .ms-difficulty-submenu').forEach(menu => {
        menu.style.display = 'none';
    });
    document.querySelectorAll('#minesweeper-app-window .ms-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    activeMinesweeperMenu = null;
}

// 연속 호출 방지를 위한 변수
// let isMenuToggling = false; // Already defined globally or should be if not

function toggleMinesweeperDropdown(menuItemLI, dropdownUL) {
    if (isMenuToggling) return;
    isMenuToggling = true;

    // Check if menuItemLI and dropdownUL are valid DOM elements
    if (!(menuItemLI instanceof HTMLElement) || !(dropdownUL instanceof HTMLElement)) {
        console.error('Invalid menuItemLI or dropdownUL passed to toggleMinesweeperDropdown');
        isMenuToggling = false;
        return;
    }

    const isAlreadyOpen = dropdownUL.style.display === 'block' && activeMinesweeperMenu === dropdownUL;

    if (isAlreadyOpen) {
        closeAllMinesweeperDropdowns();
    } else {
        closeAllMinesweeperDropdowns(); // Close everything first
        dropdownUL.style.display = 'block';
        menuItemLI.classList.add('active');
        activeMinesweeperMenu = dropdownUL;
    }

    setTimeout(() => { isMenuToggling = false; }, 100);
}

/**
 * 지뢰찾기 게임 상태를 초기화하고 보드를 다시 그립니다.
 */
function msInitGame() {
    // DOM 요소 선택
    // DOM 요소 선택 (글로벌 변수에 할당)
    msGridElement = document.getElementById('minesweeperGrid');
    msFlagsLeftElement = document.getElementById('minesweeperFlagsLeft');
    msResetButton = document.getElementById('minesweeperReset');
    msTimerElement = document.getElementById('minesweeperTimer');
    msScoresButton = document.getElementById('minesweeperScores');
    const minesweeperWindowElement = document.getElementById('minesweeper-app-window');

    msGameMenuItem = document.getElementById('ms-game-menu-item'); // Global
    msGameDropdown = document.getElementById('ms-game-dropdown');   // Global
    msHelpMenuItem = document.getElementById('ms-help-menu-item'); // Global
    msHelpDropdown = document.getElementById('ms-help-dropdown');   // Global

    // Submenu items - can be local to msInitGame if only used for setup here
    const optionSubmenuItemLI = msGameDropdown ? msGameDropdown.querySelector('.ms-submenu-item') : null;
    const difficultySubmenuUL = optionSubmenuItemLI ? optionSubmenuItemLI.querySelector('.ms-difficulty-submenu') : null;


    if (!msGridElement || !msFlagsLeftElement || !msResetButton || !msTimerElement || !msScoresButton || !minesweeperWindowElement || !msGameMenuItem || !msGameDropdown || !msHelpMenuItem || !msHelpDropdown) {
        console.error("지뢰찾기 게임의 필수 UI 요소를 모두 찾을 수 없어 게임을 초기화할 수 없습니다.");
        return;
    }
    
    // 게임 상태 초기화
    const settings = msDifficultySettings[msCurrentDifficulty];
    msRows = settings.rows;
    msCols = settings.cols;
    msMines = settings.mines;
    msCellSize = settings.cellSize;

    msGameOver = false;
    msMinesPlaced = false;
    msFlagsUsed = 0;
    msRevealedCells = 0;
    
    // Timer 초기화
    msStopTimer();
    msGameStartTime = null;
    msGameEndTime = null;
    
    // UI 업데이트
    msResetButton.textContent = '🙂';
    msFlagsLeftElement.textContent = `Mines: ${msMines - msFlagsUsed}`;
    msUpdateTimerDisplay(0);
    const windowTitle = minesweeperWindowElement.querySelector('.window-title');
    if (windowTitle) {
        windowTitle.textContent = `Minesweeper - ${getDifficultyName(msCurrentDifficulty)}`;
    }

    // 게임 보드 생성 및 렌더링
    msCreateBoardData();
    msRenderBoard();
    
    // Event Listeners (only initialize once)
    if (!minesweeperEventListenersInitialized) {
        if (msGameMenuItem && msGameDropdown) {
            msGameMenuItem.addEventListener('click', function(event) {
                event.stopPropagation();
                toggleMinesweeperDropdown(this, msGameDropdown);
            });
        }

        if (msHelpMenuItem && msHelpDropdown) {
            msHelpMenuItem.addEventListener('click', function(event) {
                event.stopPropagation();
                toggleMinesweeperDropdown(this, msHelpDropdown);
            });
        }

        if (optionSubmenuItemLI && difficultySubmenuUL) {
            optionSubmenuItemLI.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent menu from closing immediately
                const isVisible = difficultySubmenuUL.style.display === 'block';
                // Hide other submenus if any (though not strictly necessary with current structure)
                document.querySelectorAll('#minesweeper-app-window .ms-difficulty-submenu').forEach(sm => {
                    if (sm !== difficultySubmenuUL) sm.style.display = 'none';
                });
                difficultySubmenuUL.style.display = isVisible ? 'none' : 'block';
            });
        }

        if (minesweeperWindowElement) {
            minesweeperWindowElement.addEventListener('click', function(event) {
                // Close menus if click is outside of any menu item or dropdown content
                if (!event.target.closest('.ms-menu-item') && !event.target.closest('.ms-dropdown-menu') && !event.target.closest('.ms-difficulty-submenu')) {
                    closeAllMinesweeperDropdowns();
                }
            });
        }

        // Add listeners for menu actions (New Game, Difficulty, Exit, About)
        const newGameAction = msGameDropdown ? msGameDropdown.querySelector('[data-action="ms-new-game"]') : null;
        if (newGameAction) {
            newGameAction.addEventListener('click', (event) => {
                event.stopPropagation();
                msInitGame(); // Re-initialize for a new game
                closeAllMinesweeperDropdowns();
            });
        }

        const difficultyActions = difficultySubmenuUL ? difficultySubmenuUL.querySelectorAll('[data-action="ms-difficulty"]') : [];
        difficultyActions.forEach(action => {
            action.addEventListener('click', (event) => {
                event.stopPropagation();
                const newDifficulty = action.dataset.difficulty;
                if (newDifficulty && msDifficultySettings[newDifficulty]) {
                    msCurrentDifficulty = newDifficulty;
                    msInitGame(); // Re-initialize with new difficulty
                }
                closeAllMinesweeperDropdowns();
            });
        });

        const exitAction = msGameDropdown ? msGameDropdown.querySelector('[data-action="ms-exit"]') : null;
        if (exitAction) {
            exitAction.addEventListener('click', (event) => {
                event.stopPropagation();
                const windowToClose = document.getElementById('minesweeper-app-window');
                if (windowToClose && typeof closeWindow === 'function') {
                    closeWindow(windowToClose.id); // Assuming closeWindow exists
                } else if (windowToClose) {
                    windowToClose.style.display = 'none'; // Fallback
                }
                closeAllMinesweeperDropdowns();
            });
        }

        const aboutAction = msHelpDropdown ? msHelpDropdown.querySelector('[data-action="ms-about"]') : null;
        if (aboutAction) {
            aboutAction.addEventListener('click', (event) => {
                event.stopPropagation();
                alert('Minesweeper - A Classic Game\nImplemented by AI');
                closeAllMinesweeperDropdowns();
            });
        }


        // Add scores button event listener
        if (msScoresButton) {
            msScoresButton.addEventListener('click', () => {
                msShowScoresWindow();
            });
        }

        // Add reset button event listener
        if (msResetButton) {
            msResetButton.addEventListener('click', () => {
                msInitGame();
            });
        }

        minesweeperEventListenersInitialized = true;
        console.log('Minesweeper event listeners initialized.');
    }
    
    // Initialize scores window event listeners if not already done
    msInitScoresWindow();

    msAdjustWindowSize(); // Adjust size after board is rendered and listeners potentially set up
    closeAllMinesweeperDropdowns(); // Ensure menus are closed on init
    console.log(`✨ 지뢰찾기 게임 시작: ${getDifficultyName(msCurrentDifficulty)}`);
}

// --- Scores Window Initialization ---
let scoresWindowListenersInitialized = false;

function msInitScoresWindow() {
    if (scoresWindowListenersInitialized) return;
    
    // Initialize tab event listeners
    const scoreTabs = document.querySelectorAll('.scores-tab');
    scoreTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            scoreTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            // Load scores for selected difficulty
            const difficulty = tab.dataset.difficulty;
            msLoadScores(difficulty);
        });
    });
    
    // Initialize button event listeners
    const resetScoresBtn = document.getElementById('resetScoresBtn');
    if (resetScoresBtn) {
        resetScoresBtn.addEventListener('click', msResetAllScores);
    }
    
    const refreshScoresBtn = document.getElementById('refreshScoresBtn');
    if (refreshScoresBtn) {
        refreshScoresBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.scores-tab.active');
            if (activeTab) {
                const difficulty = activeTab.dataset.difficulty;
                msLoadScores(difficulty);
            }
        });
    }
    
    scoresWindowListenersInitialized = true;
}

// --- Global event listeners for chord click support ---
document.addEventListener('DOMContentLoaded', function() {
    // Prevent default middle click behavior on the minesweeper grid
    document.addEventListener('mousedown', function(event) {
        if (event.target.closest('#minesweeperGrid')) {
            if (event.button === 1) {
                event.preventDefault(); // Prevent middle click default
            }
        }
    });
    
    document.addEventListener('mouseup', function(event) {
        if (!event.target.closest('#minesweeperGrid')) {
            // Reset button states if mouse up outside the grid
            msMouseButtonsPressed.left = false;
            msMouseButtonsPressed.right = false;
            msMouseButtonsPressed.middle = false;
            msChordClickCell = null;
        }
    });
    
    document.addEventListener('auxclick', function(event) {
        if (event.button === 1 && event.target.closest('#minesweeperGrid')) {
            event.preventDefault();
        }
    });
    
    // Reset states on context menu (right click menu)
    document.addEventListener('contextmenu', function(event) {
        if (event.target.closest('#minesweeperGrid')) {
            // Don't reset states here as it interferes with right-click flagging
        }
    });
});
