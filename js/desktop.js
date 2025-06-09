// Assumes openWindow is globally available from windowManager.js
// Assumes DOM is ready (scripts deferred)

// --- Desktop Icon Selectors & Event Listeners ---
const projectsIcon = document.getElementById('icon-projects');
const minesweeperIcon = document.getElementById('icon-minesweeper');
const paintIcon = document.getElementById('icon-paint');
const calculatorIcon = document.getElementById('icon-calculator');

if (projectsIcon) {
    projectsIcon.addEventListener('click', () => {
        openWindow('projects-window', 'Projects Explorer');
    });
}
if (minesweeperIcon) {
    minesweeperIcon.addEventListener('click', () => {
        openWindow('minesweeper-app-window', 'Minesweeper');
    });
}
if (paintIcon) {
    paintIcon.addEventListener('click', () => {
        openWindow('paint-app', 'Paint');
    });
}
if (calculatorIcon) {
    calculatorIcon.addEventListener('click', () => {
        openWindow('calculator-app-window', 'Calculator');
    });
}

// --- Start Menu Logic ---
const startButton = document.querySelector('.start-button');
const startMenu = document.getElementById('start-menu');

if (startButton && startMenu) {
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

            // The openWindow function is expected to be globally available from windowManager.js
            if (typeof openWindow === 'function') {
                if (windowIdToOpen) {
                    const appName = item.textContent.trim().split(' ').slice(1).join(' ') || item.textContent.trim();
                    openWindow(windowIdToOpen, appName);
                }
            } else {
                console.error("openWindow function not found. Ensure windowManager.js is loaded.");
            }
        });
    });
}

// --- Taskbar Clock Logic ---
const taskbarClock = document.getElementById('taskbar-clock');

if (taskbarClock) {
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
