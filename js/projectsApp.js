// Assumes this script is loaded after DOM is ready (e.g. via defer)

// --- Project Data ---
// This data needs to be accessible by the renderProjects function,
// and renderProjects is called by openWindow in windowManager.js
// Making projectsData global for simplicity in this refactoring phase.
// A more advanced setup might use modules or a shared application state.
const projectsData = [
    // AI/ML 서비스
    { name: 'OpenWebUI', description: 'Ollama용 웹 인터페이스', link: 'http://itsmyzone.iptime.org:3000/', type: 'AI/ML Service', status: 'Docker' },
    { name: 'Amica AI', description: '3D AI 가상 비서 (내부용)', link: '/amica/', type: 'AI/ML Service', status: 'Active', iconUrl: 'https://cdn-icons-png.freepik.com/256/15675/15675914.png?ga=GA1.1.1145714982.1749450368&semt=ais_incoming' },
    { name: 'Translation Service', description: 'AI 기반 다중 엔진 번역', link: '/translation/', type: 'AI/ML Service', status: 'Active', iconUrl: 'https://cdn-icons-png.freepik.com/256/4803/4803094.png?ga=GA1.1.1145714982.1749450368&semt=ais_incoming' },
    { name: 'Whisper STT', description: '고속 음성-텍스트 변환 (100+ 언어)', link: '/whisper/', type: 'AI/ML Service', status: 'Active' },
    { name: 'EdgeTTS', description: 'Microsoft Edge 고품질 TTS', link: '/edgetts/', type: 'AI/ML Service', status: 'Active' },
    { name: 'Zonos TTS', description: '고품질 텍스트-음성 변환 (200k시간 학습)', link: '/zonos/', type: 'AI/ML Service', status: 'Active' },
    { name: 'Kokoro FastAPI', description: '다국어 TTS 서비스', link: 'http://itsmyzone.iptime.org:3200/web/', type: 'AI/ML Service', status: 'Docker' },

    // 웹 서비스
    { name: 'Explorer', description: '웹 기반 파일 탐색기', link: '/explorer/', type: 'Web Service', status: 'Active' },
    { name: 'N8N', description: '워크플로우 자동화', link: 'http://itsmyzone.iptime.org:5678/', type: 'Web Service', status: 'Docker' },
    { name: 'Tribler', description: 'P2P 파일 공유', link: '/tribler/', type: 'Web Service', status: 'Docker' },
    { name: 'Cobalt', description: '소셜 미디어 다운로더', link: '/cobalt/', type: 'Web Service', status: 'Active' },
    { name: 'WebTools', description: '이미지 변환 도구', link: '/webtools/', type: 'Web Service', status: 'Active' },

    // 개발/운영 도구 - 제거됨
];

// --- Project Rendering Logic ---
// This function will be called by openWindow in windowManager.js
function renderProjects(targetElement, projects) { // Note: projectsData is passed as 'projects' argument
    if (!targetElement) {
        console.error("Target element for rendering projects not found.");
        return;
    }
    targetElement.innerHTML = ''; // Clear previous content

    const iconContainer = document.createElement('div');
    iconContainer.className = 'project-icons-container';

    /*
      Comment regarding custom image icons:
      To use custom image icons for projects, you can extend this section.
      Ensure each project object in `projectsData` has an `iconUrl` property
      if you want to use a specific image. The code below now checks for `project.iconUrl`.
      CSS for `.project-icon-image img` might be needed to control image size, e.g.:
      .project-icon-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
      The current .project-icon-image CSS sets a font-size for emojis, so if using mixed
      image and emoji, ensure that font-size doesn't negatively impact image display,
      or create a separate class/container for images if they need different sizing rules
      than the emoji textContent. For now, the image will be a child of .project-icon-image.
    */

    projects.forEach(project => {
        const projectLink = document.createElement('a');
        projectLink.className = 'project-icon-item';
        projectLink.href = project.link;
        if (project.link !== '#') { // Open external links in new tab
            projectLink.target = '_blank';
        }
        // Tooltip for more info
        projectLink.title = `${project.name} - ${project.description}\n종류: ${project.type}\n상태: ${project.status}`;

        const iconImage = document.createElement('div');
        iconImage.className = 'project-icon-image';

        if (project.iconUrl) {
            const img = document.createElement('img');
            img.src = project.iconUrl;
            img.alt = project.name; // Alt text for accessibility
            iconImage.innerHTML = ''; // Clear any previous content (e.g., emoji)
            iconImage.appendChild(img);
        } else {
            // Fallback to emoji if iconUrl is not provided
            iconImage.innerHTML = ''; // Clear any potential previous img for safety before setting textContent
            switch (project.type) {
                case 'AI/ML Service':
                    iconImage.textContent = '🤖'; // Robot for AI/ML
                    break;
                case 'Web Service':
                    iconImage.textContent = '🌐'; // Globe for Web
                    break;
                case 'Dev/Ops Tool':
                    iconImage.textContent = '🛠️'; // Hammer and wrench for Dev/Ops
                    break;
                default:
                    iconImage.textContent = '📁'; // Default folder
            }
        }
        projectLink.appendChild(iconImage);

        const iconLabel = document.createElement('span');
        iconLabel.className = 'project-icon-label';
        iconLabel.textContent = project.name; // Display only name for brevity in icon view
        projectLink.appendChild(iconLabel);

        iconContainer.appendChild(projectLink);
    });
    targetElement.appendChild(iconContainer);
}

// Example of how openWindow expects projectsWindowBody:
// const projectsWindowBody = document.getElementById('projects-window')?.querySelector('.window-body');
// This selector is not strictly needed here if openWindow handles passing the correct targetElement.
// However, if renderProjects were to be called independently, it might need its own selector.
// For now, it's designed to be called by openWindow.
