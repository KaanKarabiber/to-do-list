import { ProjectManager, defaultProject } from './project';
import './styles.css'; 


export const projects = new ProjectManager()
projects.addProject(defaultProject);
console.log(projects.listProjects());
