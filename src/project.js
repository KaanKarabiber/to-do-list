import { defaultTask } from "./toDo";
import { openTaskModal } from "./modal";

export class Project{
    constructor (title, tasks = []){
        this.title = title;
        this.tasks = tasks;
    }
    getTasks(){
      return this.tasks.length;
    }
    removeTask(task){
      this.tasks = this.tasks.filter(t => t !== task);
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
  
    findProject(project) {
      return this.projects.find(p => p === project);
    }
  
    removeProject(project) {
      this.projects = this.projects.filter(p => p !== project);
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
    contentExpandBtn(projectDetails){
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
    contentDeleteBtn(project){
      const deleteProjectBtn = document.createElement('button');
      deleteProjectBtn.textContent = "delete";
      deleteProjectBtn.addEventListener('click', () => {
        this.removeProject(project); 
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
      projectDetails.textContent = project.tasks.map(task =>
        `Title: ${task.title}, ` +
         `Description: ${task.description}, ` +
         `Due Date: ${task.dueDate}, ` +
         `Priority: ${task.priority}, ` +
         `Notes: ${task.notes}, ` +
         `Completed: ${task.check ? "Yes" : "No"}`
      ).join('\n') || "No tasks";

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
        const taskCount = document.createElement('p');
        const projectDetails = this.contentProjectDetails(project);
        const expandButton = this.contentExpandBtn(projectDetails);
        const deleteButton = this.contentDeleteBtn(project);
        
        const addTaskButton = document.createElement('button');
        addTaskButton.textContent = "add";
        addTaskButton.addEventListener('click', () => openTaskModal(project))
        
        projectTitle.textContent = project.title;
        taskCount.textContent = project.getTasks() + " tasks"
        projectDiv.append(projectTitle, taskCount, expandButton, deleteButton, addTaskButton, projectDetails);
        
        project.tasks.forEach(task => {
          const taskDiv = document.createElement('div');
          const taskTitle = document.createElement('p');
          taskTitle.textContent = task.title;

          const taskDueDate = document.createElement('p');
          taskDueDate.textContent = task.dueDate;

          const taskExpandButton = document.createElement('button');
          taskExpandButton.textContent = "expand task";
          taskExpandButton.addEventListener('click', () =>{
            const mambo = this.contentProjectDetails(project);
          })

          const deleteTaskButton = document.createElement('button');
          deleteTaskButton.textContent = "delete task";
          deleteTaskButton.addEventListener('click', () => {
            project.removeTask(task);
            this.listProjectsContent(content);
          });
          
          taskDiv.append(taskTitle, taskDueDate, deleteTaskButton, taskExpandButton);  
          projectDiv.append(taskDiv);
        });
        content.append(projectDiv);
        
      });
    }
    
}


