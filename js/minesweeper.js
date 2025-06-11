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
        
        const elapsedMs = Date.now() - msGameStartTime;
        msUpdateTimerDisplay(elapsedMs);
    }, 100); // 100ms마다 업데이트 (성능 최적화)
}

function msStopTimer() {
    if (msTimerInterval) {
        clearInterval(msTimerInterval);
        msTimerInterval = null;
    }
    msGameEndTime = Date.now();
}

function msUpdateTimerDisplay(milliseconds) {
    if (msTimerElement) {
        const totalMs = Math.floor(milliseconds);
        const seconds = Math.floor(totalMs / 1000);
        const centiseconds = Math.floor((totalMs % 1000) / 10); // 1/100초
        
        msTimerElement.textContent = `Time: ${seconds}.${centiseconds.toString().padStart(2, '0')}`;
    }
}

function msGetElapsedTime() {
    if (!msGameStartTime) return 0;
    const endTime = msGameEndTime || Date.now();
    return (endTime - msGameStartTime) / 1000; // 소수점 포함하여 반환
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
    const leftAndRight = msMouseButtonsPressed.left && msMouseButtonsPressed.right;
    const middle = msMouseButtonsPressed.middle;
    console.log('Chord check - left:', msMouseButtonsPressed.left, 'right:', msMouseButtonsPressed.right, 'middle:', msMouseButtonsPressed.middle, 'result:', leftAndRight || middle);
    return leftAndRight || middle;
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

// --- Dialog Functions ---
function msShowDialog(dialogId) {
    console.log(`🔍 msShowDialog 호출됨: ${dialogId}`);
    const dialog = document.getElementById(dialogId);
    if (dialog) {
        console.log(`✅ ${dialogId} 요소 찾음, 표시 중...`);
        
        // 강제로 표시하기 위해 !important 스타일 사용
        dialog.style.setProperty('display', 'block', 'important');
        dialog.style.setProperty('visibility', 'visible', 'important');
        dialog.style.setProperty('opacity', '1', 'important');
        
        // 대화상자를 강제로 맨 앞에 표시
        dialog.style.setProperty('z-index', '10000', 'important');
        dialog.style.setProperty('position', 'fixed', 'important');
        dialog.style.setProperty('top', '50%', 'important');
        dialog.style.setProperty('left', '50%', 'important');
        dialog.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
        
        console.log(`📍 대화상자 위치 설정: z-index=${dialog.style.zIndex}, position=${dialog.style.position}`);
        
        // 윈도우 매니저 함수를 사용하여 활성화
        if (typeof setActiveWindow === 'function') {
            setActiveWindow(dialog);
            console.log('✅ setActiveWindow 호출 완료');
        } else {
            console.log('⚠️ setActiveWindow 함수 없음 - 수동으로 z-index 설정');
            // 다른 모든 창들보다 위에 표시
            const allWindows = document.querySelectorAll('.window');
            allWindows.forEach(window => {
                if (window !== dialog && window.style.zIndex) {
                    const currentZ = parseInt(window.style.zIndex) || 1000;
                    if (currentZ >= 10000) {
                        window.style.zIndex = '9999';
                    }
                }
            });
        }
        
        // 커서 문제 해결을 위해 포커스 관리
        setTimeout(() => {
            // 현재 선택된 텍스트나 입력 필드의 포커스 해제
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
            
            // 텍스트 선택 해제
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
            
            // 대화상자 내부의 첫 번째 입력 필드나 버튼에 포커스
            const firstInput = dialog.querySelector('input, button');
            if (firstInput) {
                firstInput.focus();
            }
            
            console.log('📋 대화상자 표시 완료 및 포커스 설정됨');
        }, 100);
    } else {
        console.error(`❌ ${dialogId} 요소를 찾을 수 없음!`);
    }
}

function msHideDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (dialog) {
        dialog.style.setProperty('display', 'none', 'important');
        
        // 대화상자가 닫힐 때도 포커스 정리
        setTimeout(() => {
            // 현재 포커스 해제
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
            
            // 텍스트 선택 해제
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
            
            // 지뢰찾기 창에 포커스 복원
            const minesweeperWindow = document.getElementById('minesweeper-app-window');
            if (minesweeperWindow) {
                minesweeperWindow.focus();
            }
        }, 10);
    }
}

function msShowResultDialog(icon, message) {
    const iconElement = document.getElementById('ms-result-icon');
    const messageElement = document.getElementById('ms-result-message');
    
    if (iconElement) iconElement.textContent = icon;
    if (messageElement) messageElement.textContent = message;
    
    msShowDialog('ms-result-dialog');
}

function msSetupWinDialogEvents(elapsedTime) {
    // 기존 이벤트 리스너 제거
    const saveBtn = document.getElementById('ms-win-save-btn');
    const cancelBtn = document.getElementById('ms-win-cancel-btn');
    const closeBtn = document.querySelector('#ms-win-dialog .window-close-button');
    const nameInput = document.getElementById('ms-player-name');
    
    if (saveBtn) {
        // 기존 이벤트 리스너 제거 후 새로 추가
        saveBtn.replaceWith(saveBtn.cloneNode(true));
        const newSaveBtn = document.getElementById('ms-win-save-btn');
        newSaveBtn.addEventListener('click', () => {
            // 복제된 input 요소에서 값을 가져와야 함
            const currentNameInput = document.getElementById('ms-player-name');
            const playerName = currentNameInput ? currentNameInput.value.trim() : '';
            console.log(`🔍 입력된 이름: "${playerName}" (길이: ${playerName.length})`);
            
            if (playerName && playerName.length > 0) {
                msSaveScore(playerName, elapsedTime, msCurrentDifficulty);
                msHideDialog('ms-win-dialog');
            } else {
                msShowResultDialog('⚠️', '이름을 입력해주세요!');
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        const newCancelBtn = document.getElementById('ms-win-cancel-btn');
        newCancelBtn.addEventListener('click', () => {
            msHideDialog('ms-win-dialog');
        });
    }
    
    if (closeBtn) {
        closeBtn.replaceWith(closeBtn.cloneNode(true));
        const newCloseBtn = document.querySelector('#ms-win-dialog .window-close-button');
        newCloseBtn.addEventListener('click', () => {
            msHideDialog('ms-win-dialog');
        });
    }
    
    // Enter 키로 저장하기
    if (nameInput) {
        nameInput.replaceWith(nameInput.cloneNode(true));
        const newNameInput = document.getElementById('ms-player-name');
        newNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const playerName = newNameInput.value.trim();
                console.log(`🔍 Enter로 입력된 이름: "${playerName}" (길이: ${playerName.length})`);
                
                if (playerName && playerName.length > 0) {
                    msSaveScore(playerName, elapsedTime, msCurrentDifficulty);
                    msHideDialog('ms-win-dialog');
                } else {
                    msShowResultDialog('⚠️', '이름을 입력해주세요!');
                }
            }
        });
    }
}

// --- Score Functions ---
function msShowScoreDialog(elapsedTime) {
    console.log(`🎉 msShowScoreDialog 호출됨! 시간: ${elapsedTime}초`);
    
    // 메시지 업데이트
    const messageElement = document.getElementById('ms-win-message');
    if (messageElement) {
        const formattedTime = elapsedTime.toFixed(2); // 소수점 둘째자리까지 (1/100초)
        messageElement.textContent = `축하합니다! ${getDifficultyName(msCurrentDifficulty)} 난이도를 ${formattedTime}초에 클리어했습니다!`;
        console.log('✅ 승리 메시지 업데이트 완료');
    } else {
        console.error('❌ ms-win-message 요소를 찾을 수 없음!');
    }
    
    // 입력 필드 초기화
    const nameInput = document.getElementById('ms-player-name');
    if (nameInput) {
        nameInput.value = '';
        console.log('✅ 이름 입력 필드 초기화 완료');
    } else {
        console.error('❌ ms-player-name 요소를 찾을 수 없음!');
    }
    
    // 대화상자 표시
    console.log('📋 대화상자 표시 시도...');
    msShowDialog('ms-win-dialog');
    
    // 포커스를 지연시켜서 대화상자가 완전히 표시된 후 적용
    setTimeout(() => {
        const nameInputDelayed = document.getElementById('ms-player-name');
        if (nameInputDelayed) {
            nameInputDelayed.focus();
            nameInputDelayed.select(); // 기존 텍스트가 있다면 전체 선택
            console.log('✅ 이름 입력 필드 포커스 완료');
        }
    }, 100);
    
    // 이벤트 리스너 설정 (한 번만)
    msSetupWinDialogEvents(elapsedTime);
}

async function msSaveScore(playerName, time, difficulty) {
    try {
        const response = await fetch('http://localhost:8001/main-api/minesweeper/scores', {
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
            const formattedTime = time.toFixed(2); // 소수점 둘째자리까지 (1/100초)
            msShowResultDialog('✅', `점수가 저장되었습니다!\n${playerName}: ${formattedTime}초`);
        } else {
            msShowResultDialog('❌', '점수 저장에 실패했습니다: ' + result.error);
        }
    } catch (error) {
        console.error('점수 저장 오류:', error);
        msShowResultDialog('❌', '점수 저장 중 오류가 발생했습니다.');
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
        const response = await fetch(`http://localhost:8001/main-api/minesweeper/scores/${difficulty}`);
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
    scoresListElement.innerHTML = scores.map((score, index) => {
        const formattedTime = parseFloat(score.time).toFixed(2); // 소수점 둘째자리까지 (1/100초)
        return `
        <div class="score-item">
            <div class="score-rank">${index + 1}.</div>
            <div class="score-name">${score.name}</div>
            <div class="score-time">${formattedTime}초</div>
            <div class="score-date">${score.date}</div>
        </div>
        `;
    }).join('');
}

async function msResetAllScores() {
    // 비밀번호 확인이 완료된 후 호출되므로 바로 실행
    
    try {
        const response = await fetch('http://localhost:8001/main-api/minesweeper/scores', {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            msShowResultDialog('✅', '모든 기록이 삭제되었습니다.');
            // Reload current tab's scores
            const activeTab = document.querySelector('.scores-tab.active');
            if (activeTab) {
                const difficulty = activeTab.dataset.difficulty;
                msLoadScores(difficulty);
            }
        } else {
            msShowResultDialog('❌', '기록 삭제에 실패했습니다: ' + result.error);
        }
    } catch (error) {
        console.error('기록 삭제 오류:', error);
        msShowResultDialog('❌', '기록 삭제 중 오류가 발생했습니다.');
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
    
    const cellData = msBoard[r][c];

    // Check for chord click (left+right or middle)
    if (msIsChordClick()) {
        console.log('Chord click detected in mousedown');
        msChordClickCell = {r, c};
        return; // Don't perform normal click actions during chord
    }

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
        case 1: // Middle-click
            console.log('Middle click detected');
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
    console.log('Mouse up - was chord click:', wasChordClick, 'buttons:', msMouseButtonsPressed);
    
    // Update button state
    msUpdateMouseButtons(event, false);
    
    // If it was a chord click and this mouse up completes the chord action
    if (wasChordClick && msChordClickCell && msChordClickCell.r === r && msChordClickCell.c === c) {
        console.log('Performing chord click on mouse up');
        msPerformChordClick(r, c);
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

    // Add global mouse event listeners for better chord click detection
    if (!window.msGlobalMouseListenersAdded) {
        document.addEventListener('mousedown', (event) => {
            if (event.target.classList.contains('ms-cell')) {
                msUpdateMouseButtons(event, true);
            }
        });

        document.addEventListener('mouseup', (event) => {
            if (event.target.classList.contains('ms-cell')) {
                msUpdateMouseButtons(event, false);
            } else {
                // Reset all buttons if clicking outside
                msMouseButtonsPressed.left = false;
                msMouseButtonsPressed.right = false;
                msMouseButtonsPressed.middle = false;
                msChordClickCell = null;
            }
        });

        window.msGlobalMouseListenersAdded = true;
    }
}


function msRevealCell(r, c) {
    if (r < 0 || r >= msRows || c < 0 || c >= msCols || msBoard[r][c].isRevealed || msBoard[r][c].isFlagged) {
        return;
    }

    msBoard[r][c].isRevealed = true;
    msRevealedCells++;
    msUpdateCellAppearance(r, c);

    console.log(`셀 공개: (${r},${c}) - 총 공개된 셀: ${msRevealedCells}`);

    if (msBoard[r][c].isMine) {
        console.log('💣 지뢰 밟음!');
        msHandleGameOver(false);
    } else {
        if (msBoard[r][c].adjacentMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    msRevealCell(r + dr, c + dc);
                }
            }
        }
        // 승리 조건 체크를 여기서 한 번 더 확인
        msCheckWinCondition();
    }
}

function msHandleGameOver(isWin) {
    console.log(`🎮 게임 오버 호출됨! 승리: ${isWin}`);
    msGameOver = true;
    msStopTimer(); // Stop the timer
    
    if (msResetButton) msResetButton.textContent = isWin ? '🥳' : '😵';

    // 포커스 및 텍스트 선택 정리
    if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
    }
    
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }

    if (isWin) {
        console.log('🏆 승리 처리 시작...');
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
        console.log(`⏱️ 경과 시간: ${elapsedTime}초`);
        console.log('📋 500ms 후 점수 대화상자 표시 예정...');
        setTimeout(() => {
            console.log('📋 점수 대화상자 표시 중...');
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
        setTimeout(() => {
            // 포커스 다시 정리 후 대화상자 표시
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
            msShowDialog('ms-gameover-dialog');
        }, 100);
    }
    
    // 게임 종료 후 포커스를 지뢰찾기 창으로 복원
    setTimeout(() => {
        const minesweeperWindow = document.getElementById('minesweeper-app-window');
        if (minesweeperWindow) {
            minesweeperWindow.focus();
        }
    }, 600);
}

function msCheckWinCondition() {
    if (msGameOver) return;
    
    const totalCells = msRows * msCols;
    const nonMineCells = totalCells - msMines;
    
    console.log(`승리 조건 체크: 공개된 셀 ${msRevealedCells}/${nonMineCells} (전체: ${totalCells}, 지뢰: ${msMines})`);
    
    if (nonMineCells === msRevealedCells) {
        console.log('🎉 게임 승리!');
        msHandleGameOver(true);
    }
}

function msAdjustWindowSize() {
    const minesweeperWindow = document.getElementById('minesweeper-app-window');
    if (!minesweeperWindow) return;

    // 각 구성 요소의 고정 높이 (더 컴팩트하게)
    const headerHeight = 30; // 창 헤더
    const menubarHeight = 24; // 메뉴바
    const controlsHeight = 45; // 컨트롤 패널
    const bodyPadding = 16; // body padding
    const extraMargin = 8; // 여유분 최소화
    
    // 그리드 크기 계산
    const cellSize = 25; // CSS에서 설정한 셀 크기
    const cellGap = 1; // CSS gap
    const gridPadding = 8; // CSS padding (4px * 2)
    const gridBorder = 6; // CSS border (3px * 2)
    
    const gridWidth = (msCols * cellSize) + ((msCols - 1) * cellGap) + gridPadding + gridBorder;
    const gridHeight = (msRows * cellSize) + ((msRows - 1) * cellGap) + gridPadding + gridBorder;
    
    // 창 크기 계산 (최소화)
    const windowWidth = Math.max(200, gridWidth + bodyPadding + 5); // 최소 폭 감소, 여유분 최소화
    const windowHeight = 10 + headerHeight + menubarHeight + controlsHeight + gridHeight + bodyPadding + extraMargin;
    
    // 창 크기 설정
    minesweeperWindow.style.width = windowWidth + 'px';
    minesweeperWindow.style.height = windowHeight + 'px';
    
    console.log(`창 크기 조정: ${windowWidth}x${windowHeight}px (그리드: ${gridWidth}x${gridHeight}px, ${msCols}x${msRows} 셀)`);
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
    const minesweeperWindowElement = document.getElementById('minesweeper-app-window');

    msGameMenuItem = document.getElementById('ms-game-menu-item'); // Global
    msGameDropdown = document.getElementById('ms-game-dropdown');   // Global
    msHelpMenuItem = document.getElementById('ms-help-menu-item'); // Global
    msHelpDropdown = document.getElementById('ms-help-dropdown');   // Global

    // Submenu items - can be local to msInitGame if only used for setup here
    const optionSubmenuItemLI = msGameDropdown ? msGameDropdown.querySelector('.ms-submenu-item') : null;
    const difficultySubmenuUL = optionSubmenuItemLI ? optionSubmenuItemLI.querySelector('.ms-difficulty-submenu') : null;


    if (!msGridElement || !msFlagsLeftElement || !msResetButton || !msTimerElement || !minesweeperWindowElement || !msGameMenuItem || !msGameDropdown || !msHelpMenuItem || !msHelpDropdown) {
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
            
            // 마우스오버 이벤트 추가 - 다른 메뉴가 열려있을 때 자동 전환
            msGameMenuItem.addEventListener('mouseenter', function(event) {
                if (activeMinesweeperMenu && activeMinesweeperMenu !== msGameDropdown) {
                    closeAllMinesweeperDropdowns();
                    toggleMinesweeperDropdown(this, msGameDropdown);
                }
            });
        }

        if (msHelpMenuItem && msHelpDropdown) {
            msHelpMenuItem.addEventListener('click', function(event) {
                event.stopPropagation();
                toggleMinesweeperDropdown(this, msHelpDropdown);
            });
            
            // 마우스오버 이벤트 추가 - 다른 메뉴가 열려있을 때 자동 전환
            msHelpMenuItem.addEventListener('mouseenter', function(event) {
                if (activeMinesweeperMenu && activeMinesweeperMenu !== msHelpDropdown) {
                    closeAllMinesweeperDropdowns();
                    toggleMinesweeperDropdown(this, msHelpDropdown);
                }
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
                msShowResultDialog('ℹ️', 'Minesweeper - A Classic Game\nImplemented by AI');
                closeAllMinesweeperDropdowns();
            });
        }

        // 순위 메뉴 이벤트
        const scoresAction = msGameDropdown ? msGameDropdown.querySelector('[data-action="ms-scores"]') : null;
        if (scoresAction) {
            scoresAction.addEventListener('click', (event) => {
                event.stopPropagation();
                msShowScoresWindow();
                closeAllMinesweeperDropdowns();
            });
        }

        // 순위 초기화 메뉴 이벤트 제거됨 - 점수 창에서만 처리


        // 🏆 버튼 제거됨 - 메뉴에서 순위 접근

        // Add reset button event listener
        if (msResetButton) {
            // 기존 이벤트 리스너 제거 후 새로 추가 (중복 방지)
            msResetButton.replaceWith(msResetButton.cloneNode(true));
            const newResetButton = document.getElementById('minesweeperReset');
            if (newResetButton) {
                msResetButton = newResetButton; // 전역 변수 업데이트
                msResetButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('🔄 재시작 버튼 클릭됨');
                    
                    // 포커스 정리
                    if (document.activeElement && document.activeElement.blur) {
                        document.activeElement.blur();
                    }
                    
                    // 텍스트 선택 해제
                    if (window.getSelection) {
                        window.getSelection().removeAllRanges();
                    }
                    
                    // 약간의 지연 후 게임 초기화
                    setTimeout(() => {
                        msInitGame();
                        console.log('✅ 게임 재시작 완료');
                    }, 50);
                });
                
                // 마우스 이벤트도 추가로 처리
                msResetButton.addEventListener('mousedown', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                });
                
                msResetButton.addEventListener('mouseup', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        }

        minesweeperEventListenersInitialized = true;
        console.log('Minesweeper event listeners initialized.');
    }
    
    // Initialize scores window event listeners if not already done
    msInitScoresWindow();
    
    // Initialize dialog event listeners
    msSetupDialogEvents();

    // 창 크기 조정을 지연시켜서 DOM 렌더링 완료 후 실행
    setTimeout(() => {
        msAdjustWindowSize();
    }, 50);
    closeAllMinesweeperDropdowns(); // Ensure menus are closed on init
    console.log(`✨ 지뢰찾기 게임 시작: ${getDifficultyName(msCurrentDifficulty)}`);
}

// --- Scores Window Initialization ---
let scoresWindowListenersInitialized = false;

function msSetupDialogEvents() {
    // 게임 오버 대화상자 이벤트
    const gameoverOkBtn = document.getElementById('ms-gameover-ok-btn');
    const gameoverCloseBtn = document.querySelector('#ms-gameover-dialog .window-close-button');
    
    if (gameoverOkBtn) {
        gameoverOkBtn.addEventListener('click', () => {
            msHideDialog('ms-gameover-dialog');
        });
    }
    
    if (gameoverCloseBtn) {
        gameoverCloseBtn.addEventListener('click', () => {
            msHideDialog('ms-gameover-dialog');
        });
    }
    
    // 결과 알림 대화상자 이벤트
    const resultOkBtn = document.getElementById('ms-result-ok-btn');
    const resultCloseBtn = document.querySelector('#ms-result-dialog .window-close-button');
    
    if (resultOkBtn) {
        resultOkBtn.addEventListener('click', () => {
            msHideDialog('ms-result-dialog');
        });
    }
    
    if (resultCloseBtn) {
        resultCloseBtn.addEventListener('click', () => {
            msHideDialog('ms-result-dialog');
        });
    }
    
    // 비밀번호 대화상자 이벤트 (한 번만 설정)
    msSetupPasswordDialogEvents();
}

function msShowPasswordDialog() {
    // 입력 필드 초기화
    const passwordInput = document.getElementById('ms-password-input');
    if (passwordInput) {
        passwordInput.value = '';
    }
    
    msShowDialog('ms-password-dialog');
    
    // 포커스를 지연시켜서 대화상자가 완전히 표시된 후 적용
    setTimeout(() => {
        const passwordInputDelayed = document.getElementById('ms-password-input');
        if (passwordInputDelayed) {
            passwordInputDelayed.focus();
            passwordInputDelayed.select(); // 기존 텍스트가 있다면 전체 선택
            console.log('✅ 비밀번호 입력 필드 포커스 완료');
        }
    }, 100);
}

function msSetupPasswordDialogEvents() {
    const passwordOkBtn = document.getElementById('ms-password-ok-btn');
    const passwordCancelBtn = document.getElementById('ms-password-cancel-btn');
    const passwordCloseBtn = document.querySelector('#ms-password-dialog .window-close-button');
    const passwordInput = document.getElementById('ms-password-input');
    
    if (passwordOkBtn) {
        passwordOkBtn.addEventListener('click', () => {
            const password = passwordInput ? passwordInput.value : '';
            if (password === '11111') {
                msHideDialog('ms-password-dialog');
                msResetAllScores();
            } else {
                msShowResultDialog('❌', '비밀번호가 올바르지 않습니다.');
            }
        });
    }
    
    if (passwordCancelBtn) {
        passwordCancelBtn.addEventListener('click', () => {
            msHideDialog('ms-password-dialog');
        });
    }
    
    if (passwordCloseBtn) {
        passwordCloseBtn.addEventListener('click', () => {
            msHideDialog('ms-password-dialog');
        });
    }
    
    // Enter 키로 확인하기
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const password = passwordInput.value;
                if (password === '11111') {
                    msHideDialog('ms-password-dialog');
                    msResetAllScores();
                } else {
                    msShowResultDialog('❌', '비밀번호가 올바르지 않습니다.');
                }
            }
        });
    }
}

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
        resetScoresBtn.addEventListener('click', () => {
            msShowPasswordDialog();
        });
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
