// DOM element that is a common parent for windows and where mouse events for drag/resize are delegated
// const desktop = document.querySelector('.desktop'); // Now in common.js

// --- Windowing State & Z-index Management ---
let currentMaxZIndex = 500;
let preMaximizedStates = {}; // To store { windowId: { width, height, top, left } }
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
    console.log('Opening window with ID:', windowId, 'Title:', title); // Debugging log
    const windowElement = document.getElementById(windowId);
    // Ensure projectsWindowBody is selected if needed, or passed if it's specific to that app
    const projectsWindowBody = (windowId === 'projects-window') ? document.getElementById('projects-window')?.querySelector('.window-body') : null;

    console.log('Found element for ID', windowId, ':', windowElement); // Debugging log

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
    } else if (windowId === 'explorer-app-window') {
        windowWidth = 800; // New desired width for Explorer
        windowHeight = 600; // New desired height for Explorer
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
    } else if (windowId === 'explorer-app-window') { // Added for Explorer
        const explorerBody = windowElement.querySelector('.explorer-app-body');
        if (explorerBody) {
            explorerBody.innerHTML = ''; // Clear "Loading..." or previous content

            const iframe = document.createElement('iframe');
            iframe.src = '/explorer/'; // Path to the explorer app
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.setAttribute('title', 'Explorer Content');

            explorerBody.appendChild(iframe);
            console.log('Explorer iframe created and appended.');
        } else {
            console.error('Explorer window body (.explorer-app-body) not found for ID:', windowId);
        }
    }

    // Set focus to the newly opened/focused window
    activeWindow = windowElement; // This ensures the new window is considered active for dragging
    if(activeWindow) activeWindow.style.zIndex = currentMaxZIndex; // Ensure zIndex is applied
}

// --- Maximize/Restore Window Function ---
function toggleMaximizeWindow(windowElement) {
    if (!windowElement) return;
    const windowId = windowElement.id;
    // Assuming 'desktop' is globally available from common.js
    if (typeof desktop === 'undefined' || !desktop) {
        console.error("Desktop element not found for maximizing window.");
        return;
    }
    const desktopRect = desktop.getBoundingClientRect();
    const taskbarHeight = document.querySelector('.taskbar')?.offsetHeight || 40;

    const maximizeButton = windowElement.querySelector('.window-maximize-button');

    if (windowElement.classList.contains('maximized')) {
        // Restore window
        if (preMaximizedStates[windowId]) {
            windowElement.style.width = preMaximizedStates[windowId].width;
            windowElement.style.height = preMaximizedStates[windowId].height;
            windowElement.style.top = preMaximizedStates[windowId].top;
            windowElement.style.left = preMaximizedStates[windowId].left;
            delete preMaximizedStates[windowId];
        }
        windowElement.classList.remove('maximized');
        if (maximizeButton) maximizeButton.innerHTML = '❐'; // Restore icon
        if (maximizeButton) maximizeButton.setAttribute('aria-label', 'Maximize');

        const resizeHandle = windowElement.querySelector('.resize-handle');
        if (resizeHandle) resizeHandle.style.display = '';
    } else {
        // Maximize window
        preMaximizedStates[windowId] = {
            width: windowElement.style.width || windowElement.offsetWidth + 'px',
            height: windowElement.style.height || windowElement.offsetHeight + 'px',
            top: windowElement.style.top || windowElement.offsetTop + 'px',
            left: windowElement.style.left || windowElement.offsetLeft + 'px',
        };

        windowElement.style.width = desktopRect.width + 'px';
        windowElement.style.height = (desktopRect.height - taskbarHeight) + 'px';
        windowElement.style.top = '0px';
        windowElement.style.left = '0px';

        windowElement.classList.add('maximized');
        if (maximizeButton) maximizeButton.innerHTML = '□'; // Restore down icon
        if (maximizeButton) maximizeButton.setAttribute('aria-label', 'Restore');

        const resizeHandle = windowElement.querySelector('.resize-handle');
        if (resizeHandle) resizeHandle.style.display = 'none';
    }
    // Ensure the maximized/restored window is brought to front
    currentMaxZIndex++;
    windowElement.style.zIndex = currentMaxZIndex;
}

// --- Generic Window Control Button Handlers (Close, Maximize) ---
document.addEventListener('click', function(event) {
    const targetButton = event.target;
    const windowElement = targetButton.closest('.window');

    if (!windowElement) return;

    if (targetButton.classList.contains('window-close-button')) {
        windowElement.classList.remove('active');
        setTimeout(() => {
            windowElement.style.display = 'none';
        }, 200);
    } else if (targetButton.classList.contains('window-maximize-button')) {
        toggleMaximizeWindow(windowElement);
    }
});

// --- Draggable Windows Logic ---
function dragWindow(event) {
    if (!activeWindow || activeWindow.classList.contains('maximized')) return; // Prevent drag if maximized
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
            if (!resizingWindow || resizingWindow.classList.contains('maximized')) { // Prevent resize if maximized
                resizingWindow = null;
                return;
            }

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
