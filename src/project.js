import { defaultTask } from "./toDo";
import {projects} from "./index.js";

class Project{
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


const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const modal = document.getElementById('formModal');
const overlay = document.querySelector('.modal-overlay');
const modalForm = document.getElementById('modalForm');

function openModal() {
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

modalForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from sending data to the backend

    const formData = new FormData(modalForm);
    const data = Object.fromEntries(formData);
    const project = new Project(data.title);
    projects.addProject(project);
    
    closeModal();
});

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal); // Close modal when clicking outside
