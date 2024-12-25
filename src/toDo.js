import { format } from "date-fns";
export class Task{
    constructor(title, description, dueDate, priority, notes, check){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.check = check;
    }
}
const dueDate = new Date(2022, 9, 9);
const formattedDate = format(dueDate, 'MMMM do yyyy');
export const defaultTask = new Task("mambo", "mambocino", formattedDate, "High", "mambo time", true);
