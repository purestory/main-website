// Assumes openWindow is globally available from windowManager.js
// Assumes DOM is ready (scripts deferred)
// Assumes common DOM elements like projectsIcon, startButton, etc. are globally available from common.js

// --- Desktop Icon Selectors & Event Listeners ---
// const projectsIcon = document.getElementById('icon-projects'); // Now in common.js
// const minesweeperIcon = document.getElementById('icon-minesweeper'); // Now in common.js
// const paintIcon = document.getElementById('icon-paint'); // Now in common.js
// const calculatorIcon = document.getElementById('icon-calculator'); // Now in common.js

if (typeof projectsIcon !== 'undefined' && projectsIcon) {
    projectsIcon.addEventListener('click', () => {
        openWindow('projects-window', 'Projects Explorer');
    });
}
if (typeof minesweeperIcon !== 'undefined' && minesweeperIcon) {
    minesweeperIcon.addEventListener('click', () => {
        openWindow('minesweeper-app-window', 'Minesweeper');
    });
}
if (typeof paintIcon !== 'undefined' && paintIcon) {
    paintIcon.addEventListener('click', () => {
        openWindow('paint-app', 'Paint');
    });
}
if (typeof calculatorIcon !== 'undefined' && calculatorIcon) {
    calculatorIcon.addEventListener('click', () => {
        openWindow('calculator-app-window', 'Calculator');
    });
}
if (typeof myComputerIcon !== 'undefined' && myComputerIcon) { // Added for My Computer
    myComputerIcon.addEventListener('click', () => {
        openWindow('my-computer-window', '내 컴퓨터');
    });
}

// --- Start Menu Logic ---
// const startButton = document.querySelector('.start-button'); // Now in common.js
// const startMenu = document.getElementById('start-menu'); // Now in common.js

if (typeof startButton !== 'undefined' && startButton && typeof startMenu !== 'undefined' && startMenu) {
    const startMenuItems = startMenu.querySelectorAll('li'); // This selector is specific enough to stay here

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

            if (typeof openWindow === 'function') {
                if (windowIdToOpen) {
                    const appName = item.textContent.trim().split(' ').slice(1).join(' ') || item.textContent.trim();
                    openWindow(windowIdToOpen, appName);
                }
            } else {
                console.error("openWindow function not found. Ensure windowManager.js is loaded before desktop.js.");
            }
        });
    });
}

// --- Taskbar Clock Logic ---
// const taskbarClock = document.getElementById('taskbar-clock'); // Now in common.js

if (typeof taskbarClock !== 'undefined' && taskbarClock) {
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
}
