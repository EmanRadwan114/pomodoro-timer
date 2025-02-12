import Task from "./task.js";
import Timer from "./timer.js";

export default class TasksContainer {
  #tasksContainer;

  constructor() {
    this.#tasksContainer = [];
  }

  saveAllTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.#tasksContainer));
  }

  getAllTasks() {
    if (localStorage.getItem("tasks")) {
      this.#tasksContainer = JSON.parse(localStorage.getItem("tasks"));
    }
    return this.#tasksContainer;
  }

  addTask(
    id,
    title,
    sessionNum,
    taskFullDate,
    taskDate,
    startTime,
    endTime,
    category,
    notes
  ) {
    const newTask = new Task(
      id,
      title,
      sessionNum,
      taskFullDate,
      taskDate,
      startTime,
      endTime,
      category,
      notes
    );
    this.#tasksContainer.push(newTask);
    this.saveAllTasks();
    return newTask;
  }

  retrieveTask(id) {
    return this.#tasksContainer.find((task) => task.id === +id);
  }

  completeTask(id) {
    this.#tasksContainer = this.getAllTasks();
    this.#tasksContainer = this.#tasksContainer.map((elem) => {
      if (elem.id === +id) {
        elem.isCompleted = !elem.isCompleted;
      }
      return elem;
    });
    this.saveAllTasks();
  }

  editTask(
    id,
    title,
    sessionNum,
    taskFullDate,
    taskDate,
    startTime,
    endTime,
    categ,
    icon,
    notes
  ) {
    let updatedTask = null;
    this.#tasksContainer = this.getAllTasks();

    this.#tasksContainer = this.#tasksContainer.map((elem) => {
      if (elem.id === +id) {
        elem.title = title;
        elem.sessionNumber = sessionNum;
        elem.taskFullDate = taskFullDate;
        elem.taskDate = taskDate;
        elem.startTime = startTime;
        elem.endTime = endTime;
        elem.category.category = categ;
        elem.category.icon = icon;
        elem.notes = notes;
        updatedTask = elem;
      }
      return elem;
    });
    this.saveAllTasks();
    return updatedTask;
  }

  deleteTask(id) {
    this.#tasksContainer = this.getAllTasks();
    this.#tasksContainer = this.#tasksContainer.filter((elem) => {
      return elem.id !== +id;
    });
    this.saveAllTasks();
  }

  searchTask(searchTerm) {
    this.#tasksContainer = this.getAllTasks();

    const searchedTasks = this.#tasksContainer.filter((elem) => {
      return elem.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return searchedTasks;
  }

  completeAllTasks() {
    this.#tasksContainer = this.getAllTasks();

    this.#tasksContainer = this.#tasksContainer.map((task) => {
      task.isCompleted = true;
      return task;
    });

    this.saveAllTasks();
  }
  deleteCompletedTasks() {
    this.#tasksContainer = this.getAllTasks();

    this.#tasksContainer = this.#tasksContainer.filter((task) => {
      return task.isCompleted == false;
    });

    this.saveAllTasks();
  }
  deleteAllTasks() {
    this.#tasksContainer = [];
    this.saveAllTasks();
  }

  updateCurrentSession(id) {
    this.#tasksContainer = this.getAllTasks();

    this.#tasksContainer = this.#tasksContainer.map((task) => {
      if (task.id === +id && task.currentSession < task.sessionNumber) {
        task.currentSession++;
      }
      return task;
    });

    this.saveAllTasks();
  }
}
