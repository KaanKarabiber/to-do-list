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
    listProjectsSidebar(sidebar){
      while (sidebar.childNodes.length > 2) { // remove all elements except first 2 in sidebar
        sidebar.removeChild(sidebar.childNodes[2]);
      }  
      const projectList = document.createElement("ul"); 
      this.projects.forEach(project => {
        const button = document.createElement('button');
        const projectElement = document.createElement('li');
        button.textContent = project.title;
        button.classList.add('project-button');
        button.addEventListener('click', () => {
          console.log(`Project clicked: ${project.title}`);
        });
        projectElement.append(button);
        projectList.append(projectElement)
        sidebar.append(projectList);
      });
    }
    listProjectsContent(content){
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }  
      this.projects.forEach(project =>{
        const projectDiv = document.createElement('div');
        const projectTitle = document.createElement('p');
        const expandButton = document.createElement('button');
        
        const deleteProjectBtn = document.createElement('button');
        deleteProjectBtn.textContent = "delete";
        deleteProjectBtn.addEventListener('click', () => {
          this.removeProject(project.title);
          this.listProjectsSidebar(document.querySelector("#projects-menu"));
          if(document.querySelector("#page-title").textContent === "Projects"){
            this.listProjectsContent(content); 
          }
        });

        expandButton.textContent = "expand";
        projectTitle.textContent = project.title;
        projectDiv.append(projectTitle, expandButton, deleteProjectBtn);
        content.append(projectDiv);
        
      });
    }
    
}


