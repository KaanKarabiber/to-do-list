import { defaultTask } from "./toDo";
import { openTaskModal } from "./modal";
import { Task } from "./toDo";
import { parse, format, differenceInCalendarDays, parseISO } from "date-fns";
import deleteIcon from './assets/delete.svg';
import expandDown from './assets/arrow-expand-down.svg';
import expandUp from './assets/arrow-expand-up.svg';
import addProjectIcon from './assets/add.svg';
import dueDateIcon from './assets/dueDate.svg';
import editTaskIcon from './assets/edit-task-icon.svg';

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
        project.tasks = projectData.tasks.map(taskData => {
          const task = new Task(
            taskData.title,
            taskData.description,
            taskData.dueDate,
            taskData.priority,
            taskData.notes,
            taskData.check
          );
          return task;
        });
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
          if (task.check) {
            taskTitle.style.textDecoration = 'line-through';
          } else {
            taskTitle.style.textDecoration = 'none';
          }
          
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
          const checkButton = document.createElement('button');
          const checkmark = document.createElement('span');
          checkButton.classList.add('task-check-button');
          checkmark.classList.add('checkmark');
          checkButton.ariaChecked = task.check;
          checkButton.addEventListener('click', () => {
            const isChecked = checkButton.getAttribute("aria-checked") === "true";
            checkButton.setAttribute("aria-checked", !isChecked);
            task.check = !task.check;
            taskTitle.style.textDecoration = task.check ? 'line-through' : 'none';
            this.saveProjectsToStorage();
          });

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

          const titleDueDateDiv = document.createElement('div');
          titleDueDateDiv.classList.add('first-line-details');
          const taskDetailsTitle = document.createElement('p');
          const taskDetailsPriority = document.createElement('p');
          taskDetailsPriority.textContent = `Priority: ${task.priority}`
          taskDetailsTitle.textContent = `Title: ${task.title}`;
          const dueDateDiv = document.createElement('div');
          dueDateDiv.classList.add('due-date-div');
          const taskDetailsDueDate = document.createElement('p');
          taskDetailsDueDate.textContent = task.dueDate;
          const taskDetailsDueImg = document.createElement('img');
          taskDetailsDueImg.src = dueDateIcon;
          taskDetails.style.display = 'none';
          
          const taskDetailsDescriptionDiv = document.createElement('div');
          const taskDetailsDescription = document.createElement('p');
          taskDetailsDescription.textContent = `Description: ${task.description}`;

          const taskDetailsNotesDiv = document.createElement('div');
          const taskDetailsNotes = document.createElement('p');
          taskDetailsNotes.textContent = `Notes: ${task.notes}`;
          
          const taskDetailsSecondRow = document.createElement('div');
          taskDetailsSecondRow.classList.add('task-details-second-row');
        
          taskDetails.classList.add('task-details');
          const editTask = document.createElement('button');
          const editTaskImg = document.createElement('img');
          editTaskImg.src = editTaskIcon;
          editTask.addEventListener("click", () => {
            openTaskModal(project, task); 
          });
    
          taskExpandButton.addEventListener('click', () => {
            if (taskDetails.style.display === 'none') {
              taskDetails.style.display = 'flex';
              taskDetails.style.flexDirection = 'column';
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
         
          checkButton.append(checkmark);
          taskExpandButton.append(taskExpandButtonSvg);
          deleteTaskButton.append(deleteTaskButtonSvg);
          dueDateDiv.append(taskDetailsDueImg, taskDetailsDueDate);
          titleDueDateDiv.append(taskDetailsTitle, taskDetailsPriority, dueDateDiv);
          taskDetailsDescriptionDiv.append(taskDetailsDescription);
          taskDetailsNotesDiv.append(taskDetailsNotes);
          taskDetailsSecondRow.append(taskDetailsDescriptionDiv, taskDetailsNotesDiv);
          taskDetails.append(titleDueDateDiv, taskDetailsSecondRow, editTask);
          editTask.append(editTaskImg);
          taskActionsDiv.append(checkButton, taskExpandButton, deleteTaskButton, priorityDot);
          taskElementsDiv.append(taskTitle, taskDueDate, taskActionsDiv,)
          taskDiv.append(taskElementsDiv, taskDetails);  
          projectDiv.append(taskDiv);
        });
        content.append(projectDiv);
        
      });
    }
    
}


