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

const explorerIcon = document.getElementById('icon-explorer');
if (typeof explorerIcon !== 'undefined' && explorerIcon) {
    explorerIcon.addEventListener('click', () => {
        openWindow('explorer-app-window', '파일 탐색기');
    });
}

const chromeIcon = document.getElementById('icon-chrome');
if (typeof chromeIcon !== 'undefined' && chromeIcon) {
    chromeIcon.addEventListener('click', () => {
        console.log('Chrome icon clicked. Opening Chrome browser window.');
        openWindow('chrome-app-window', 'Chrome Browser');
    });
}

const youtubeIcon = document.getElementById('icon-youtube');
if (typeof youtubeIcon !== 'undefined' && youtubeIcon) {
    youtubeIcon.addEventListener('click', () => {
        console.log('YouTube icon clicked. Opening YouTube in new tab.');
        // 윈도우 창 생성 없이 바로 새 탭에서 YouTube 열기
        window.open('https://youtube.com', '_blank');
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
    
    // 시작 메뉴 "프로그램": 프로젝트 내용 먼저, 그 다음 바탕화면 내장 프로그램들 (내컴퓨터, 프로젝트폴더 제외)
    
    // 프로젝트 데이터 먼저 추가 (실제 projectsData 사용)
    if (typeof projectsData !== 'undefined' && projectsData && projectsData.length > 0) {
        projectsData.forEach(project => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = project.link || '#';
            if (project.link && project.link !== '#') {
                link.target = '_blank';
            }

            let iconContent = '';
            if (project.iconUrl) {
                iconContent = `<img src="${project.iconUrl}" alt="${project.name}" style="width: 16px; height: 16px; margin-right: 8px; object-fit: contain; vertical-align: middle;">`;
            } else {
                let emoji = '📁'; // Default
                
                // projectsApp.js와 동일한 이모지 매핑
                switch (project.name) {
                    case 'OpenWebUI': emoji = '🤖'; break;
                    case 'Whisper STT': emoji = '🎤'; break;
                    case 'EdgeTTS': emoji = '🔊'; break;
                    case 'Zonos TTS': emoji = '🗣️'; break;
                    case 'Kokoro FastAPI': emoji = '🎵'; break;
                    case 'N8N': emoji = '⚙️'; break;
                    case 'Tribler': emoji = '🔗'; break;
                    case 'Cobalt': emoji = '📥'; break;

                    default:
                        switch (project.type) {
                            case 'AI/ML Service': emoji = '🤖'; break;
                            case 'Web Service': emoji = '🌐'; break;
                            case 'Dev/Ops Tool': emoji = '🛠️'; break;
                            default: emoji = '📁'; break;
                        }
                }
                iconContent = `<span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">${emoji}</span>`;
            }
            link.innerHTML = iconContent + `<span class="menu-text">${project.name}</span>`;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`프로젝트 클릭: ${project.name}, 링크: ${project.link}`);
                
                if (project.link && project.link !== '#' && !project.link.startsWith('javascript:')) {
                    console.log('외부 링크로 이동:', project.link);
                    window.open(project.link, '_blank');
                }
                
                hideStartMenu();
            });

            listItem.appendChild(link);
            allProgramsSubmenu.appendChild(listItem);
        });
    }

    // 구분선 추가

    // 바탕화면 내장 프로그램들 추가 (내 컴퓨터, 프로젝트 폴더 제외)
    const builtInPrograms = [
        { name: 'Calculator', isImage: true, imageSrc: 'images/calculator-icon.png', windowId: 'calculator-app-window' },
        { name: 'Minesweeper', emoji: '💣', windowId: 'minesweeper-app-window' },
        { name: 'Paint', emoji: '🎨', windowId: 'paint-app-window' },
        { name: '파일 탐색기', isImage: true, imageSrc: 'images/explorer_ICO_MYCOMPUTER.ico', windowId: 'explorer-app-window' },
        { name: 'Chrome', isImage: true, imageSrc: 'images/chrome-logo.svg', windowId: 'chrome-app-window' },
        { name: 'YouTube', isImage: true, imageSrc: 'images/youtube-logo.svg', windowId: 'youtube-app-window' }
    ];

    builtInPrograms.forEach(program => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        
        let iconContent = '';
        if (program.isImage && program.imageSrc) {
            iconContent = `<img src="${program.imageSrc}" alt="${program.name}" style="width: 16px; height: 16px; margin-right: 8px; object-fit: contain; vertical-align: middle;">`;
        } else {
            iconContent = `<span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">${program.emoji}</span>`;
        }
        link.innerHTML = iconContent + `<span class="menu-text">${program.name}</span>`;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`내장 프로그램 클릭: ${program.name}`);
            
            // YouTube는 바로 새 탭으로 열기
            if (program.name === 'YouTube') {
                console.log('YouTube - 새 탭으로 열기');
                window.open('https://youtube.com', '_blank');
            } else {
                // 다른 프로그램들은 기존대로 윈도우 열기
                if (typeof openWindow === 'function') {
                    openWindow(program.windowId, program.name);
                } else {
                    console.error('openWindow 함수를 찾을 수 없습니다');
                }
            }

            hideStartMenu(); // Hide entire start menu
        });

        listItem.appendChild(link);
        allProgramsSubmenu.appendChild(listItem);
    });
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
