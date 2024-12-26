import { projects } from "./index.js";
import { Project } from "./project.js";
import { Task } from "./toDo.js";
import { format, parseISO, parse } from 'date-fns';

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
        projects.listProjectsContent(document.querySelector("#content"));

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
let editingTask = null;

export function openTaskModal(project, task = null) {
    activeProject = project;
    editingTask = task; 
    modal.classList.add("active");
    overlay.classList.add("active");

    if (editingTask) {
        document.querySelector("#title").value = task.title || "";
        document.querySelector("#description").value = task.description || "";

        const dueDateInput = document.querySelector("#due-date");
        if (typeof task.dueDate === "string" && task.dueDate.trim()) {
            try {
                const parsedDate = parse(task.dueDate, "MMMM do yyyy", new Date());
                if (!isNaN(parsedDate)) { 
                    const localDate = new Date(parsedDate);
                    localDate.setHours(0, 0, 0, 0);
                    dueDateInput.value = localDate.toLocaleDateString("en-CA"); // "en-CA" gives YYYY-MM-DD format
                } 
                else {
                    dueDateInput.value = ""; 
                }
            } catch (error) {
                console.error("Failed to parse date:", error);
                dueDateInput.value = ""; 
            }
        } 
        else {
            console.error("Invalid or empty date string:", task.dueDate);
            dueDateInput.value = ""; 
        }
        if (task.priority) {
            const priorityElement = document.querySelector(`#priority-${task.priority.toLowerCase()}`);
            if (priorityElement) {
                priorityElement.checked = true;
            } 
            else {
                console.error("Invalid priority value:", task.priority);
            }
        }
        document.querySelector("#notes").value = task.notes || "";
    } 
    else {
        taskForm.reset(); 
    }
}

export function closeTaskModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

closeModalBtn.addEventListener('click', () => closeTaskModal());
overlay.addEventListener('click', () => closeTaskModal());

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskTitle = document.querySelector("#title").value;
    const taskDescription = document.querySelector("#description").value;
    const taskDueDate = document.querySelector("#due-date").value;
    const taskPriority = document.querySelector("input[name='priority']:checked").value;
    const taskNotes = document.querySelector("#notes").value;

    const formattedDueDate = format(parseISO(taskDueDate), "MMMM do yyyy");

    const project = projects.findProject(activeProject);
    if (!project) {
        console.error("Project not found");
        return;
    }

    if (editingTask) {
        // Update existing task
        editingTask.title = taskTitle;
        editingTask.description = taskDescription;
        editingTask.dueDate = formattedDueDate;
        editingTask.priority = taskPriority;
        editingTask.notes = taskNotes;
    } 
    else {
        // Create a new task
        const newTask = new Task(taskTitle, taskDescription, formattedDueDate, taskPriority, taskNotes, false);
        project.tasks.push(newTask);
    }
    projects.saveProjectsToStorage();
    projects.listProjectsContent(document.querySelector("#content"));
    closeTaskModal();
});

