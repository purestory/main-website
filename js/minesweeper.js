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

// --- Minesweeper Helper Functions ---
function getDifficultyName(difficulty) {
    switch (difficulty) {
        case 'beginner': return '초급';
        case 'intermediate': return '중급';
        case 'expert': return '고급';
        default: return '알 수 없음';
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

    const cellData = msBoard[r][c];

    switch (event.button) {
        case 0: // Left-click
            if (cellData.isRevealed || cellData.isFlagged) return;
            if (!msMinesPlaced) {
                msPlaceMines(r, c);
            }
            msRevealCell(r, c);
            msCheckWinCondition();
            break;
        case 1: // Middle-click (Chord)
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

                if (flaggedCount === cellData.adjacentMines) {
                    for (const neighbor of neighbors) {
                        if (!msBoard[neighbor.r][neighbor.c].isFlagged && !msBoard[neighbor.r][neighbor.c].isRevealed) {
                            msRevealCell(neighbor.r, neighbor.c);
                            if (msGameOver) break;
                        }
                    }
                    msCheckWinCondition();
                }
            }
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
    if (msResetButton) msResetButton.textContent = isWin ? '🥳' : '😵';

    if (isWin) {
        alert('You Win!');
        for (let r = 0; r < msRows; r++) {
            for (let c = 0; c < msCols; c++) {
                if (msBoard[r][c].isMine && !msBoard[r][c].isFlagged) {
                    msBoard[r][c].isFlagged = true;
                    msUpdateCellAppearance(r,c);
                }
            }
        }
        if(msFlagsLeftElement) msFlagsLeftElement.textContent = `Mines: 0`;
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
    const minesweeperWindowElement = document.getElementById('minesweeper-app-window');

    msGameMenuItem = document.getElementById('ms-game-menu-item'); // Global
    msGameDropdown = document.getElementById('ms-game-dropdown');   // Global
    msHelpMenuItem = document.getElementById('ms-help-menu-item'); // Global
    msHelpDropdown = document.getElementById('ms-help-dropdown');   // Global

    // Submenu items - can be local to msInitGame if only used for setup here
    const optionSubmenuItemLI = msGameDropdown ? msGameDropdown.querySelector('.ms-submenu-item') : null;
    const difficultySubmenuUL = optionSubmenuItemLI ? optionSubmenuItemLI.querySelector('.ms-difficulty-submenu') : null;


    if (!msGridElement || !msFlagsLeftElement || !msResetButton || !minesweeperWindowElement || !msGameMenuItem || !msGameDropdown || !msHelpMenuItem || !msHelpDropdown) {
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
    
    // UI 업데이트
    msResetButton.textContent = '🙂';
    msFlagsLeftElement.textContent = `Mines: ${msMines - msFlagsUsed}`;
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


        minesweeperEventListenersInitialized = true;
        console.log('Minesweeper event listeners initialized.');
    }

    msAdjustWindowSize(); // Adjust size after board is rendered and listeners potentially set up
    closeAllMinesweeperDropdowns(); // Ensure menus are closed on init
    console.log(`✨ 지뢰찾기 게임 시작: ${getDifficultyName(msCurrentDifficulty)}`);
}
