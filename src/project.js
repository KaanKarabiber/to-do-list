import { defaultTask } from "./toDo";
import { openTaskModal } from "./modal";
import { Task } from "./toDo";
import { parse, format, differenceInCalendarDays, parseISO } from "date-fns";
import deleteIcon from './assets/delete.svg';
import expandDown from './assets/arrow-expand-down.svg';
import expandUp from './assets/arrow-expand-up.svg';
import addProjectIcon from './assets/add.svg';
import dueDateIcon from './assets/dueDate.svg';

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
      this.projects = this.loadProjectsFromStorage() || [];
    }
  
    addProject(project) {
      this.projects.push(project);
      this.saveProjectsToStorage();
    }
  
    findProject(project) {
      return this.projects.find(p => p === project);
    }
  
    removeProject(project) {
      this.projects = this.projects.filter(p => p !== project);
      this.saveProjectsToStorage();
    }    

    listProjects() {
      return this.projects;
    }
    saveProjectsToStorage() {
      const projectsJSON = this.projects.map(project => ({
          title: project.title,
          tasks: project.tasks.map(task => ({
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              priority: task.priority,
              notes: task.notes,
              check: task.check
          }))
      }));
      localStorage.setItem("projects", JSON.stringify(projectsJSON));
    }
    loadProjectsFromStorage() {
      const projectsJSON = localStorage.getItem("projects");
      if (!projectsJSON) return null;

      return JSON.parse(projectsJSON).map(projectData => {
          const project = new Project(projectData.title);
          project.tasks = projectData.tasks.map(task => new Task(task.title, task.description, task.dueDate, task.priority, task.notes, task.check)
          );
          return project;
      });
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
      const deleteProjectBtnSvg = document.createElement('img');
      deleteProjectBtnSvg.src = deleteIcon;
      deleteProjectBtn.append(deleteProjectBtnSvg);
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
        projectDiv.classList.add('project-container');

        const projectTitle = document.createElement('h2');
        projectTitle.textContent = project.title;

        const taskCount = document.createElement('p');
        taskCount.textContent = project.getTasks() + " task(s)";

        const deleteButton = this.contentDeleteBtn(project);   

        const addTaskButton = document.createElement('button');
        const addTaskButtonImg = document.createElement('img');
        addTaskButtonImg.src = addProjectIcon;
        addTaskButton.addEventListener('click', () => openTaskModal(project));

        const projectActionDiv = document.createElement('div');
        projectActionDiv.classList.add('project-actions');
        
        const projectElementsDiv = document.createElement('div');
        projectElementsDiv.classList.add('project-elements-div');

        addTaskButton.append(addTaskButtonImg);
        projectActionDiv.append(taskCount, addTaskButton, deleteButton);
        projectElementsDiv.append(projectTitle, projectActionDiv)
        projectDiv.append(projectElementsDiv);
        
        project.tasks.forEach(task => {
          const taskDiv = document.createElement('div');
          taskDiv.classList.add('task-container');
          
          const taskTitle = document.createElement('h3');
          taskTitle.textContent = task.title;
          
          const taskDueDate = document.createElement('p');
          try {
            const currentDate = new Date();
            const cleanedDueDate = task.dueDate.replace(/(\d+)(st|nd|rd|th)/, "$1");
            const parsedDate = parse(cleanedDueDate, "MMMM d yyyy", new Date());
        
            if (isNaN(parsedDate)) {
                taskDueDate.textContent = "Invalid Due Date";
            } else {
                const daysRemaining = differenceInCalendarDays(parsedDate, currentDate);
                if (daysRemaining > 0){
                taskDueDate.textContent = `${daysRemaining} day(s) remaining!`;
                }
                else if(daysRemaining < 0){
                taskDueDate.textContent = `Overdue!`;
                }
                else taskDueDate.textContent = `Ends today.`;
                 
            }
          } 
          catch (error) {
            console.error("Failed to parse or format due date:", error);
            taskDueDate.textContent = "Invalid Due Date";
          }
          
          const taskExpandButton = document.createElement('button');
          const taskExpandButtonSvg = document.createElement('img');
          taskExpandButtonSvg.src = expandDown;
          
          const priorityDot = document.createElement('div');
          priorityDot.classList.add('priority-dot');
          if(task.priority === "low"){
            priorityDot.style.backgroundColor = "yellow";
          }
          else if(task.priority === "medium"){
            priorityDot.style.backgroundColor = "orange";
          }
          else{
            priorityDot.style.backgroundColor = "red";
          }

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
              taskExpandButtonSvg.src = expandUp; 
            } 
            else {
              taskDetails.style.display = 'none';
              taskExpandButtonSvg.src = expandDown;
            }
          });

          const deleteTaskButton = document.createElement('button');
          const deleteTaskButtonSvg = document.createElement('img');
          deleteTaskButtonSvg.src = deleteIcon;
          deleteTaskButton.addEventListener('click', () => {
            project.removeTask(task);
            this.listProjectsContent(content);
          });
          const taskActionsDiv = document.createElement('div');
          taskActionsDiv.classList.add('task-actions');
          const taskElementsDiv = document.createElement('div');
          taskElementsDiv.classList.add('task-elements-div');
          taskExpandButton.append(taskExpandButtonSvg);
          deleteTaskButton.append(deleteTaskButtonSvg);
          taskDetails.append(editTask);
          taskActionsDiv.append(taskExpandButton, deleteTaskButton, priorityDot);
          taskElementsDiv.append(taskTitle, taskDueDate, taskActionsDiv,)
          taskDiv.append(taskElementsDiv, taskDetails);  
          projectDiv.append(taskDiv);
        });
        content.append(projectDiv);
        
      });
    }
    
}


