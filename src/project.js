import { defaultTask } from "./toDo";
import { openTaskModal } from "./modal";
import { parse, format } from "date-fns";

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
    listProjectsContent(content){
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }  
      this.projects.forEach(project =>{
        const projectDiv = document.createElement('div');
        const projectTitle = document.createElement('p');
        const taskCount = document.createElement('p');

        const deleteButton = this.contentDeleteBtn(project);
        
        const addTaskButton = document.createElement('button');
        addTaskButton.textContent = "add";
        addTaskButton.addEventListener('click', () => openTaskModal(project))
        
        projectTitle.textContent = project.title;
        taskCount.textContent = project.getTasks() + " tasks"
        projectDiv.append(projectTitle, taskCount, deleteButton, addTaskButton);
        
        project.tasks.forEach(task => {
          const taskDiv = document.createElement('div');
          const taskTitle = document.createElement('p');
          taskTitle.textContent = task.title;

          const taskDueDate = document.createElement('p');
          taskDueDate.textContent = task.dueDate;

          const taskExpandButton = document.createElement('button');
          taskExpandButton.textContent = "expand task";
          
          const taskDetails = document.createElement('div');
          taskDetails.style.display = 'none';

          taskDetails.textContent = 
            `Title: ${task.title}, ` +
            `Description: ${task.description}, ` +
            `Due Date: ${task.dueDate}, ` +
            `Priority: ${task.priority}, ` +
            `Notes: ${task.notes}, ` +
            `Completed: ${task.check ? "Yes" : "No"}`;
        
          taskDetails.classList.add('task-details');
          const editTask = document.createElement('button');
          editTask.textContent = "edit task";
          editTask.addEventListener("click", () => {
            openTaskModal(project, task); 
          });
    
          taskExpandButton.addEventListener('click', () => {
            if (taskDetails.style.display === 'none') {
              taskDetails.style.display = 'block';
              taskExpandButton.textContent = "collapse";
            } 
            else {
              taskDetails.style.display = 'none';
              taskExpandButton.textContent = "expand";
            }
          });
          taskExpandButton.textContent = "expand";

          const deleteTaskButton = document.createElement('button');
          deleteTaskButton.textContent = "delete task";
          deleteTaskButton.addEventListener('click', () => {
            project.removeTask(task);
            this.listProjectsContent(content);
          });
          taskDetails.append(editTask);
          taskDiv.append(taskTitle, taskDueDate, deleteTaskButton, taskExpandButton, taskDetails);  
          projectDiv.append(taskDiv);
        });
        content.append(projectDiv);
        
      });
    }
    
}


