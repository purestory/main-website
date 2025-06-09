// Assumes this script is loaded after DOM is ready (e.g. via defer)

// --- Project Data ---
// This data needs to be accessible by the renderProjects function,
// and renderProjects is called by openWindow in windowManager.js
// Making projectsData global for simplicity in this refactoring phase.
// A more advanced setup might use modules or a shared application state.
const projectsData = [
    { name: 'OpenWebUI', description: 'Ollama용 웹 인터페이스', link: 'http://itsmyzone.iptime.org:3000/', type: 'AI/ML Service', status: 'Docker' },
    { name: 'Amica AI', description: '3D AI 가상 비서 (내부용)', link: '/amica/', type: 'AI/ML Service', status: 'Active' },
    { name: 'Explorer', description: '웹 기반 파일 탐색기', link: '/explorer/', type: 'Web Service', status: 'Active' },
    { name: 'N8N', description: '워크플로우 자동화', link: 'http://itsmyzone.iptime.org:5678/', type: 'Web Service', status: 'Docker' },
    { name: 'GPU Monitoring', description: '실시간 GPU 사용률 및 메모리 관리', link: '#', type: 'Dev/Ops Tool', status: 'Active' },
    { name: 'Ollama', description: '로컬 LLM 서버 (Docker)', link: '#', type: 'Dev/Ops Tool', status: 'Docker' }
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
        // Basic icon, could be enhanced later based on type
        iconImage.textContent = '📁'; // Default folder icon
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
