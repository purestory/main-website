// DOM element that is a common parent for windows and where mouse events for drag/resize are delegated
const desktop = document.querySelector('.desktop');

// --- Windowing State & Z-index Management ---
let currentMaxZIndex = 500;
let activeWindow = null; // For dragging
let offsetX, offsetY;    // For dragging

let resizingWindow = null; // For resizing
let initialMouseX, initialMouseY; // For resizing
let initialWindowWidth, initialWindowHeight; // For resizing

// --- Generic Window Open Function ---
// Depends on renderProjects (from projectsApp.js) and msInitGame (from minesweeper.js) being globally available
// Also depends on projectsWindowBody being available if projects-window is opened.
// Consider passing callbacks or using custom events for more robust decoupling later.
function openWindow(windowId, title) {
    const windowElement = document.getElementById(windowId);
    const projectsWindowBody = document.getElementById('projects-window')?.querySelector('.window-body'); // Get it if it exists

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

    // Basic staggering for new windows, can be improved
    const openWindows = document.querySelectorAll('.window[style*="display: block"]').length;
    const offsetIncrement = 25;
    let topPosition = 50 + (openWindows * offsetIncrement);
    let leftPosition = 50 + (openWindows * offsetIncrement);

    // Boundary check for initial position
    if (desktop) { // Make sure desktop is found
        if (leftPosition + windowElement.offsetWidth > desktop.clientWidth) {
            leftPosition = Math.max(10, desktop.clientWidth - windowElement.offsetWidth - 10);
        }
        if (topPosition + windowElement.offsetHeight > desktop.clientHeight - 40) { // 40 for taskbar
            topPosition = Math.max(10, desktop.clientHeight - windowElement.offsetHeight - 40 - 10);
        }
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

    if (windowId === 'projects-window' && typeof renderProjects === 'function' && projectsWindowBody) {
        renderProjects(projectsWindowBody, projectsData); // projectsData should be global or passed
    } else if (windowId === 'minesweeper-app-window' && typeof msInitGame === 'function') {
        // msGameInitialized flag and logic would be part of minesweeper.js
        msInitGame();
    }

    // Set focus to the newly opened/focused window for dragging
    activeWindow = windowElement;
    activeWindow.style.zIndex = currentMaxZIndex;
}

// --- Generic Window Close Button Handler ---
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

// --- Draggable Windows Logic ---
function dragWindow(event) {
    if (!activeWindow) return;
    event.preventDefault();

    let newX = event.clientX - offsetX;
    let newY = event.clientY - offsetY;

    const headerHeight = activeWindow.querySelector('.window-header').offsetHeight;
    const taskbarHeight = document.querySelector('.taskbar')?.offsetHeight || 40; // Fallback if taskbar not found

    if (desktop) { // Make sure desktop is found
        newX = Math.max(-activeWindow.offsetWidth + 50, Math.min(newX, desktop.clientWidth - 50));
        newY = Math.max(0, Math.min(newY, desktop.clientHeight - taskbarHeight - headerHeight + 20 ));
    }

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

if (desktop) {
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
}


// --- Resizable Windows Logic ---
function resizeOnDrag(event) {
    if (!resizingWindow) return;
    event.preventDefault();

    const dx = event.clientX - initialMouseX;
    const dy = event.clientY - initialMouseY;

    let newWidth = initialWindowWidth + dx;
    let newHeight = initialWindowHeight + dy;

    newWidth = Math.max(150, newWidth);
    newHeight = Math.max(100, newHeight);

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

if (desktop) {
    desktop.addEventListener('mousedown', function(event) {
        if (event.target.classList.contains('resize-handle')) {
            event.preventDefault();
            event.stopPropagation();

            resizingWindow = event.target.closest('.window');
            if (!resizingWindow) return;

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
}
