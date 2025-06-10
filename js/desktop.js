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
        openWindow('projects-window', '프로그램'); // Changed title to "프로그램"
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
const allProgramsMenuItem = document.getElementById('all-programs-menu-item');
const allProgramsSubmenu = document.getElementById('all-programs-submenu');
let hideSubmenuTimer = null;

// 글로벌 함수들 정의 (HTML에서 참조될 수 있음)
window.toggleProgramsSubmenu = function() {
    const submenu = document.getElementById('all-programs-submenu');
    if (submenu) {
        if (submenu.style.display === 'block') {
            submenu.style.display = 'none';
            submenu.style.visibility = 'hidden';
        } else {
            if (submenu.children.length === 0) {
                populateAllProgramsSubmenu();
            }
            submenu.style.display = 'block';
            submenu.style.visibility = 'visible';
        }
    }
};

window.showProgramsSubmenu = function() {
    const submenu = document.getElementById('all-programs-submenu');
    if (submenu) {
        if (hideSubmenuTimer) {
            clearTimeout(hideSubmenuTimer);
            hideSubmenuTimer = null;
        }
        if (submenu.children.length === 0) {
            populateAllProgramsSubmenu();
        }
        submenu.style.display = 'block';
        submenu.style.visibility = 'visible';
    }
};

window.hideProgramsSubmenu = function() {
    hideSubmenuTimer = setTimeout(() => {
        const submenu = document.getElementById('all-programs-submenu');
        if (submenu) {
            submenu.style.display = 'none';
            submenu.style.visibility = 'hidden';
        }
    }, 300);
};

window.clearHideTimer = function() {
    if (hideSubmenuTimer) {
        clearTimeout(hideSubmenuTimer);
        hideSubmenuTimer = null;
    }
};

// 디버깅: DOM 요소들 확인
console.log('=== DOM 요소 확인 ===');
console.log('allProgramsMenuItem:', allProgramsMenuItem);
console.log('allProgramsSubmenu:', allProgramsSubmenu);
console.log('startButton:', typeof startButton, startButton);
console.log('startMenu:', typeof startMenu, startMenu);

// DOM이 완전히 로드될 때까지 기다리기
setTimeout(() => {
    const actualStartButton = document.querySelector('.start-button');
    const actualStartMenu = document.getElementById('start-menu');
    const actualAllProgramsMenuItem = document.getElementById('all-programs-menu-item');
    const actualAllProgramsSubmenu = document.getElementById('all-programs-submenu');
    
    console.log('=== setTimeout에서 재확인 ===');
    console.log('actualStartButton:', actualStartButton);
    console.log('actualStartMenu:', actualStartMenu);
    console.log('actualAllProgramsMenuItem:', actualAllProgramsMenuItem);
    console.log('actualAllProgramsSubmenu:', actualAllProgramsSubmenu);
    
if ((typeof startButton !== 'undefined' && startButton && typeof startMenu !== 'undefined' && startMenu) || 
    (actualStartButton && actualStartMenu)) {
    const startMenuList = document.getElementById('startMenuList'); // Get the main list
    // QuerySelectorAll on startMenu for direct children li of startMenuList to avoid submenu items
    const startMenuItems = startMenuList ? startMenuList.querySelectorAll(':scope > li') : [];


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
        if (allProgramsSubmenu) { // Hide submenu when main menu is hidden
            allProgramsSubmenu.style.display = 'none';
            allProgramsSubmenu.style.visibility = 'hidden';
        }
        setTimeout(() => {
            startMenu.style.display = 'none';
        }, 150);
    }

    startButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (startMenu.classList.contains('active')) {
            hideStartMenu();
        } else {
            console.log('스타트 메뉴 열기, projectsData 확인:', typeof projectsData, projectsData?.length);
            populateAllProgramsSubmenu(); // Populate "All Programs" when start menu is opened
            showStartMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (startMenu.classList.contains('active') && !startMenu.contains(event.target) && event.target !== startButton) {
            hideStartMenu();
        }
    });

    startMenuItems.forEach(item => {
        // Attach click only to items that are not submenus themselves or have a data-opens directly
        if (!item.classList.contains('has-submenu') && item.dataset.opens) {
            item.addEventListener('click', () => {
                const windowIdToOpen = item.getAttribute('data-opens');
                hideStartMenu();

                if (typeof openWindow === 'function') {
                    if (windowIdToOpen) {
                        // Extract name more carefully, maybe from a specific span if structure is consistent
                        const menuTextElement = item.querySelector('.menu-text') || item;
                        const appName = menuTextElement.textContent.trim().replace(/^📁\s*|^💣\s*|^🎨\s*|^🧮\s*/, '').trim() || "Application";
                        openWindow(windowIdToOpen, appName);
                    }
                } else {
                    console.error("openWindow function not found. Ensure windowManager.js is loaded before desktop.js.");
                }
            });
        }
    });

    // "All Programs" submenu logic
    if (allProgramsMenuItem && allProgramsSubmenu) {
        console.log('=== 서브메뉴 이벤트 리스너 등록 중 ===');
        // 클릭 이벤트 추가 - 모바일 및 클릭 지원
        allProgramsMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = allProgramsSubmenu.style.display === 'block';
            
            if (isVisible) {
                allProgramsSubmenu.style.display = 'none';
                allProgramsSubmenu.style.visibility = 'hidden';
                console.log('서브메뉴 숨김');
            } else {
                // 서브메뉴가 비어있으면 다시 채우기
                if (allProgramsSubmenu.children.length === 0) {
                    console.log('서브메뉴 내용 채우는 중...');
                    populateAllProgramsSubmenu();
                }
                // 인라인 스타일로 강제 표시
                allProgramsSubmenu.setAttribute('style', 'display: block !important; position: absolute !important; left: 100% !important; top: -3px !important; min-width: 230px !important; background-color: #c0c0c0 !important; border: 2px outset #ffffff !important; z-index: 1300 !important; padding: 2px !important; list-style: none !important; max-height: 350px !important; overflow-y: auto !important; box-shadow: 3px 3px 8px rgba(0,0,0,0.5) !important; visibility: visible !important;');
                console.log('서브메뉴 표시됨, 자식 수:', allProgramsSubmenu.children.length);
            }
        });

        allProgramsMenuItem.addEventListener('mouseenter', () => {
            if (hideSubmenuTimer) {
                clearTimeout(hideSubmenuTimer);
                hideSubmenuTimer = null;
            }
            // 서브메뉴가 비어있으면 다시 채우기
            if (allProgramsSubmenu.children.length === 0) {
                populateAllProgramsSubmenu();
            }
            allProgramsSubmenu.style.display = 'block';
            allProgramsSubmenu.style.visibility = 'visible';
            allProgramsSubmenu.style.position = 'absolute';
            allProgramsSubmenu.style.left = '100%';
            allProgramsSubmenu.style.top = '-2px';
            allProgramsSubmenu.style.zIndex = '1200';
        });

        allProgramsMenuItem.addEventListener('mouseleave', () => {
            hideSubmenuTimer = setTimeout(() => {
                allProgramsSubmenu.style.display = 'none';
                allProgramsSubmenu.style.visibility = 'hidden';
            }, 300);
        });

        allProgramsSubmenu.addEventListener('mouseenter', () => {
            if (hideSubmenuTimer) {
                clearTimeout(hideSubmenuTimer);
                hideSubmenuTimer = null;
            }
        });

        allProgramsSubmenu.addEventListener('mouseleave', () => {
            hideSubmenuTimer = setTimeout(() => {
                allProgramsSubmenu.style.display = 'none';
                allProgramsSubmenu.style.visibility = 'hidden';
            }, 300);
        });
    }

}

window.populateAllProgramsSubmenu = function populateAllProgramsSubmenu() {
    console.log('populateAllProgramsSubmenu 호출됨');
    
    if (!allProgramsSubmenu) {
        console.error('allProgramsSubmenu 요소를 찾을 수 없습니다');
        return;
    }
    
    if (!startMenu || !startMenu.contains(allProgramsSubmenu)) {
        console.error('startMenu 또는 allProgramsSubmenu 구조 문제');
        return;
    }
    
    allProgramsSubmenu.innerHTML = ''; // Clear existing items
    
    console.log('projectsData 상태:', typeof projectsData, projectsData?.length);
    
    // projectsData가 없으면 기본 데이터 사용
    let dataToUse = projectsData;
    if (typeof projectsData === 'undefined' || !projectsData || projectsData.length === 0) {
        console.log('projectsData가 없어서 기본 데이터 사용');
        dataToUse = [
            { name: 'OpenWebUI', description: 'Ollama용 웹 인터페이스', link: 'http://itsmyzone.iptime.org:3000/', type: 'AI/ML Service', status: 'Docker' },
            { name: 'Amica AI', description: '3D AI 가상 비서', link: '/amica/', type: 'AI/ML Service', status: 'Active' },
            { name: 'Translation Service', description: 'AI 기반 번역', link: '/translation/', type: 'AI/ML Service', status: 'Active' },
            { name: 'Whisper STT', description: '음성-텍스트 변환', link: '/whisper/', type: 'AI/ML Service', status: 'Active' },
            { name: 'EdgeTTS', description: 'TTS 서비스', link: '/edgetts/', type: 'AI/ML Service', status: 'Active' },
            { name: 'Explorer', description: '파일 탐색기', link: '/explorer/', type: 'Web Service', status: 'Active' },
            { name: 'N8N', description: '워크플로우 자동화', link: 'http://itsmyzone.iptime.org:5678/', type: 'Web Service', status: 'Docker' }
        ];
    }

    if (dataToUse && dataToUse.length > 0) {
        console.log(`${dataToUse.length}개의 프로그램 항목 생성 중...`);
        dataToUse.forEach(program => {
            const listItem = document.createElement('li');

            // Create an anchor for better semantics and potential future right-click context menus
            const link = document.createElement('a');
            link.href = program.link || '#'; // Use program link or # if none
             if (program.link && program.link !== '#') {
                 link.target = '_blank';
             }

            let iconContent = '';
            if (program.iconUrl) {
                iconContent = `<img src="${program.iconUrl}" alt="${program.name}" style="width: 16px; height: 16px; margin-right: 8px; object-fit: contain; vertical-align: middle;">`;
            } else {
                let emoji = '📁'; // Default
                
                // 각 프로젝트별 맞춤 이모지
                switch (program.name) {
                    // AI/ML 서비스들
                    case 'OpenWebUI': emoji = '🤖'; break; // AI 인터페이스
                    case 'Whisper STT': emoji = '🎤'; break; // 음성-텍스트 변환
                    case 'EdgeTTS': emoji = '🔊'; break; // 텍스트-음성 변환
                    case 'Zonos TTS': emoji = '🗣️'; break; // 고품질 TTS
                    case 'Kokoro FastAPI': emoji = '🎵'; break; // 다국어 TTS
                    
                    // 웹 서비스들
                    case 'Explorer': emoji = '📁'; break; // 파일 탐색기
                    case 'N8N': emoji = '⚙️'; break; // 워크플로우 자동화
                    case 'Tribler': emoji = '🔗'; break; // P2P 파일 공유
                    case 'Cobalt': emoji = '📥'; break; // 소셜 미디어 다운로더
                    case 'WebTools': emoji = '🖼️'; break; // 이미지 변환 도구
                    
                    // 타입별 기본값
                    default:
                        switch (program.type) {
                            case 'AI/ML Service': emoji = '🤖'; break;
                            case 'Web Service': emoji = '🌐'; break;
                            case 'Dev/Ops Tool': emoji = '🛠️'; break;
                        }
                }
                iconContent = `<span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">${emoji}</span>`;
            }
            link.innerHTML = iconContent + `<span class="menu-text">${program.name}</span>`;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`프로그램 클릭: ${program.name}, 링크: ${program.link}`);
                
                // 외부 링크나 절대 경로를 가진 프로그램들은 새 탭에서 열기
                if (program.link && program.link !== '#' && !program.link.startsWith('javascript:')) {
                    console.log('외부 링크로 이동:', program.link);
                    window.open(program.link, '_blank');
                    hideStartMenu();
                    return;
                }
                
                // 내부 윈도우를 가진 프로그램들
                let windowIdToOpen = program.name.toLowerCase().replace(/\s+/g, '-') + '-app-window';

                // Specific known window IDs
                if (program.name === 'Projects Explorer' || program.name === '프로그램') {
                   windowIdToOpen = 'projects-window';
                } else if (program.name === 'Calculator') {
                    windowIdToOpen = 'calculator-app-window';
                } else if (program.name === 'Minesweeper') {
                    windowIdToOpen = 'minesweeper-app-window';
                } else if (program.name === '내 컴퓨터') {
                     windowIdToOpen = 'my-computer-window';
                } else if (program.name === 'Explorer') {
                    windowIdToOpen = 'explorer-app-window';
                }

                console.log('윈도우 열기 시도:', windowIdToOpen);
                if (typeof openWindow === 'function') {
                    openWindow(windowIdToOpen, program.name);
                } else {
                    console.error('openWindow 함수를 찾을 수 없습니다');
                }

                hideStartMenu(); // Hide entire start menu
            });

            listItem.appendChild(link);
            allProgramsSubmenu.appendChild(listItem);
        });
    } else {
        console.log('projectsData가 없거나 비어있음. 기본 항목 추가');
        const noProgramsItem = document.createElement('li');
        noProgramsItem.textContent = '(프로그램이 없음)';
        noProgramsItem.style.fontStyle = 'italic';
        noProgramsItem.style.padding = '8px 12px';
        noProgramsItem.style.color = '#666';
        allProgramsSubmenu.appendChild(noProgramsItem);
        
        // 디버깅을 위해 몇 개 기본 항목 추가
        const debugItems = [
            { name: 'Calculator', type: 'App' },
            { name: 'Minesweeper', type: 'Game' },
            { name: 'My Computer', type: 'System' }
        ];
        
        debugItems.forEach(item => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.innerHTML = `<span style="margin-right: 8px;">📁</span><span class="menu-text">${item.name}</span>`;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`디버그 항목 클릭: ${item.name}`);
                hideStartMenu();
            });
            
            listItem.appendChild(link);
            allProgramsSubmenu.appendChild(listItem);
        });
    }
};

}, 100); // setTimeout 종료

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
