// Assumes this script is loaded after DOM is ready (e.g. via defer)
// Depends on openWindow (from windowManager.js) to be called to initialize or show the game.

// --- Minesweeper DOM Selectors ---
let msGridElement;
let msFlagsLeftElement;
let msResetButton;
// msDifficultyElement was for a static display, now we have buttons.
const msMenubar = document.querySelector('#minesweeper-app-window .ms-menubar'); // Menubar
let msGameMenuItem; // Initialized in msInitGame
let msGameDropdown; // Initialized in msInitGame
let msHelpMenuItem; // Initialized in msInitGame
let msHelpDropdown; // Initialized in msInitGame


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
let msGameInitialized = false;
let activeMinesweeperMenu = null; // Tracks currently open dropdown

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
    const newWindowWidth = Math.max(200, gridWidth + windowBodySidePadding + windowBorderWidth); // Ensure a min reasonable width

    minesweeperWindow.style.height = newWindowHeight + 'px';
    minesweeperWindow.style.width = newWindowWidth + 'px';
}

// --- Minesweeper Menu Logic ---
function closeAllMinesweeperDropdowns() {
    document.querySelectorAll('#minesweeper-app-window .ms-dropdown-menu').forEach(dd => {
        dd.style.display = 'none';
    });
    document.querySelectorAll('#minesweeper-app-window .ms-menu-item').forEach(item => {
         item.classList.remove('active');
    });
    activeMinesweeperMenu = null;
}

function toggleMinesweeperDropdown(menuItem, dropdownMenu) {
    const isOpen = dropdownMenu.style.display === 'block';
    const wasActiveMenu = activeMinesweeperMenu;
    closeAllMinesweeperDropdowns();
    if (!isOpen || (isOpen && dropdownMenu !== wasActiveMenu)) { // Open if closed, or if different menu was clicked
        dropdownMenu.style.display = 'block';
        menuItem.classList.add('active');
        activeMinesweeperMenu = dropdownMenu;
    } else {
        // If the same menu was clicked and it was open, it's now closed by closeAll...
        // menuItem.classList.remove('active'); // Already handled by closeAll...
    }
}

function msInitGame() {
    msGridElement = document.getElementById('minesweeperGrid');
    msFlagsLeftElement = document.getElementById('minesweeperFlagsLeft');
    msResetButton = document.getElementById('minesweeperReset');
    msGameMenuItem = document.getElementById('ms-game-menu-item');
    msGameDropdown = document.getElementById('ms-game-dropdown');
    msHelpMenuItem = document.getElementById('ms-help-menu-item');
    msHelpDropdown = document.getElementById('ms-help-dropdown');

    const difficultyButtons = document.querySelectorAll('#minesweeper-app-window .ms-difficulty-btn');
    const minesweeperWindowElement = document.getElementById('minesweeper-app-window');

    if (!msGridElement || !msFlagsLeftElement || !msResetButton || difficultyButtons.length === 0 || !minesweeperWindowElement || !msGameMenuItem || !msGameDropdown || !msHelpMenuItem || !msHelpDropdown) {
        console.error("Minesweeper DOM elements not found. Cannot initialize game.");
        return;
    }

    const settings = msDifficultySettings[msCurrentDifficulty];
    msRows = settings.rows;
    msCols = settings.cols;
    msMines = settings.mines;
    msCellSize = settings.cellSize;

    msGameOver = false;
    msMinesPlaced = false;
    msFlagsUsed = 0;
    msRevealedCells = 0;
    msResetButton.textContent = '🙂';
    msFlagsLeftElement.textContent = `Mines: ${msMines - msFlagsUsed}`;

    difficultyButtons.forEach(btn => {
        if (btn.dataset.difficulty === msCurrentDifficulty) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    msCreateBoardData();
    msRenderBoard();
    msAdjustWindowSize();

    if (!msGameInitialized) {
        difficultyButtons.forEach(button => {
            button.addEventListener('click', function() {
                msCurrentDifficulty = this.dataset.difficulty;
                msInitGame();
            });
        });
        msResetButton.addEventListener('click', msInitGame);

        // Menu item listeners
        msGameMenuItem.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMinesweeperDropdown(msGameMenuItem, msGameDropdown);
        });
        msHelpMenuItem.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMinesweeperDropdown(msHelpMenuItem, msHelpDropdown);
        });

        // Event delegation for dropdown actions
        const menubar = minesweeperWindowElement.querySelector('.ms-menubar');
        if (menubar) {
            menubar.addEventListener('click', (event) => {
                const target = event.target;
                if (target.tagName === 'LI' && target.closest('.ms-dropdown-menu')) {
                    const action = target.dataset.action;
                    if (action) {
                        switch (action) {
                            case 'ms-new-game':
                                msInitGame();
                                break;
                            case 'ms-options':
                                console.log('Minesweeper options clicked (not implemented)');
                                alert('Minesweeper Options: Not implemented yet.');
                                break;
                            case 'ms-exit':
                                const minesweeperWindow = document.getElementById('minesweeper-app-window');
                                if (minesweeperWindow) {
                                    minesweeperWindow.classList.remove('active');
                                    setTimeout(() => {
                                        minesweeperWindow.style.display = 'none';
                                    }, 200);
                                }
                                break;
                            case 'ms-about':
                                alert('Minesweeper v1.0\nCreated by AI Assistant for Web OS Simulation');
                                break;
                        }
                        closeAllMinesweeperDropdowns();
                    }
                }
            });
        }

        // Global click to close dropdowns
        document.addEventListener('click', function(event) {
            if (activeMinesweeperMenu) {
                const menubarElement = minesweeperWindowElement.querySelector('.ms-menubar');
                if (menubarElement && !menubarElement.contains(event.target)) {
                    closeAllMinesweeperDropdowns();
                }
            }
        });
        msGameInitialized = true;
    }
    closeAllMinesweeperDropdowns(); // Ensure menus are closed on init/reset
}
