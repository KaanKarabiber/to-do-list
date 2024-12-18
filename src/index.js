import { ProjectManager, defaultProject } from './project';
import './styles.css';
import './modal.js' 

const content = document.querySelector("#content");
export const projects = new ProjectManager()
projects.addProject(defaultProject);
projects.listProjectsSidebar(document.querySelector("#projects-menu"));
projects.listProjectsContent(content);


const sidebarProjectBtn = document.querySelector("#side-bar-projects");
sidebarProjectBtn.addEventListener('click', () => projects.listProjectsContent(content));