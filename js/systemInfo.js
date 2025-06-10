// 시스템 정보 감지 및 표시 함수
function detectSystemInfo() {
    // 운영체제 감지
    function getOS() {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf('Windows') !== -1) {
            if (userAgent.indexOf('Windows NT 10.0') !== -1) return 'Windows 10/11';
            if (userAgent.indexOf('Windows NT 6.3') !== -1) return 'Windows 8.1';
            if (userAgent.indexOf('Windows NT 6.2') !== -1) return 'Windows 8';
            if (userAgent.indexOf('Windows NT 6.1') !== -1) return 'Windows 7';
            return 'Windows';
        }
        if (userAgent.indexOf('Mac') !== -1) return 'macOS';
        if (userAgent.indexOf('Linux') !== -1) return 'Linux';
        if (userAgent.indexOf('Android') !== -1) return 'Android';
        if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) return 'iOS';
        return '알 수 없음';
    }

    // 브라우저 감지
    function getBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf('Chrome') !== -1 && userAgent.indexOf('Edg') === -1) {
            const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
            return chromeMatch ? `Chrome ${chromeMatch[1]}` : 'Chrome';
        }
        if (userAgent.indexOf('Edg') !== -1) {
            const edgeMatch = userAgent.match(/Edg\/(\d+)/);
            return edgeMatch ? `Edge ${edgeMatch[1]}` : 'Edge';
        }
        if (userAgent.indexOf('Firefox') !== -1) {
            const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
            return firefoxMatch ? `Firefox ${firefoxMatch[1]}` : 'Firefox';
        }
        if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
            const safariMatch = userAgent.match(/Version\/(\d+)/);
            return safariMatch ? `Safari ${safariMatch[1]}` : 'Safari';
        }
        return '알 수 없음';
    }

    // CPU 코어 수 감지
    function getCPUCores() {
        if (navigator.hardwareConcurrency) {
            return `${navigator.hardwareConcurrency}개`;
        }
        return '감지 불가';
    }

    // 화면 해상도 감지
    function getScreenResolution() {
        return `${screen.width} × ${screen.height}`;
    }

    // 언어 설정 감지
    function getLanguage() {
        return navigator.language || navigator.userLanguage || '알 수 없음';
    }

    // 메모리 정보 감지 (제한적 지원)
    function getMemoryInfo() {
        if (navigator.deviceMemory) {
            return `약 ${navigator.deviceMemory}GB`;
        }
        if (performance && performance.memory) {
            const usedMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            const totalMB = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
            return `JS Heap: ${usedMB}/${totalMB}MB`;
        }
        return '감지 불가';
    }

    // 스토리지 정보 감지
    function getStorageInfo() {
        let info = [];
        
        try {
            // LocalStorage 크기 추정
            let localStorageSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    localStorageSize += localStorage[key].length;
                }
            }
            info.push(`Local: ${Math.round(localStorageSize / 1024)}KB`);
        } catch (e) {
            info.push('Local: 접근 불가');
        }

        try {
            // SessionStorage 크기 추정
            let sessionStorageSize = 0;
            for (let key in sessionStorage) {
                if (sessionStorage.hasOwnProperty(key)) {
                    sessionStorageSize += sessionStorage[key].length;
                }
            }
            info.push(`Session: ${Math.round(sessionStorageSize / 1024)}KB`);
        } catch (e) {
            info.push('Session: 접근 불가');
        }

        return info.join(', ');
    }

    // DOM 요소에 정보 업데이트
    const osInfo = document.getElementById('os-info');
    const browserInfo = document.getElementById('browser-info');
    const cpuInfo = document.getElementById('cpu-info');
    const screenInfo = document.getElementById('screen-info');
    const languageInfo = document.getElementById('language-info');
    const memoryInfo = document.getElementById('memory-info');

    if (osInfo) osInfo.textContent = getOS();
    if (browserInfo) browserInfo.textContent = getBrowser();
    if (cpuInfo) cpuInfo.textContent = getCPUCores();
    if (screenInfo) screenInfo.textContent = getScreenResolution();
    if (languageInfo) languageInfo.textContent = getLanguage();
    if (memoryInfo) memoryInfo.textContent = getMemoryInfo();

    console.log('시스템 정보가 업데이트되었습니다.');
}

// 내 컴퓨터 윈도우가 열릴 때 시스템 정보 감지
function initSystemInfo() {
    // 페이지 로드 시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', detectSystemInfo);
    } else {
        detectSystemInfo();
    }

    // 내 컴퓨터 아이콘 클릭 시에도 업데이트
    const myComputerIcon = document.getElementById('icon-my-computer');
    if (myComputerIcon) {
        myComputerIcon.addEventListener('click', () => {
            setTimeout(detectSystemInfo, 100); // 윈도우가 열린 후 정보 업데이트
        });
    }
}

// 초기화 실행
initSystemInfo(); 