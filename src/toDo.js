class Task{
    constructor(title, description, dueDate, priority, notes, check){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.check = check;
    }
}
export const defaultTask = new Task("mambo", "mambocino", "09.09.2022", "High", "mambo time", true);
