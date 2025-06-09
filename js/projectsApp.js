// Assumes this script is loaded after DOM is ready (e.g. via defer)

// --- Project Data ---
// This data needs to be accessible by the renderProjects function,
// and renderProjects is called by openWindow in windowManager.js
// Making projectsData global for simplicity in this refactoring phase.
// A more advanced setup might use modules or a shared application state.
const projectsData = [
    // AI/ML 서비스
    { name: 'OpenWebUI', description: 'Ollama용 웹 인터페이스', link: 'http://itsmyzone.iptime.org:3000/', type: 'AI/ML Service', status: 'Docker' },
    { name: 'Amica AI', description: '3D AI 가상 비서 (내부용)', link: '/amica/', type: 'AI/ML Service', status: 'Active' },
    { name: 'Translation Service', description: 'AI 기반 다중 엔진 번역', link: '/translation/', type: 'AI/ML Service', status: 'Active' },
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

    // 개발/운영 도구
    { name: 'Ollama', description: '로컬 LLM 서버 (Docker)', link: '#', type: 'Dev/Ops Tool', status: 'Docker' },
    { name: 'YouTube Tools', description: '유튜브 관련 도구', link: '#', type: 'Dev/Ops Tool', status: 'Active' },
    { name: 'GPU 모니터링', description: '실시간 GPU 사용률 및 메모리 관리', link: '#', type: 'Dev/Ops Tool', status: 'Active' },
    { name: '서비스 관리', description: 'systemd 서비스 상태 모니터링', link: '#', type: 'Dev/Ops Tool', status: 'Active' },
    { name: 'Docker 관리', description: '컨테이너 상태 및 리소스 관리', link: '#', type: 'Dev/Ops Tool', status: 'Docker' },
    { name: '성능 모니터링', description: 'CPU, 메모리, 디스크 사용률', link: '#', type: 'Dev/Ops Tool', status: 'Active' }
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

    // TODO: To use custom image icons for projects, modify the section below.
    // You could add an 'iconUrl' property to each project in projectsData,
    // and then instead of setting textContent, create an <img> element:
    // if (project.iconUrl) {
    //   const img = document.createElement('img');
    //   img.src = project.iconUrl;
    //   img.alt = project.name;
    //   img.style.width = '32px'; // Or some consistent size
    //   img.style.height = '32px';
    //   iconImage.appendChild(img); // Assuming iconImage is a container
    // } else {
    //   // Fallback to emoji or default
    //   iconImage.textContent = '📁';
    // }

    projects.forEach(project => {
        const projectLink = document.createElement('a');
        projectLink.className = 'project-icon-item';
        projectLink.href = project.link;
        if (project.link !== '#') { // Open external links in new tab
            projectLink.target = '_blank';
        }
        // Tooltip for more info
        projectLink.title = `${project.name} - ${project.description}\nType: ${project.type}\nStatus: ${project.status}`;

        const iconImage = document.createElement('div');
        iconImage.className = 'project-icon-image';

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
