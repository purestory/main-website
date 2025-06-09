document.addEventListener('DOMContentLoaded', function() {
            const bootScreen = document.getElementById('boot-screen');
            const desktop = document.querySelector('.desktop');
            const bootMessageText = document.getElementById('bootMessageText');
            const bootProgressBar = document.getElementById('bootProgressBar');
            const bootProgressText = document.getElementById('bootProgressText');

            // --- Project Data ---
            const projectsData = [
                { name: 'OpenWebUI', description: 'Ollama용 웹 인터페이스', link: 'http://itsmyzone.iptime.org:3000/', type: 'AI/ML Service', status: 'Docker' },
                { name: 'Amica AI', description: '3D AI 가상 비서 (내부용)', link: '/amica/', type: 'AI/ML Service', status: 'Active' },
                { name: 'Explorer', description: '웹 기반 파일 탐색기', link: '/explorer/', type: 'Web Service', status: 'Active' },
                { name: 'N8N', description: '워크플로우 자동화', link: 'http://itsmyzone.iptime.org:5678/', type: 'Web Service', status: 'Docker' },
                { name: 'GPU Monitoring', description: '실시간 GPU 사용률 및 메모리 관리', link: '#', type: 'Dev/Ops Tool', status: 'Active' },
                { name: 'Ollama', description: '로컬 LLM 서버 (Docker)', link: '#', type: 'Dev/Ops Tool', status: 'Docker' }
            ];

            // --- Boot Sequence Logic ---
            const bootMessages = [
                "POST: System Check...",
                "Memory Test: 16384MB OK",
                "Initializing USB Controllers...",
                "AHCI Driver Loaded.",
                "Loading Kernel (core.sys)...",
                "Starting Windows Services...",
                "Welcome!"
            ];

            let currentMessageIndex = 0;
            const numMessages = bootMessages.length;
            // Aim for roughly 10 seconds total boot time.
            // Let last message "Welcome!" stay for a bit longer.
            const totalBootTime = 10000; // 10 seconds in ms
            const messageInterval = (totalBootTime - 2000) / (numMessages -1) ; // Time per message, last one gets 2s

            let bootStartTime;
            let progressUpdateIntervalId;

            function showNextBootMessage() {
                if (currentMessageIndex < numMessages) {
                    bootMessageText.textContent = bootMessages[currentMessageIndex];
                    currentMessageIndex++;
                    if (currentMessageIndex < numMessages) {
                       setTimeout(showNextBootMessage, messageInterval);
                    }
                }
            }

            function updateBootProgress() {
                const elapsedTime = Date.now() - bootStartTime;
                let progressPercent = Math.min(100, Math.floor((elapsedTime / totalBootTime) * 100));
                bootProgressText.textContent = `${progressPercent}%`;

                if (progressPercent >= 100) {
                    clearInterval(progressUpdateIntervalId);
                }
            }

            function startBootSequence() {
                bootStartTime = Date.now();
                // Set the CSS transition for the progress bar
                bootProgressBar.style.transition = `width ${totalBootTime / 1000}s linear`;
                // Trigger the progress bar animation
                requestAnimationFrame(() => { // Ensure display is updated before transition starts
                    bootProgressBar.style.width = '100%';
                });

                showNextBootMessage(); // Start displaying messages
                progressUpdateIntervalId = setInterval(updateBootProgress, 100); // Update percentage text

                // After total boot time, hide boot screen and show desktop
                setTimeout(() => {
                    clearInterval(progressUpdateIntervalId); // Ensure text update stops
                    bootProgressText.textContent = '100%'; // Final assurance
                    bootScreen.classList.add('hidden');
                    desktop.classList.add('visible');

                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                    }, 1000); // Matches CSS transition time for boot screen fade
                }, totalBootTime);
            }

            startBootSequence(); // Auto-start boot sequence on DOMContentLoaded

            // --- Windowing Logic ---
            const projectsIcon = document.getElementById('icon-projects');
            const minesweeperIcon = document.getElementById('icon-minesweeper');
            const paintIcon = document.getElementById('icon-paint');
            const calculatorIcon = document.getElementById('icon-calculator');

            const projectsWindow = document.getElementById('projects-window');
            const projectsWindowBody = projectsWindow.querySelector('.window-body');
            const projectsWindowCloseButton = projectsWindow.querySelector('.window-close-button');
            // const projectsWindowTitle = projectsWindow.querySelector('.window-title'); // Not strictly needed if openWindow handles it

            // Function to open a generic window (can be expanded later)
            function openWindow(windowId, title) {
                const windowElement = document.getElementById(windowId);
                if (!windowElement) {
                    alert(`${title} app not implemented yet.`);
                    console.error(`Window element with ID ${windowId} not found.`);
                    return;
                }

                const windowTitleElement = windowElement.querySelector('.window-title');
                if (windowTitleElement) {
                    windowTitleElement.textContent = title;
                }

                // Default positioning, can be customized per window
                windowElement.style.top = Math.random() * 100 + 50 + 'px'; // Random-ish position
                windowElement.style.left = Math.random() * 200 + 50 + 'px';

                windowElement.style.display = 'block';
                // Ensure display:block is processed before adding .active for transition
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => { // Double RAF for good measure in some browsers
                        windowElement.classList.add('active');
                    });
                });

                // Specific content rendering if needed
                if (windowId === 'projects-window') {
                    renderProjects(projectsWindowBody, projectsData);
                }
            }


            function renderProjects(targetElement, projects) {
                targetElement.innerHTML = ''; // Clear previous content

                // Group projects by type
                const groupedProjects = projects.reduce((acc, project) => {
                    acc[project.type] = acc[project.type] || [];
                    acc[project.type].push(project);
                    return acc;
                }, {});

                for (const type in groupedProjects) {
                    const categoryHeader = document.createElement('h3');
                    categoryHeader.className = 'project-category-header';
                    categoryHeader.textContent = type;
                    targetElement.appendChild(categoryHeader);

                    groupedProjects[type].forEach(project => {
                        const itemLink = document.createElement('a');
                        itemLink.className = 'project-item';
                        itemLink.href = project.link;
                        if (project.link !== '#') { // Open external links in new tab
                            itemLink.target = '_blank';
                        }

                        const nameDiv = document.createElement('div');
                        nameDiv.className = 'project-name';
                        nameDiv.textContent = project.name;
                        itemLink.appendChild(nameDiv);

                        const descDiv = document.createElement('div');
                        descDiv.className = 'project-description';
                        descDiv.textContent = project.description;
                        itemLink.appendChild(descDiv);

                        if (project.status) {
                            const statusSpan = document.createElement('span');
                            statusSpan.className = 'project-status';
                            statusSpan.textContent = project.status;
                            // Add specific status class, e.g., status-docker, status-active
                            statusSpan.classList.add(`status-${project.status.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
                            itemLink.appendChild(statusSpan);
                        }
                        targetElement.appendChild(itemLink);
                    });
                }
            }

            projectsIcon.addEventListener('click', () => {
                openWindow('projects-window', 'Projects Explorer');
            });

            minesweeperIcon.addEventListener('click', () => {
                openWindow('minesweeper-app', 'Minesweeper');
            });
            paintIcon.addEventListener('click', () => {
                openWindow('paint-app', 'Paint');
            });
            calculatorIcon.addEventListener('click', () => {
                openWindow('calculator-app', 'Calculator');
            });

            // Assuming all windows will follow the same close button pattern.
            // If different windows need different close logic, this would need to be more specific.
            // For now, this targets the projects window's close button.
            // If other windows are added as HTML, their close buttons would need similar event listeners.
            if (projectsWindowCloseButton) { // Check if it exists, useful if projects-window is the only one for now
                projectsWindowCloseButton.addEventListener('click', () => {
                    const windowToClose = projectsWindowCloseButton.closest('.window');
                    if (windowToClose) {
                        windowToClose.classList.remove('active');
                        setTimeout(() => {
                            windowToClose.style.display = 'none';
                        }, 200); // Match CSS transition duration
                    }
                });
            }


            // --- Start Menu Logic ---
            const startButton = document.querySelector('.start-button');
            const startMenu = document.getElementById('start-menu');
            const startMenuItems = startMenu.querySelectorAll('li');

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
                setTimeout(() => {
                    startMenu.style.display = 'none';
                }, 150); // Match CSS transition duration
            }

            startButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from immediately closing menu
                if (startMenu.classList.contains('active')) {
                    hideStartMenu();
                } else {
                    showStartMenu();
                }
            });

            document.addEventListener('click', (event) => {
                if (startMenu.classList.contains('active') && !startMenu.contains(event.target) && event.target !== startButton) {
                    hideStartMenu();
                }
            });

            startMenuItems.forEach(item => {
                item.addEventListener('click', () => {
                    const windowIdToOpen = item.getAttribute('data-opens');
                    hideStartMenu();

                    if (windowIdToOpen === 'projects-window') {
                        openWindow('projects-window', 'Projects Explorer');
                    } else if (windowIdToOpen) {
                         // For other apps, use the generic openWindow or specific logic
                        const appName = item.textContent.trim().split(' ').slice(1).join(' '); // Get app name from text
                        openWindow(windowIdToOpen, appName || "Application");
                    }
                });
            });

            // --- Taskbar Clock Logic ---
            const taskbarClock = document.getElementById('taskbar-clock');

            function updateClock() {
                const now = new Date();
                let hours = now.getHours();
                const minutes = now.getMinutes().toString().padStart(2, '0');
                // const seconds = now.getSeconds().toString().padStart(2, '0'); // Optional: include seconds
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                // taskbarClock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
                taskbarClock.textContent = `${hours}:${minutes} ${ampm}`;
            }

            updateClock(); // Initial call
            setInterval(updateClock, 1000); // Update every second

        });

        /* Commenting out old script
        window.addEventListener('load', function() {
            // 서비스 카드 애니메이션
            const serviceCards = document.querySelectorAll('.service-category');
            serviceCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        });
        */
