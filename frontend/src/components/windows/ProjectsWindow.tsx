import { projectsData, getProjectEmoji } from '../../data/projectsData'
import type { ProjectData } from '../../data/projectsData'

interface ProjectsWindowProps {
  onOpenProject?: (projectName: string, windowId: string) => void
}

const ProjectsWindow: React.FC<ProjectsWindowProps> = ({ onOpenProject }) => {
  const handleProjectClick = (project: ProjectData) => {
    if (project.windowId && onOpenProject) {
      onOpenProject(project.name, project.windowId)
    } else {
      // 윈도우 ID가 없으면 기존 방식으로 새 탭에서 열기
      if (project.link && project.link !== '#') {
        window.open(project.link, '_blank')
      }
    }
  }

  return (
    <div className="project-icons-container">
      {projectsData.map((project) => (
        <a
          key={project.name}
          className="project-icon-item"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handleProjectClick(project)
          }}
          title={`${project.name} - ${project.description}\n종류: ${project.type}\n상태: ${project.status}`}
        >
          <div className="project-icon-image">
            {project.iconUrl ? (
              <img 
                src={project.iconUrl} 
                alt={project.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              getProjectEmoji(project)
            )}
          </div>
          <span className="project-icon-label">{project.name}</span>
        </a>
      ))}
    </div>
  )
}

export default ProjectsWindow 