// js/myComputerApp.js
// This script relies on js/common.js (for DOM elements if they were common, though not directly used here)
// and js/windowManager.js (for the openWindow function).

// Update system information in My Computer window with hardcoded boot screen data
function updateSystemInfo() {
    // Hardcoded system info from boot screen
    const osInfo = document.getElementById('os-info');
    const browserInfoEl = document.getElementById('browser-info');
    const cpuInfo = document.getElementById('cpu-info');
    const screenInfo = document.getElementById('screen-info');
    const languageInfo = document.getElementById('language-info');
    const memoryInfo = document.getElementById('memory-info');
    
    if (osInfo) osInfo.textContent = 'Windows Server 2022';
    if (browserInfoEl) browserInfoEl.textContent = 'Chrome (웹 데스크톱)';
    if (cpuInfo) cpuInfo.textContent = 'Intel Core i9-13900HK @ 5.4GHz (14코어, 20쓰레드)';
    if (screenInfo) screenInfo.textContent = '1920x1080 24비트';
    if (languageInfo) languageInfo.textContent = '한국어 (ko-KR)';
    if (memoryInfo) memoryInfo.textContent = '32768MB (32GB)';
    
    console.log('시스템 정보가 업데이트되었습니다 (하드코딩된 정보)');
}

function initializeMyComputerApp() {
    const driveCLink = document.getElementById('drive-c-link');

    console.log('Attempting to initialize My Computer App. driveCLink element:', driveCLink); // Debugging log

    // Initialize system info when window opens
    updateSystemInfo();

    // C: drive click handler
    if (driveCLink) {
        driveCLink.addEventListener('click', () => {
            console.log('C: drive clicked. Attempting to open Explorer.'); // Debugging log

            if (typeof openWindow === 'function') {
                openWindow('explorer-app-window', '파일 탐색기 - C:\\');
            } else {
                console.error('openWindow function is not defined. Ensure windowManager.js is loaded before myComputerApp.js.');
            }
        });
    } else {
        console.warn('Element with ID "drive-c-link" not found during myComputerApp initialization.');
    }
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMyComputerApp);
} else {
    initializeMyComputerApp();
}
