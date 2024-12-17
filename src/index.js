import { ProjectManager, defaultProject } from './project';
import './styles.css';
import './modal.js' 


export const projects = new ProjectManager()
projects.addProject(defaultProject);
projects.listProjectsDom(document.querySelector("#projects-menu"));
