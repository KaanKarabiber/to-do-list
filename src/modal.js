import { projects } from "./index.js";
import { Project } from "./project.js";

// project modal

const projectForm = document.querySelector('#project-form');
const projectTitleInput = document.querySelector('#project-title');

projectForm.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        event.preventDefault();
        const inputValue = document.querySelector('#project-title').value; 
        const project = new Project(inputValue);
        projects.addProject(project);
        projects.listProjectsDom(document.querySelector("#projects-menu"));
        document.querySelector('#project-title').value = "";
    }
});

projectTitleInput.addEventListener('focus', () =>  {
   projectTitleInput.placeholder = "Type Your Project Title";
});

projectTitleInput.addEventListener('blur', () => {
    projectTitleInput.placeholder = "Create Project";
});

// task modal

const openModalBtn = document.querySelector('#open-task-modal');
const closeModalBtn = document.querySelector('#close-modal');
const overlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');

function openTaskModal() {
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeTaskModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

openModalBtn.addEventListener('click', () => openTaskModal());
closeModalBtn.addEventListener('click', () => closeTaskModal());
overlay.addEventListener('click', () => closeTaskModal());

