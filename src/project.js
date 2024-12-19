import { defaultTask } from "./toDo";
import { openTaskModal } from "./modal";

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
    contentExtendBtn(projectDetails){
      const expandButton = document.createElement('button');
      
      expandButton.addEventListener('click', () => {
        if (projectDetails.style.display === 'none') {
          projectDetails.style.display = 'block';
          expandButton.textContent = "collapse";
        } 
        else {
          projectDetails.style.display = 'none';
          expandButton.textContent = "expand";
        }
      });
      expandButton.textContent = "expand";
      return expandButton
    }
    contentDeleteBtn(projectTitle){
      const deleteProjectBtn = document.createElement('button');
      deleteProjectBtn.textContent = "delete";
      deleteProjectBtn.addEventListener('click', () => {
        this.removeProject(projectTitle); 
        this.listProjectsSidebar(document.querySelector("#projects-menu"));
        if(document.querySelector("#page-title").textContent === "Projects"){
          this.listProjectsContent(content); 
        }
      });
      return deleteProjectBtn 
    }
    contentProjectDetails(project){
      const projectDetails = document.createElement('div');
      projectDetails.style.display = 'none';
      const updateDetails = () => {
        projectDetails.textContent = project.tasks.map(task =>
            `Title: ${task.title}, ` +
            `Description: ${task.description}, ` +
            `Due Date: ${task.dueDate}, ` +
            `Priority: ${task.priority}, ` +
            `Notes: ${task.notes}, ` +
            `Completed: ${task.check ? "Yes" : "No"}`
        ).join('\n') || "No tasks";
      };
      updateDetails();
      projectDetails.classList.add('project-details');
      return projectDetails
    }
    listProjectsContent(content){
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }  
      this.projects.forEach(project =>{
        const projectDiv = document.createElement('div');
        const projectTitle = document.createElement('p');
        const projectDetails = this.contentProjectDetails(project);
        const expandButton = this.contentExtendBtn(projectDetails);
        const deleteButton = this.contentDeleteBtn(project.title);
        
        const addTaskButton = document.createElement('button');
        addTaskButton.textContent = "add";
        addTaskButton.addEventListener('click', () => openTaskModal(project.title))
        
        projectTitle.textContent = project.title;
        projectDiv.append(projectTitle, expandButton, deleteButton, addTaskButton, projectDetails);
        content.append(projectDiv);
        
      });
    }
    
}


