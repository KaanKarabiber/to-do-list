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
const dueDate = new Date(2025, 0, 10);
const dueDate2 = new Date(2024, 11, 31);
const dueDate3 = new Date(2023, 2, 29);
const dueDate4 = new Date(2024, 11, 29);
const formattedDate = format(dueDate, 'MMMM do yyyy');
const formattedDate2 = format(dueDate2, 'MMMM do yyyy');
const formattedDate3 = format(dueDate3, 'MMMM do yyyy');
const formattedDate4 = format(dueDate4, 'MMMM do yyyy');
export const defaultTask = new Task("Weather App", "make a weather app with javascript", formattedDate, "medium", "be quick", false);
export const defaultTask2 = new Task("Dunk a Basketball", "Use your hand to direct the ball through the rim.", formattedDate2, "high", "--", false);
export const defaultTask3 = new Task("Find a Job", "Find a job that pays money.", formattedDate3, "high", false);
export const defaultTask4 = new Task("Workout", "Use body", formattedDate, "low", "--", true);
