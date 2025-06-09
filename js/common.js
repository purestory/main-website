// js/common.js
// These variables will be available globally to other scripts loaded after this one,
// provided all scripts are loaded with 'defer' which ensures DOM is ready.

const desktop = document.querySelector('.desktop');
const postScreen = document.getElementById('post-screen');
const postMessagesContainer = document.getElementById('postMessages');
const bootScreen = document.getElementById('boot-screen');
const bootMessageText = document.getElementById('bootMessageText');
const bootProgressBar = document.getElementById('bootProgressBar');
const bootProgressText = document.getElementById('bootProgressText');

// Common elements for window management (used by windowManager.js and potentially others)
// Note: Specific app windows like projectsWindow, calculator-app-window, etc.,
// should be selected within their respective app logic or when opened, not globally here
// unless absolutely necessary and universally used.

// Common elements for desktop interactions (used by desktop.js)
const projectsIcon = document.getElementById('icon-projects');
const minesweeperIcon = document.getElementById('icon-minesweeper');
const paintIcon = document.getElementById('icon-paint');
const calculatorIcon = document.getElementById('icon-calculator');

const startButton = document.querySelector('.start-button');
const startMenu = document.getElementById('start-menu');
// startMenuItems will be queried within desktop.js as it's specific to its setup.

const taskbarClock = document.getElementById('taskbar-clock');

// Add other common elements if identified as being re-declared.
// For now, this covers the most obvious ones based on previous structure.
