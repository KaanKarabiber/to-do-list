import { defaultTask } from "./toDo";

export class Project{
    constructor (title, tasks = []){
        this.title = title;
        this.tasks = tasks;
    }
}
export const defaultProject = new Project("default project", [defaultTask]);

export class ProjectManager {
    constructor() {
      this.projects = [];
    }
  
    addProject(project) {
      this.projects.push(project);
    }
  
    findProject(title) {
      return this.projects.find(project => project.title === title);
    }
  
    removeProject(title) {
      this.projects = this.projects.filter(project => project.title !== title);
    }

    listProjects() {
      return this.projects;
    }
}


