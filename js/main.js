"use strict";

// ^--------------------------import statements -------------------------
import Timer from "./timer.js";
import TasksContainer from "./allTasks.js";
import {
  chooseCategory,
  clearTaskDate,
  closeModal,
  createTaskBox,
  displayCelebrationMsg,
  displayCurrentDate,
  displayTaskInfo,
  displayTaskInfoForEdit,
  displayTasks,
  displayTimerData,
  displayUpdatedData,
  displayUserProgress,
  emptyTaskContainer,
  getTaskDate,
  isFormValidated,
  showAndHideTaskNotes,
  showModal,
  stopOtherWorkingTimer,
  switchBtns,
  switchTab,
  switchtoAddMode,
  switchtoEditMode,
  updateTimerData,
  validateForm,
} from "./utilitis.js";

// ^-------------------------------Tasks List---------------------------------
const taskListSection = document.querySelector("#tasks .tasks-container");
export const tasksContainer = document.getElementById("tasks-container");
export const startingTxt = document.querySelector(".start-txt");
const tasksNum = document.querySelector(".tasks-container h2 span");
const celebrateTxt = document.getElementById("celebrate-txt");
const completedTasks = document.querySelector("#progress .completed");
const totalTasks = document.querySelector("#progress .total");
const myTasks = new TasksContainer();
let tasksList = myTasks.getAllTasks();
const progressObj = {
  completedTasks,
  totalTasks,
  tasksNum,
  celebrateTxt,
};

// & 1- display all tasks
console.log(window.screen.width);

if (window.screen.width > 992) {
  taskListSection.style.height =
    parseInt(getComputedStyle(taskListSection.parentElement).height) -
    20 +
    "px";
  console.log(taskListSection.style.height);
} else {
}

displayTasks(tasksList.length, tasksList);

// & 2- show user progress
displayUserProgress(progressObj, tasksList);

// & 3- CRUD OPerations
const addTaskBtn = document.querySelector("#add-task .add-btn");
const addTaskModal = document.getElementById("add-task-modal");
export const validationTxt = document.getElementById("validation-txt");
export const titleField = document.getElementById("task-title");
export const categoryItems = document.querySelectorAll(".item");
export const sessionNum = document.querySelector(".session-nums .num p");
const plusBtn = document.querySelector(".session-nums .num .plus");
const minusBtn = document.querySelector(".session-nums .num .minus");
export const sessionTime = document.getElementById("session-time");
export const addNoteBtn = document.querySelector(".add-note button");
export const noteContent = document.getElementById("note-msg");
const addBtn = document.querySelector("#add-task-modal .add-btn");
const editBtn = document.querySelector("#add-task-modal .edit-btn");
const cancelTaskAddBtn = document.querySelector("#add-task-modal .cancel-btn");
const showTaskModal = document.getElementById("show-task-details");
const okBtn = document.querySelector("#show-task-details .close-modal-btn");
const deleteTaskModal = document.getElementById("delete-task-modal");
const confirmDeleteBtn = document.querySelector(
  "#delete-task-modal .delete-btn"
);
const cancelDeleteBtn = document.querySelector(
  "#delete-task-modal .cancel-btn"
);
const searchField = document.getElementById("search-field");
const completeAllTasksBtn = document.getElementById("complete-all-tasks");
const deleteCompletedTaskskBtn = document.getElementById(
  "delete-completed-tasks"
);
const deleteAllTasksBtn = document.getElementById("delete-all-tasks");

// *add new task
// ?open modal
addTaskBtn.addEventListener("click", (e) => {
  showModal(addTaskModal);
  switchtoAddMode(addBtn, editBtn);
});

// ? validating task form
validateForm();

// ?choose category
const chosenCategory = chooseCategory(categoryItems);

// ? update task's session number
let counter = 1;
plusBtn.addEventListener("click", (e) => {
  if (counter < 10) {
    counter++;
    sessionNum.innerText = counter;
  }
});
minusBtn.addEventListener("click", (e) => {
  if (counter > 1) {
    counter--;
    sessionNum.innerText = counter;
  }
});

// ? add task note
addNoteBtn.addEventListener("click", (e) => {
  showAndHideTaskNotes();
});

// ? set minimum data time
let now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
sessionTime.min = now.toISOString().slice(0, 16);

//? add task
addBtn.addEventListener("click", (e) => {
  if (isFormValidated) {
    const taskTime = getTaskDate();

    const newTask = myTasks.addTask(
      tasksList.length + 1,
      titleField.value,
      sessionNum.innerText,
      taskTime.taskFullDate,
      taskTime.taskDay,
      taskTime.startTime,
      taskTime.endTime,
      chosenCategory,
      noteContent.value
    );
    tasksList = myTasks.getAllTasks();
    createTaskBox(newTask);

    displayUserProgress(progressObj, tasksList);

    // ?reset data
    startingTxt.classList.add("d-none");
    startingTxt.classList.remove("d-flex");
    counter = 1;
    closeModal(addTaskModal);
    clearTaskDate();
  } else {
    validationTxt.classList.remove("d-none");
  }
});

// //* close task add modal
cancelTaskAddBtn.addEventListener("click", (e) => {
  closeModal(addTaskModal);
  clearTaskDate();
  counter = 1;
});

addTaskModal.addEventListener("click", (e) => {
  closeModal(addTaskModal);
  clearTaskDate();
  counter = 1;
});

addTaskModal.children[0].addEventListener("click", (e) => {
  e.stopPropagation();
});

// & 4- task features
let selectedTask = null;
tasksContainer.addEventListener("click", (e) => {
  if (e.target.closest(".box")) {
    selectedTask = myTasks.retrieveTask(
      e.target.closest(".box").id.split("-")[2]
    );

    // * display task info
    if (e.target.classList.contains("display-task-btn")) {
      selectedTask = myTasks.retrieveTask(
        e.target.getAttribute("data-identity")
      );
      showModal(showTaskModal);
      displayTaskInfo(myTasks, selectedTask.id);
    }
    //* complete task
    else if (
      e.target.classList.contains("complete-task-btn") ||
      e.target.classList.contains("uncomplete-task-btn")
    ) {
      selectedTask = myTasks.retrieveTask(
        e.target.getAttribute("data-identity")
      );
      myTasks.completeTask(selectedTask.id);

      selectedTask = myTasks.retrieveTask(selectedTask.id);
      tasksList = myTasks.getAllTasks();
      displayUserProgress(progressObj, tasksList);

      if (e.target.classList.contains("fa-solid")) {
        e.target.parentElement.classList.toggle("bg-color-secondary");
        e.target.closest(".box").querySelector("ul").children[1].innerText =
          selectedTask.isCompleted ? "Uncomplete Task" : "Complete Task";
      } else {
        e.target
          .closest(".box")
          .querySelector(".circle")
          .classList.toggle("bg-color-secondary");
        e.target.innerText = selectedTask.isCompleted
          ? "Uncomplete Task"
          : "Complete Task";
      }

      selectedTask.isCompleted
        ? e.target
            .closest(".box")
            .querySelector(".edit-task-btn")
            .classList.add("d-none")
        : e.target
            .closest(".box")
            .querySelector(".edit-task-btn")
            .classList.remove("d-none");
    }
    // *edit task
    else if (e.target.classList.contains("edit-task-btn")) {
      selectedTask = myTasks.retrieveTask(
        e.target.getAttribute("data-identity")
      );

      // ? show edit modal
      showModal(addTaskModal);
      switchtoEditMode(addBtn, editBtn);
      displayTaskInfoForEdit(selectedTask);
      counter = selectedTask.sessionNumber;
    }
    // *delete task
    else if (e.target.classList.contains("delete-task-btn")) {
      selectedTask = myTasks.retrieveTask(
        e.target.getAttribute("data-identity")
      );
      showModal(deleteTaskModal);
    }
  }
});

// ? close display task info modal
okBtn.addEventListener("click", (e) => {
  closeModal(showTaskModal);
});

showTaskModal.addEventListener("click", (e) => {
  closeModal(showTaskModal);
});

showTaskModal.children[0].addEventListener("click", (e) => {
  e.stopPropagation();
});

// ?edit & display updated data data
editBtn.addEventListener("click", (e) => {
  if (isFormValidated) {
    const taskTime = getTaskDate();
    const updatedTask = myTasks.editTask(
      selectedTask.id,
      titleField.value,
      sessionNum.innerText,
      taskTime.taskFullDate,
      taskTime.taskDay,
      taskTime.startTime,
      taskTime.endTime,
      chosenCategory.category,
      chosenCategory.icon,
      noteContent.value
    );
    tasksList = myTasks.getAllTasks();

    // ? display updated data
    displayUpdatedData(updatedTask);
    // ?reset data
    startingTxt.classList.add("d-none");
    startingTxt.classList.remove("d-flex");
    counter = 1;
    closeModal(addTaskModal);
    clearTaskDate();

    updateTimerData(updatedTask, tasksList.length);
  } else {
    validationTxt.classList.remove("d-none");
  }
});

// ? confirm deletion
confirmDeleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (deleteTaskModal.getAttribute("data-number") == "one") {
    myTasks.deleteTask(selectedTask.id);
    tasksList = myTasks.getAllTasks();
    emptyTaskContainer();
    displayTasks(tasksList.length, tasksList);
  } else if (deleteTaskModal.getAttribute("data-number") == "all") {
    myTasks.deleteAllTasks();
    tasksList = myTasks.getAllTasks();
    emptyTaskContainer();
    deleteTaskModal.setAttribute("data-number", "one");
  } else if (deleteTaskModal.getAttribute("data-number") == "completed") {
    myTasks.deleteCompletedTasks();
    tasksList = myTasks.getAllTasks();
    emptyTaskContainer();
    displayTasks(tasksList.length, tasksList);
    deleteTaskModal.setAttribute("data-number", "one");
  }
  displayUserProgress(progressObj, tasksList);
  closeModal(deleteTaskModal);
  selectedTask = null;
  updateTimerData(selectedTask, tasksList.length);
});

// *search for a task by title
searchField.addEventListener("input", (e) => {
  const foundTasks = myTasks.searchTask(searchField.value);
  emptyTaskContainer();
  displayTasks(foundTasks.length, foundTasks);

  if (!foundTasks.length && tasksList.length) {
    startingTxt.querySelector("p").innerText = "No Tasks Found 😔";
  } else {
    startingTxt.querySelector("p").innerHTML = `You have No Tasks <br/>
                    start adding a new one 😊`;
  }
});

// & complete & delete all tasks
completeAllTasksBtn.addEventListener("click", (e) => {
  myTasks.completeAllTasks();
  tasksList = myTasks.getAllTasks();
  emptyTaskContainer();
  displayTasks(tasksList.length, tasksList);
  // *update user progress
  displayUserProgress(progressObj, tasksList);
});

deleteCompletedTaskskBtn.addEventListener("click", (e) => {
  deleteTaskModal.setAttribute("data-number", "completed");
  showModal(deleteTaskModal);
});

deleteAllTasksBtn.addEventListener("click", (e) => {
  deleteTaskModal.setAttribute("data-number", "all");
  showModal(deleteTaskModal);
});

//? close delete task modal
cancelDeleteBtn.addEventListener("click", (e) => {
  closeModal(deleteTaskModal);
});

deleteTaskModal.addEventListener("click", (e) => {
  closeModal(deleteTaskModal);
});

deleteTaskModal.children[0].addEventListener("click", (e) => {
  e.stopPropagation();
});

// ^-------------------------------Link Tasks with timer---------------------------------
let currentSession = document.querySelector("#ongoing .current-session");
let totalSessions = document.querySelector("#ongoing .total-sessions");
export let sessionNumericals = document.querySelector("#ongoing .session-num");
let taskBoxes = document.getElementsByClassName("box");

tasksContainer.addEventListener("click", (e) => {
  if (e.target.closest(".box")) {
    const box = e.target.closest(".box");
    box.style.outline = "none";

    for (let i = 0; i < taskBoxes.length; i++) {
      taskBoxes[i].style.outline = "none";
    }

    selectedTask = myTasks.retrieveTask(box.id.split("-")[2]);
    box.style.outline = "2px solid rgba(0, 0, 0, 0.5)";
    updateTimerData(selectedTask, tasksList.length);
  }
});

// ^--------------------------display current date -------------------------
const dateContainer = document.querySelector(".current-date span");
dateContainer.innerText = displayCurrentDate();

// ^-----------------switch between ongoing timer & break timer tabs----------------
const ongoingTab = document.getElementById("ongoing-tab");
const breakTab = document.getElementById("break-tab");
const ongoingSection = document.getElementById("ongoing");
const breakSection = document.getElementById("break");

ongoingTab.addEventListener("click", function () {
  switchTab(this, breakTab, ongoingSection, breakSection);
});

breakTab.addEventListener("click", function () {
  switchTab(this, ongoingTab, breakSection, ongoingSection);
});

// ^-------------------------------timing controls ---------------------------------
const ongoingTimerMins = document.querySelector("#ongoing .count-down-time")
  .children[0];
const ongoingTimerSecs = document.querySelector("#ongoing .count-down-time")
  .children[1];
const breakTimerMins = document.querySelector("#break .count-down-time")
  .children[0];
const breakTimerSecs = document.querySelector("#break .count-down-time")
  .children[1];
const playOngoingBtn = document.querySelector("#ongoing .play-btn");
const stopOngoingBtn = document.querySelector("#ongoing .stop-btn");
const replayOngoingBtn = document.querySelector("#ongoing .re-play");
export const nextSessionBtn = document.querySelector("#ongoing .next-step");
const playBreakBtn = document.querySelector("#break .play-btn");
const stopBreakBtn = document.querySelector("#break .stop-btn");
const replayBreakBtn = document.querySelector("#break .re-play");
const ongoingRange = document.querySelector("#ongoing .range");
const breakRange = document.querySelector("#break .range");
export const celebrationMsg = document.querySelector("#celebration");
export const taskTitle = document.querySelector("#ongoing .task-info");
export const notificationSound = document.getElementById("notification-sound");
export const yaySound = document.getElementById("yay-sound");

let ongoingTimer = new Timer(24, 60);
let breakTimer = new Timer(4, 60);

// &start timers
playOngoingBtn.addEventListener("click", () => {
  //* stop break timer & switch its buttons
  stopOtherWorkingTimer(breakTimer, playBreakBtn, stopBreakBtn);

  ongoingTimer.startTimer(); //* start ongoing timer
  switchBtns(playOngoingBtn, stopOngoingBtn);

  //* update range & txt with timer
  displayTimerData(
    ongoingTimer,
    ongoingTimerMins,
    ongoingTimerSecs,
    ongoingRange,
    playOngoingBtn,
    stopOngoingBtn
  );
});

playBreakBtn.addEventListener("click", () => {
  //* stop ongoing timer & switch its buttons
  stopOtherWorkingTimer(ongoingTimer, playOngoingBtn, stopOngoingBtn);

  breakTimer.startTimer(); //* start break timer
  switchBtns(playBreakBtn, stopBreakBtn);

  //* update range & txt with timer
  displayTimerData(
    breakTimer,
    breakTimerMins,
    breakTimerSecs,
    breakRange,
    playBreakBtn,
    stopBreakBtn
  );
});

// &stop timers
stopOngoingBtn.addEventListener("click", () => {
  ongoingTimer.stopTimer();
  switchBtns(playOngoingBtn, stopOngoingBtn);
});

stopBreakBtn.addEventListener("click", () => {
  breakTimer.stopTimer();
  switchBtns(playBreakBtn, stopBreakBtn);
});

// &replay timers
replayOngoingBtn.addEventListener("click", () => {
  stopOtherWorkingTimer(breakTimer, playBreakBtn, stopBreakBtn); //* stop working break timer

  if (
    !ongoingTimer.getIsWorking() ||
    (ongoingTimer.getMins() == 0 && ongoingTimer.getSecs() == 0)
  ) {
    switchBtns(playOngoingBtn, stopOngoingBtn);
  }

  ongoingTimer.rePlayTimer();

  //* update range & txt with timer
  displayTimerData(
    ongoingTimer,
    ongoingTimerMins,
    ongoingTimerSecs,
    ongoingRange,
    playOngoingBtn,
    stopOngoingBtn
  );
});

replayBreakBtn.addEventListener("click", () => {
  stopOtherWorkingTimer(ongoingTimer, playOngoingBtn, stopOngoingBtn); //* stop working ongoing timer

  if (
    !breakTimer.getIsWorking() ||
    (breakTimer.getMins() == 0 && breakTimer.getSecs() == 0)
  ) {
    switchBtns(playBreakBtn, stopBreakBtn);
  }

  breakTimer.rePlayTimer();

  //* update range & txt with timer
  displayTimerData(
    breakTimer,
    breakTimerMins,
    breakTimerSecs,
    breakRange,
    playBreakBtn,
    stopBreakBtn
  );
});

// & move to next session in ongoing timer
updateTimerData(selectedTask, tasksList.length);
nextSessionBtn.addEventListener("click", () => {
  //* stop timer of previous session
  stopOtherWorkingTimer(ongoingTimer, playOngoingBtn, stopOngoingBtn);
  stopOtherWorkingTimer(breakTimer, playBreakBtn, stopBreakBtn);

  //*set new timer
  ongoingTimer.moveToNextSession();
  ongoingTimerMins.innerText = "25";
  ongoingTimerSecs.innerText = "00";

  // *update session
  myTasks.updateCurrentSession(selectedTask.id);
  selectedTask = myTasks.retrieveTask(selectedTask.id);
  currentSession.innerText = selectedTask.currentSession;

  document.querySelector(
    `#task-box-${selectedTask.id} .current-session`
  ).innerText = selectedTask.currentSession;

  if (
    selectedTask.currentSession == selectedTask.sessionNumber &&
    !selectedTask.isCompleted
  ) {
    // * display celebration msg
    displayCelebrationMsg();
    myTasks.completeTask(selectedTask.id);
    document
      .querySelector(`#task-box-${selectedTask.id} .circle`)
      .classList.toggle("bg-color-secondary");

    selectedTask = myTasks.retrieveTask(selectedTask.id);

    document.querySelector(
      `#task-box-${selectedTask.id} li.complete-task-btn`
    ).innerText = selectedTask.isCompleted
      ? "Uncomplete Task"
      : "Complete Task";
    nextSessionBtn.style.cssText =
      "color:grey; border:2px solid grey; cursor:not-allowed";

    selectedTask.isCompleted
      ? document
          .querySelector(`#task-box-${selectedTask.id} li.edit-task-btn`)
          .classList.add("d-none")
      : document
          .querySelector(`#task-box-${selectedTask.id} li.edit-task-btn`)
          .classList.remove("d-none");
  }
});
