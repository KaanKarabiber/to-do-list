import { projects } from "./index.js";
import { Project } from "./project.js";
import { Task } from "./toDo.js";

// project modal

const projectForm = document.querySelector('#project-form');
const projectTitleInput = document.querySelector('#project-title');

projectForm.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        event.preventDefault();
        const inputValue = document.querySelector('#project-title').value; 
        const project = new Project(inputValue);
        projects.addProject(project);
        projects.listProjectsSidebar(document.querySelector("#projects-menu"));
        document.querySelector('#project-title').value = "";
        if(document.querySelector('#page-title').textContent === "Projects"){ // update content if the title is Projects
            projects.listProjectsContent(document.querySelector("#content"));
        }
    }
});

projectTitleInput.addEventListener('focus', () =>  {
   projectTitleInput.placeholder = "Type Your Project Title";
});

projectTitleInput.addEventListener('blur', () => {
    projectTitleInput.placeholder = "Create Project";
});

// task modal

const closeModalBtn = document.querySelector('#close-modal');
const overlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const taskForm = document.querySelector('#task-form'); 
let activeProject = null;

export function openTaskModal(project) {
    activeProject = project;
    modal.classList.add('active');
    overlay.classList.add('active');
}

export function closeTaskModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

closeModalBtn.addEventListener('click', () => closeTaskModal());
overlay.addEventListener('click', () => closeTaskModal());

taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const taskTitle = document.querySelector('#title').value;
    const taskDescription = document.querySelector('#description').value;
    const taskDueDate = document.querySelector('#due-date').value;
    const taskPriority = document.querySelector('input[name="priority"]:checked').value; 
    const taskNotes = document.querySelector('#notes').value;

    const newTask = new Task(taskTitle, taskDescription, taskDueDate, taskPriority, taskNotes, false);
    const project = projects.findProject(activeProject);
    if(project){
        project.tasks.push(newTask);
        if(document.querySelector("#page-title").textContent === "Projects"){
            projects.listProjectsContent(document.querySelector("#content"));
          }
    }
    else{
        console.error("project not found");
    }

    closeTaskModal();
    taskForm.reset();
});

