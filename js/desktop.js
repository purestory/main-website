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

if (typeof startButton !== 'undefined' && startButton && typeof startMenu !== 'undefined' && startMenu) {
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
        allProgramsMenuItem.addEventListener('mouseenter', () => {
            if (hideSubmenuTimer) {
                clearTimeout(hideSubmenuTimer);
                hideSubmenuTimer = null;
            }
            // Populate on hover is fine, or could be done once when start menu opens
            // populateAllProgramsSubmenu(); // Already called when start menu opens
            allProgramsSubmenu.style.display = 'block';
            // CSS should handle positioning: left: 100%; top: -5px (relative to allProgramsMenuItem)
        });

        allProgramsMenuItem.addEventListener('mouseleave', () => {
            hideSubmenuTimer = setTimeout(() => {
                allProgramsSubmenu.style.display = 'none';
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
            }, 300);
        });
    }

}

function populateAllProgramsSubmenu() {
    if (!allProgramsSubmenu || !startMenu || !startMenu.contains(allProgramsSubmenu)) {
         // Ensure submenu is part of the current startMenu context if startMenu can change
        return;
    }
    allProgramsSubmenu.innerHTML = ''; // Clear existing items

    if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
        projectsData.forEach(program => {
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
                switch (program.type) {
                    case 'AI/ML Service': emoji = '🤖'; break;
                    case 'Web Service': emoji = '🌐'; break;
                    case 'Dev/Ops Tool': emoji = '🛠️'; break;
                }
                iconContent = `<span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">${emoji}</span>`;
            }
            link.innerHTML = iconContent + `<span class="menu-text">${program.name}</span>`;

            link.addEventListener('click', (e) => {
                e.preventDefault();
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
                // For items that have direct links and are not meant to open a window
                else if (program.link && program.link !== '#') {
                    // If it's an external link, it will open in a new tab due to target=_blank.
                    // If it's an internal path like /amica/, it will navigate.
                    // For this OS simulation, we might want all clicks to open windows or do nothing if no windowId.
                    // For now, if no specific window ID is mapped, let openWindow handle it (which shows an alert).
                    // If we want to prevent navigation for '#' links from here:
                    if (link.href.endsWith('#')) {
                         openWindow(windowIdToOpen, program.name);
                    } else {
                        // Let the browser handle the link if it's not just "#"
                        // This means items like OpenWebUI will open in a new tab.
                        // If we want them in a window, they need a specific windowId and iframe handling.
                        // For now, this is okay.
                    }
                } else {
                    openWindow(windowIdToOpen, program.name);
                }


                hideStartMenu(); // Hide entire start menu
            });

            listItem.appendChild(link);
            allProgramsSubmenu.appendChild(listItem);
        });
    } else {
        const noProgramsItem = document.createElement('li');
        noProgramsItem.textContent = '(비어 있음)';
        noProgramsItem.style.fontStyle = 'italic';
        noProgramsItem.style.padding = '8px 12px';
        allProgramsSubmenu.appendChild(noProgramsItem);
    }
}


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
