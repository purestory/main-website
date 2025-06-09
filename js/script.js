document.addEventListener('DOMContentLoaded', function() {
            const postScreen = document.getElementById('post-screen');
            const postMessagesContainer = document.getElementById('postMessages');
            const bootScreen = document.getElementById('boot-screen');
            const desktop = document.querySelector('.desktop');
            const bootMessageText = document.getElementById('bootMessageText');
            const bootProgressBar = document.getElementById('bootProgressBar');
            const bootProgressText = document.getElementById('bootProgressText');

            // --- Project Data ---
            const projectsData = [
                { name: 'OpenWebUI', description: 'Ollama용 웹 인터페이스', link: 'http://itsmyzone.iptime.org:3000/', type: 'AI/ML Service', status: 'Docker' },
                { name: 'Amica AI', description: '3D AI 가상 비서 (내부용)', link: '/amica/', type: 'AI/ML Service', status: 'Active' },
                { name: 'Explorer', description: '웹 기반 파일 탐색기', link: '/explorer/', type: 'Web Service', status: 'Active' },
                { name: 'N8N', description: '워크플로우 자동화', link: 'http://itsmyzone.iptime.org:5678/', type: 'Web Service', status: 'Docker' },
                { name: 'GPU Monitoring', description: '실시간 GPU 사용률 및 메모리 관리', link: '#', type: 'Dev/Ops Tool', status: 'Active' },
                { name: 'Ollama', description: '로컬 LLM 서버 (Docker)', link: '#', type: 'Dev/Ops Tool', status: 'Docker' }
            ];

            // --- POST Screen Sequence Logic ---
            const postScreenMessages = [
                "AMIBIOS(C) 2023 American Megatrends Inc.",
                "CPU: Generic x86-64 Processor @ 3.0GHz",
                "Memory Test: 16384M OK",
                "Initializing USB Controllers .. Done",
                "Detecting IDE Devices...",
                "  Primary Master: VBOX HARDDISK ATA Device",
                "  Primary Slave: None",
                "  Secondary Master: VBOX CD-ROM ATA Device",
                "  Secondary Slave: None",
                " ",
                "Booting from Hard Disk...",
            ];
            let currentPostMessageIndex = 0;
            const postMessageDelay = 250; // ms between each POST message

            function showNextPostMessage() {
                if (currentPostMessageIndex < postScreenMessages.length) {
                    postMessagesContainer.textContent += postScreenMessages[currentPostMessageIndex] + '\n';
                    currentPostMessageIndex++;
                    setTimeout(showNextPostMessage, postMessageDelay);
                } else {
                    // After all POST messages, wait a bit then hide POST screen and start main boot
                    setTimeout(() => {
                        postScreen.style.display = 'none';
                        startBootSequence(); // Proceed to the main boot sequence
                    }, 500); // Brief pause after last POST message
                }
            }

            function startPostScreenSequence() {
                postScreen.style.display = 'block'; // Or 'flex' if CSS is set up for it
                showNextPostMessage();
            }

            // --- Main Boot Sequence Logic ---
            const bootMessages = [
                "POST: System Check...", // This is a bit redundant now, consider removing or rephrasing
                "Memory Test: 16384MB OK",
                "Initializing USB Controllers...",
                "AHCI Driver Loaded.",
                "Loading Kernel (core.sys)...",
                "Starting Windows Services...",
                "Welcome!"
            ];

            let currentMessageIndex = 0;
            const numMessages = bootMessages.length;
            const totalBootTime = 10000;
            const messageInterval = (totalBootTime - 2000) / (numMessages > 1 ? (numMessages -1) : 1) ;

            let bootStartTime;
            let progressUpdateIntervalId;

            function showNextBootMessage() {
                if (currentMessageIndex < numMessages) {
                    bootMessageText.textContent = bootMessages[currentMessageIndex];
                    currentMessageIndex++;
                    if (currentMessageIndex < numMessages) {
                       setTimeout(showNextBootMessage, messageInterval);
                    }
                }
            }

            function updateBootProgress() {
                const elapsedTime = Date.now() - bootStartTime;
                let progressPercent = Math.min(100, Math.floor((elapsedTime / totalBootTime) * 100));
                bootProgressText.textContent = `${progressPercent}%`;

                if (progressPercent >= 100) {
                    clearInterval(progressUpdateIntervalId);
                }
            }

            function startBootSequence() {
                bootScreen.style.display = 'flex'; // Ensure boot screen is visible
                bootStartTime = Date.now();
                bootProgressBar.style.transition = `width ${totalBootTime / 1000}s linear`;
                requestAnimationFrame(() => {
                    bootProgressBar.style.width = '100%';
                });

                // Reset main boot message index if re-running (though not currently a feature)
                currentMessageIndex = 0;
                showNextBootMessage();
                progressUpdateIntervalId = setInterval(updateBootProgress, 100);

                setTimeout(() => {
                    clearInterval(progressUpdateIntervalId);
                    bootProgressText.textContent = '100%';
                    bootScreen.classList.add('hidden');
                    desktop.classList.add('visible');

                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                    }, 1000);
                }, totalBootTime);
            }

            // Start with POST sequence
            startPostScreenSequence();

            // --- Windowing Logic ---
            const projectsIcon = document.getElementById('icon-projects');
            const minesweeperIcon = document.getElementById('icon-minesweeper');
            const paintIcon = document.getElementById('icon-paint');
            const calculatorIcon = document.getElementById('icon-calculator');

            const projectsWindow = document.getElementById('projects-window');
            const projectsWindowBody = projectsWindow.querySelector('.window-body');

            let currentMaxZIndex = 500;
            let msGameInitialized = false; // Guard for Minesweeper init

            function openWindow(windowId, title) {
                const windowElement = document.getElementById(windowId);
                if (!windowElement) {
                    alert(`${title} app not implemented yet.`);
                    console.error(`Window element with ID ${windowId} not found.`);
                    return;
                }

                const windowTitleElement = windowElement.querySelector('.window-title');
                if (windowTitleElement) {
                    windowTitleElement.textContent = title;
                }

                currentMaxZIndex++;
                windowElement.style.zIndex = currentMaxZIndex;

                const openWindows = document.querySelectorAll('.window[style*="display: block"]').length;
                const offsetIncrement = 20;
                let topPosition = 50 + (openWindows * offsetIncrement);
                let leftPosition = 50 + (openWindows * offsetIncrement);

                if (leftPosition + windowElement.offsetWidth > desktop.clientWidth) {
                    leftPosition = desktop.clientWidth - windowElement.offsetWidth - 10;
                }
                if (topPosition + windowElement.offsetHeight > desktop.clientHeight - 40) {
                    topPosition = desktop.clientHeight - windowElement.offsetHeight - 40 - 10;
                }
                topPosition = Math.max(10, topPosition);
                leftPosition = Math.max(10, leftPosition);


                windowElement.style.top = topPosition + 'px';
                windowElement.style.left = leftPosition + 'px';

                windowElement.style.display = 'block';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        windowElement.classList.add('active');
                    });
                });

                if (windowId === 'projects-window') {
                    renderProjects(projectsWindowBody, projectsData);
                } else if (windowId === 'minesweeper-app-window') {
                    if (!msGameInitialized) { // Initialize game only once
                        msInitGame();
                        msGameInitialized = true;
                    } else { // Or reset if already initialized and re-opened
                        msInitGame(); // Ensures reset button smiley is correct etc.
                    }
                }
                 // Bring to front when opened
                activeWindow = windowElement; // Set as active for potential immediate drag/focus
                activeWindow.style.zIndex = currentMaxZIndex;
            }


            function renderProjects(targetElement, projects) {
                targetElement.innerHTML = '';

                const groupedProjects = projects.reduce((acc, project) => {
                    acc[project.type] = acc[project.type] || [];
                    acc[project.type].push(project);
                    return acc;
                }, {});

                for (const type in groupedProjects) {
                    const categoryHeader = document.createElement('h3');
                    categoryHeader.className = 'project-category-header';
                    categoryHeader.textContent = type;
                    targetElement.appendChild(categoryHeader);

                    groupedProjects[type].forEach(project => {
                        const itemLink = document.createElement('a');
                        itemLink.className = 'project-item';
                        itemLink.href = project.link;
                        if (project.link !== '#') {
                            itemLink.target = '_blank';
                        }

                        const nameDiv = document.createElement('div');
                        nameDiv.className = 'project-name';
                        nameDiv.textContent = project.name;
                        itemLink.appendChild(nameDiv);

                        const descDiv = document.createElement('div');
                        descDiv.className = 'project-description';
                        descDiv.textContent = project.description;
                        itemLink.appendChild(descDiv);

                        if (project.status) {
                            const statusSpan = document.createElement('span');
                            statusSpan.className = 'project-status';
                            statusSpan.textContent = project.status;
                            statusSpan.classList.add(`status-${project.status.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
                            itemLink.appendChild(statusSpan);
                        }
                        targetElement.appendChild(itemLink);
                    });
                }
            }

            projectsIcon.addEventListener('click', () => {
                openWindow('projects-window', 'Projects Explorer');
            });

            minesweeperIcon.addEventListener('click', () => {
                openWindow('minesweeper-app-window', 'Minesweeper');
            });
            paintIcon.addEventListener('click', () => {
                openWindow('paint-app', 'Paint');
            });
            calculatorIcon.addEventListener('click', () => {
                openWindow('calculator-app-window', 'Calculator');
            });

            document.addEventListener('click', function(event) {
                if (event.target.classList.contains('window-close-button')) {
                    const windowToClose = event.target.closest('.window');
                    if (windowToClose) {
                        windowToClose.classList.remove('active');
                        setTimeout(() => {
                            windowToClose.style.display = 'none';
                        }, 200);
                    }
                }
            });


            // --- Start Menu Logic ---
            const startButton = document.querySelector('.start-button');
            const startMenu = document.getElementById('start-menu');
            const startMenuItems = startMenu.querySelectorAll('li');

            function showStartMenu() {
                startMenu.style.display = 'block';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        startMenu.classList.add('active');
                    });
                });
            }

            function hideStartMenu() {
                startMenu.classList.remove('active');
                setTimeout(() => {
                    startMenu.style.display = 'none';
                }, 150);
            }

            startButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (startMenu.classList.contains('active')) {
                    hideStartMenu();
                } else {
                    showStartMenu();
                }
            });

            document.addEventListener('click', (event) => {
                if (startMenu.classList.contains('active') && !startMenu.contains(event.target) && event.target !== startButton) {
                    hideStartMenu();
                }
            });

            startMenuItems.forEach(item => {
                item.addEventListener('click', () => {
                    const windowIdToOpen = item.getAttribute('data-opens');
                    hideStartMenu();

                    if (windowIdToOpen === 'projects-window') {
                        openWindow('projects-window', 'Projects Explorer');
                    } else if (windowIdToOpen) {
                        const appName = item.textContent.trim().split(' ').slice(1).join(' ');
                        openWindow(windowIdToOpen, appName || "Application");
                    }
                });
            });

            // --- Taskbar Clock Logic ---
            const taskbarClock = document.getElementById('taskbar-clock');

            function updateClock() {
                const now = new Date();
                let hours = now.getHours();
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                taskbarClock.textContent = `${hours}:${minutes} ${ampm}`;
            }

            updateClock();
            setInterval(updateClock, 1000);

            // --- Calculator Logic ---
            const calcDisplay = document.getElementById('calcDisplay');
            const calcButtons = document.querySelectorAll('.calc-btn');

            let calcCurrentOperand = '';
            let calcPreviousOperand = '';
            let calcOperation = null;
            let calcDisplayNeedsReset = false;

            function updateCalcDisplay(value) {
                calcDisplay.value = value;
            }

            function clearCalculator() {
                calcCurrentOperand = '';
                calcPreviousOperand = '';
                calcOperation = null;
                calcDisplayNeedsReset = false;
                updateCalcDisplay('0');
            }

            function appendDigit(digit) {
                if (calcDisplayNeedsReset) {
                    calcCurrentOperand = '';
                    calcDisplayNeedsReset = false;
                }
                if (calcCurrentOperand === '0' && digit === '0') return;
                if (calcCurrentOperand === '0' && digit !== '0') {
                    calcCurrentOperand = digit;
                } else {
                    if (calcCurrentOperand.length >= 15) return;
                    calcCurrentOperand += digit;
                }
                updateCalcDisplay(calcCurrentOperand);
            }

            function chooseOperation(operation) {
                if (calcCurrentOperand === '' && calcPreviousOperand !== '') {
                    calcOperation = operation;
                    return;
                }
                if (calcCurrentOperand === '') return;

                if (calcPreviousOperand !== '') {
                    computeCalculation();
                }
                calcOperation = operation;
                calcPreviousOperand = calcCurrentOperand;
                calcCurrentOperand = '';
                calcDisplayNeedsReset = true;
                updateCalcDisplay(calcPreviousOperand);
            }

            function computeCalculation() {
                let result;
                const prev = parseFloat(calcPreviousOperand);
                const current = parseFloat(calcCurrentOperand);

                if (isNaN(prev) || isNaN(current)) return;

                switch (calcOperation) {
                    case '+':
                        result = prev + current;
                        break;
                    case '-':
                        result = prev - current;
                        break;
                    case '*':
                        result = prev * current;
                        break;
                    case '/':
                        if (current === 0) {
                            alert('Error: Division by zero');
                            clearCalculator();
                            return;
                        }
                        result = prev / current;
                        break;
                    default:
                        return;
                }
                calcCurrentOperand = result.toString();
                updateCalcDisplay(calcCurrentOperand);
                calcOperation = null;
                calcPreviousOperand = '';
                calcDisplayNeedsReset = true;
            }

            calcButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.dataset.value;
                    const isNumber = button.classList.contains('calc-btn-number');
                    const isOperator = button.classList.contains('calc-btn-operator');
                    const isEquals = button.classList.contains('calc-btn-equals');
                    const isClear = button.classList.contains('calc-btn-clear');

                    if (isNumber) {
                        appendDigit(value);
                    } else if (isOperator) {
                        chooseOperation(value);
                    } else if (isEquals) {
                        computeCalculation();
                    } else if (isClear) {
                        clearCalculator();
                    }
                });
            });

            clearCalculator();

            // --- Minesweeper Game Logic ---
            const msGridElement = document.getElementById('minesweeperGrid');
            const msFlagsLeftElement = document.getElementById('minesweeperFlagsLeft');
            const msResetButton = document.getElementById('minesweeperReset');

            const msRows = 9;
            const msCols = 9;
            const msMines = 10;

            let msBoard = [];
            let msMinesPlaced = false;
            let msFlagsUsed = 0;
            let msGameOver = false;
            let msRevealedCells = 0;

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
                    // Don't place on the first clicked cell or if already a mine
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
                const cellElement = msGridElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                if (!cellElement) return;
                const cellData = msBoard[r][c];

                // Clear previous state classes and content
                cellElement.innerHTML = '';
                cellElement.className = 'ms-cell'; // Reset to base class

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

            function msRenderBoard() {
                msGridElement.innerHTML = '';
                msGridElement.style.gridTemplateColumns = `repeat(${msCols}, 25px)`;
                msGridElement.style.gridTemplateRows = `repeat(${msRows}, 25px)`;

                for (let r = 0; r < msRows; r++) {
                    for (let c = 0; c < msCols; c++) {
                        const cellElement = document.createElement('div');
                        cellElement.classList.add('ms-cell');
                        cellElement.dataset.row = r;
                        cellElement.dataset.col = c;

                        cellElement.addEventListener('click', () => msHandleCellClick(r, c));
                        cellElement.addEventListener('contextmenu', (event) => msHandleCellRightClick(event, r, c));

                        msGridElement.appendChild(cellElement);
                        msUpdateCellAppearance(r,c); // Initial appearance
                    }
                }
            }

            function msHandleCellClick(r, c) {
                if (msGameOver || msBoard[r][c].isRevealed || msBoard[r][c].isFlagged) {
                    return;
                }

                if (!msMinesPlaced) {
                    msPlaceMines(r, c);
                }
                msRevealCell(r, c);
                msCheckWinCondition();
            }

            function msHandleCellRightClick(event, r, c) {
                event.preventDefault();
                if (msGameOver || msBoard[r][c].isRevealed) {
                    return;
                }

                msBoard[r][c].isFlagged = !msBoard[r][c].isFlagged;
                if (msBoard[r][c].isFlagged) {
                    msFlagsUsed++;
                } else {
                    msFlagsUsed--;
                }
                msFlagsLeftElement.textContent = `Mines: ${msMines - msFlagsUsed}`;
                msUpdateCellAppearance(r, c);
            }

            function msRevealCell(r, c) {
                if (r < 0 || r >= msRows || c < 0 || c >= msCols || msBoard[r][c].isRevealed || msBoard[r][c].isFlagged) {
                    return;
                }

                msBoard[r][c].isRevealed = true;
                msRevealedCells++;
                msUpdateCellAppearance(r, c);

                if (msBoard[r][c].isMine) {
                    msHandleGameOver(false); // Lose
                } else if (msBoard[r][c].adjacentMines === 0) {
                    // Flood fill for empty cells
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
                if (isWin) {
                    msResetButton.textContent = '🥳';
                    alert('You Win!');
                     // Optionally flag all remaining mines
                    for (let r = 0; r < msRows; r++) {
                        for (let c = 0; c < msCols; c++) {
                            if (msBoard[r][c].isMine && !msBoard[r][c].isFlagged) {
                                msBoard[r][c].isFlagged = true;
                                msUpdateCellAppearance(r,c);
                            }
                        }
                    }
                    msFlagsLeftElement.textContent = `Mines: 0`;


                } else { // Lose
                    msResetButton.textContent = '😵';
                    // Reveal all mines
                    for (let r = 0; r < msRows; r++) {
                        for (let c = 0; c < msCols; c++) {
                            if (msBoard[r][c].isMine) {
                                msBoard[r][c].isRevealed = true; // Ensure it's marked revealed for styling
                                msUpdateCellAppearance(r, c);
                            }
                        }
                    }
                    // Timeout for alert allows board to render mines before alert pops up
                    setTimeout(() => alert('Game Over!'), 100);
                }
            }

            function msCheckWinCondition() {
                if (msGameOver) return; // Don't check if already won/lost
                if ((msRows * msCols - msMines) === msRevealedCells) {
                    msHandleGameOver(true);
                }
            }

            function msInitGame() {
                msGameOver = false;
                msMinesPlaced = false;
                msFlagsUsed = 0;
                msRevealedCells = 0;
                msResetButton.textContent = '🙂';
                msFlagsLeftElement.textContent = `Mines: ${msMines - msFlagsUsed}`;

                msCreateBoardData(); // Creates board data but doesn't place mines yet
                msRenderBoard(); // Renders empty grid, ready for first click
            }

            if(msResetButton) { // Ensure button exists before adding listener
                msResetButton.addEventListener('click', msInitGame);
            }
            // Initial game setup is now called from openWindow if windowId === 'minesweeper-app-window'


            // --- Draggable Windows Logic ---
            let activeWindow = null;
            let offsetX, offsetY;

            function dragWindow(event) {
                if (!activeWindow) return;
                event.preventDefault();

                let newX = event.clientX - offsetX;
                let newY = event.clientY - offsetY;

                const headerHeight = activeWindow.querySelector('.window-header').offsetHeight;
                const taskbarHeight = document.querySelector('.taskbar').offsetHeight;

                newX = Math.max(-activeWindow.offsetWidth + 50, Math.min(newX, desktop.clientWidth - 50));
                newY = Math.max(0, Math.min(newY, desktop.clientHeight - taskbarHeight - headerHeight + 20 ));

                activeWindow.style.left = newX + 'px';
                activeWindow.style.top = newY + 'px';
            }

            function stopDrag() {
                if (!activeWindow) return;
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', dragWindow);
                document.removeEventListener('mouseup', stopDrag);
                activeWindow = null;
            }

            desktop.addEventListener('mousedown', function(event) {
                const targetHeader = event.target.closest('.window-header');
                if (targetHeader) {
                    activeWindow = targetHeader.closest('.window');
                    if (!activeWindow) return;

                    currentMaxZIndex++;
                    activeWindow.style.zIndex = currentMaxZIndex;

                    const rect = activeWindow.getBoundingClientRect();
                    offsetX = event.clientX - rect.left;
                    offsetY = event.clientY - rect.top;

                    document.body.style.userSelect = 'none';

                    document.addEventListener('mousemove', dragWindow);
                    document.addEventListener('mouseup', stopDrag);
                }
            });

            // --- Resizable Windows Logic ---
            let resizingWindow = null;
            let initialMouseX, initialMouseY;
            let initialWindowWidth, initialWindowHeight;

            function resizeOnDrag(event) {
                if (!resizingWindow) return;
                event.preventDefault();

                const dx = event.clientX - initialMouseX;
                const dy = event.clientY - initialMouseY;

                let newWidth = initialWindowWidth + dx;
                let newHeight = initialWindowHeight + dy;

                // Apply minimum size constraints
                newWidth = Math.max(150, newWidth); // Min width 150px
                newHeight = Math.max(100, newHeight); // Min height 100px

                resizingWindow.style.width = newWidth + 'px';
                resizingWindow.style.height = newHeight + 'px';
            }

            function stopResize() {
                if (!resizingWindow) return;
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', resizeOnDrag);
                document.removeEventListener('mouseup', stopResize);
                resizingWindow = null;
            }

            desktop.addEventListener('mousedown', function(event) {
                if (event.target.classList.contains('resize-handle')) {
                    event.preventDefault(); // Prevent text selection and other default actions
                    event.stopPropagation(); // Stop event from bubbling to window drag logic

                    resizingWindow = event.target.closest('.window');
                    if (!resizingWindow) return;

                    // Bring window to front
                    currentMaxZIndex++;
                    resizingWindow.style.zIndex = currentMaxZIndex;

                    initialMouseX = event.clientX;
                    initialMouseY = event.clientY;
                    initialWindowWidth = resizingWindow.offsetWidth;
                    initialWindowHeight = resizingWindow.offsetHeight;

                    document.body.style.userSelect = 'none';
                    document.addEventListener('mousemove', resizeOnDrag);
                    document.addEventListener('mouseup', stopResize);
                }
            });

        });

        /* Commenting out old script
        window.addEventListener('load', function() {
            // 서비스 카드 애니메이션
            const serviceCards = document.querySelectorAll('.service-category');
            serviceCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        });
        */
