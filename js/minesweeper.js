// Assumes this script is loaded after DOM is ready (e.g. via defer)
// Depends on openWindow (from windowManager.js) to be called to initialize or show the game.

// --- Minesweeper DOM Selectors ---
let msGridElement;
let msFlagsLeftElement;
let msResetButton;
let msDifficultyElement; // Added for difficulty display

// --- Minesweeper Game Parameters and State Variables ---
const msRows = 9;
const msCols = 9;
const msMines = 10;

let msBoard = [];
let msMinesPlaced = false;
let msFlagsUsed = 0;
let msGameOver = false;
let msRevealedCells = 0;
let msGameInitialized = false;

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
                            if (msGameOver) break; // Stop if game over during chord reveal
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
    msGridElement.style.gridTemplateColumns = `repeat(${msCols}, 25px)`;
    msGridElement.style.gridTemplateRows = `repeat(${msRows}, 25px)`;

    for (let r = 0; r < msRows; r++) {
        for (let c = 0; c < msCols; c++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('ms-cell');
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;

            // Use mousedown for all interactions
            cellElement.addEventListener('mousedown', (event) => msHandleCellMouseDown(event, r, c));
            // Prevent context menu on the grid itself, as right-click is for flagging
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

function msInitGame() {
    msGridElement = document.getElementById('minesweeperGrid');
    msFlagsLeftElement = document.getElementById('minesweeperFlagsLeft');
    msResetButton = document.getElementById('minesweeperReset');
    msDifficultyElement = document.getElementById('minesweeperDifficulty'); // Get difficulty display

    if (!msGridElement || !msFlagsLeftElement || !msResetButton || !msDifficultyElement) {
        console.error("Minesweeper DOM elements not found. Cannot initialize game.");
        return;
    }

    msGameOver = false;
    msMinesPlaced = false;
    msFlagsUsed = 0;
    msRevealedCells = 0;
    msResetButton.textContent = '🙂';
    msFlagsLeftElement.textContent = `Mines: ${msMines - msFlagsUsed}`;
    msDifficultyElement.textContent = 'Beginner'; // Set difficulty text

    msCreateBoardData();
    msRenderBoard();

    msResetButton.removeEventListener('click', msInitGame);
    msResetButton.addEventListener('click', msInitGame);

    msGameInitialized = true;
}
