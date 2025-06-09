// DOM element that is a common parent for windows and where mouse events for drag/resize are delegated
// const desktop = document.querySelector('.desktop'); // Now in common.js

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
    // Ensure projectsWindowBody is selected if needed, or passed if it's specific to that app
    const projectsWindowBody = (windowId === 'projects-window') ? document.getElementById('projects-window')?.querySelector('.window-body') : null;

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

    // Make window visible to get its dimensions for centering, but keep it transparent
    windowElement.style.visibility = 'hidden'; // Prevent flash of content at 0,0
    windowElement.style.display = 'block';

    let windowWidth, windowHeight;

    if (windowId === 'projects-window') {
        windowWidth = 600; // Desired width for projects window
        windowHeight = 450; // Desired height for projects window
        windowElement.style.width = windowWidth + 'px';
        windowElement.style.height = windowHeight + 'px';
    } else {
        // For other windows, use their natural size from CSS or measure offsetWidth/Height
        windowWidth = windowElement.offsetWidth;
        windowHeight = windowElement.offsetHeight;
    }

    let topPosition = 0;
    let leftPosition = 0;

    if (typeof desktop !== 'undefined' && desktop) {
        const desktopRect = desktop.getBoundingClientRect();
        topPosition = (desktopRect.height - windowHeight) / 2;
        leftPosition = (desktopRect.width - windowWidth) / 2;
    } else { // Fallback if desktop dimensions somehow aren't available
        topPosition = (window.innerHeight - windowHeight) / 2;
        leftPosition = (window.innerWidth - windowWidth) / 2;
    }

    // Ensure positions are non-negative and provide a small margin from edges
    topPosition = Math.max(10, topPosition);
    leftPosition = Math.max(10, leftPosition);

    windowElement.style.top = topPosition + 'px';
    windowElement.style.left = leftPosition + 'px';
    windowElement.style.visibility = ''; // Make it visible again now that it's positioned

    // Animation class
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            windowElement.classList.add('active');
        });
    });

    if (windowId === 'projects-window' && typeof renderProjects === 'function' && projectsWindowBody && typeof projectsData !== 'undefined') {
        renderProjects(projectsWindowBody, projectsData);
    } else if (windowId === 'minesweeper-app-window' && typeof msInitGame === 'function') {
        msInitGame();
    }

    // Set focus to the newly opened/focused window
    activeWindow = windowElement; // This ensures the new window is considered active for dragging
    if(activeWindow) activeWindow.style.zIndex = currentMaxZIndex; // Ensure zIndex is applied
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
    const taskbarHeight = document.querySelector('.taskbar')?.offsetHeight || 40;

    if (typeof desktop !== 'undefined' && desktop) {
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

if (typeof desktop !== 'undefined' && desktop) { // Check if desktop (from common.js) is defined
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

if (typeof desktop !== 'undefined' && desktop) { // Check if desktop (from common.js) is defined
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
