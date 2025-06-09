// js/myComputerApp.js
// This script relies on js/common.js (for DOM elements if they were common, though not directly used here)
// and js/windowManager.js (for the openWindow function).

function initializeMyComputerApp() {
    const driveCLink = document.getElementById('drive-c-link');
    // const myComputerWindow = document.getElementById('my-computer-window'); // Not strictly needed for this logic

    if (driveCLink) {
        driveCLink.addEventListener('click', () => {
            // Check if the "My Computer" window is actually open and visible before allowing C drive click.
            // This might be desirable UX, but for now, allow opening Explorer regardless.
            // const myCompWindow = document.getElementById('my-computer-window');
            // if (myCompWindow && myCompWindow.style.display === 'block' && myCompWindow.classList.contains('active')) {

            if (typeof openWindow === 'function') {
                openWindow('explorer-app-window', 'Explorer - C:\\'); // Using backslash for path display
            } else {
                console.error('openWindow function is not defined. Ensure windowManager.js is loaded before myComputerApp.js.');
            }
            // }
        });
    } else {
        // This might run before #drive-c-link is available if not handled by DOMContentLoaded correctly
        // or if My Computer window isn't always in the DOM (but it is).
        console.warn('Element with ID "drive-c-link" not found during myComputerApp initialization.');
    }
}

// Ensure DOM is fully loaded before trying to attach event listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMyComputerApp);
} else {
    initializeMyComputerApp(); // DOM is already loaded
}
