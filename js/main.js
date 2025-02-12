"use strict";

// ^--------------------------import statements -------------------------
import Timer from "./timer.js";
import TasksContainer from "./allTasks.js";
import {
  chooseCategory,
  clearTaskDate,
  closeModal,
  createTaskBox,
  displayCurrentDate,
  displayInterval,
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
  updateUI,
  validateForm,
} from "./utilitis.js";
import TimersContainer from "./allTimers.js";

// ^-----------------------------default timers----------------------
const myTimers = new TimersContainer();
let timersList = myTimers.getAllTimers();
let selectedOngoingTimer = null;
let selectedBreakTimer = null;
let selectedTask = null;

// ^-------------------------------Tasks List---------------------------------
const taskListSection = document.querySelector("#tasks .tasks-container");
export const tasksContainer = document.getElementById("tasks-container");
const tasksNum = document.querySelector(".tasks-container h2 span");
const celebrateTxt = document.getElementById("celebrate-txt");
const completedTasks = document.querySelector("#progress .completed");
const totalTasks = document.querySelector("#progress .total");
let currentSession = document.querySelector("#ongoing .current-session");
export let sessionNumericals = document.querySelector("#ongoing .session-num");
let taskBoxes = document.getElementsByClassName("box");
const myTasks = new TasksContainer();
let tasksList = myTasks.getAllTasks();
const progressObj = {
  completedTasks,
  totalTasks,
  tasksNum,
  celebrateTxt,
};

// & 1- display all tasks
if (window.screen.width > 992) {
  taskListSection.style.height =
    parseInt(getComputedStyle(taskListSection.parentElement).height) -
    20 +
    "px";
}

displayTasks(tasksList);

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

    // ?create task timers
    const newTimers = myTimers.addTaskTimers(newTask.id);
    timersList = myTimers.getAllTimers();

    // ?display created task & update ui
    createTaskBox(newTask);
    displayUserProgress(progressObj, tasksList);

    // ?reset data
    tasksContainer.children[tasksContainer.children.length - 1].classList.add(
      "d-none"
    );
    tasksContainer.children[
      tasksContainer.children.length - 1
    ].classList.remove("d-flex");
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
tasksContainer.addEventListener("click", (e) => {
  if (e.target.closest(".box")) {
    // * link task with timer
    const box = e.target.closest(".box");

    for (let i = 0; i < taskBoxes.length; i++) {
      taskBoxes[i].style.outline = "none";
    }

    // *stop working timers when click on new task & show the new timer data
    switchTab(ongoingTab, breakTab, ongoingSection, breakSection);
    if (selectedOngoingTimer?.isWorking) {
      stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "ongoing",
        playOngoingBtn,
        stopOngoingBtn
      );
    } else if (selectedBreakTimer?.isWorking) {
      stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "break",
        playBreakBtn,
        stopBreakBtn
      );
    }

    selectedTask = myTasks.retrieveTask(box.id.split("-")[2]);
    selectedOngoingTimer = myTimers.retrieveTimers(
      selectedTask?.id
    )?.ongoingTimer;
    selectedBreakTimer = myTimers.retrieveTimers(selectedTask?.id)?.breakTimer;

    box.style.outline = "2px solid rgba(0, 0, 0, 0.5)";

    updateTimerData(
      selectedTask,
      selectedOngoingTimer,
      selectedBreakTimer,
      tasksList.length,
      playOngoingBtn,
      playBreakBtn
    );

    // * display task info
    if (e.target.classList.contains("display-task-btn")) {
      selectedTask = myTasks.retrieveTask(
        e.target.getAttribute("data-identity")
      );

      selectedOngoingTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.ongoingTimer;
      selectedBreakTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.breakTimer;

      showModal(showTaskModal);
      displayTaskInfo(myTasks, selectedTask?.id);
    }
    //* complete task
    else if (
      e.target.classList.contains("complete-task-btn") ||
      e.target.classList.contains("uncomplete-task-btn")
    ) {
      selectedTask = myTasks.retrieveTask(
        e.target.getAttribute("data-identity")
      );

      selectedOngoingTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.ongoingTimer;
      selectedBreakTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.breakTimer;

      myTasks.completeTask(selectedTask?.id);
      selectedTask = myTasks.retrieveTask(selectedTask?.id);
      tasksList = myTasks.getAllTasks();

      myTimers.completeTimer(selectedTask?.id);
      selectedOngoingTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.ongoingTimer;
      selectedBreakTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.breakTimer;
      timersList = myTimers.getAllTimers();

      updateTimerData(
        selectedTask,
        selectedOngoingTimer,
        selectedBreakTimer,
        tasksList.length,
        playOngoingBtn,
        playBreakBtn
      );

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

      selectedOngoingTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.ongoingTimer;
      selectedBreakTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.breakTimer;

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
      selectedOngoingTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.ongoingTimer;
      selectedBreakTimer = myTimers.retrieveTimers(
        selectedTask?.id
      )?.breakTimer;
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
  if (isFormValidated || titleField.value.length >= 3) {
    const taskTime = getTaskDate();
    const updatedTask = myTasks.editTask(
      selectedTask?.id,
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
    counter = 1;
    closeModal(addTaskModal);
    clearTaskDate();

    updateTimerData(
      updatedTask,
      selectedOngoingTimer,
      selectedBreakTimer,
      tasksList.length,
      playOngoingBtn,
      playBreakBtn
    );
  } else {
    validationTxt.classList.remove("d-none");
  }
});

// ? confirm deletion
confirmDeleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (deleteTaskModal.getAttribute("data-number") == "one") {
    myTasks.deleteTask(selectedTask?.id);
    tasksList = myTasks.getAllTasks();
    myTimers.deleteTimer(selectedTask?.id);
    timersList = myTimers.getAllTimers();
    emptyTaskContainer();
    displayTasks(tasksList);
  } else if (deleteTaskModal.getAttribute("data-number") == "all") {
    myTasks.deleteAllTasks();
    tasksList = myTasks.getAllTasks();
    myTimers.deleteAllTimers();
    timersList = myTimers.getAllTimers();
    emptyTaskContainer();
    displayTasks(tasksList);
    deleteTaskModal.setAttribute("data-number", "one");
  } else if (deleteTaskModal.getAttribute("data-number") == "completed") {
    myTasks.deleteCompletedTasks();
    tasksList = myTasks.getAllTasks();
    myTimers.deleteCompletedTimers();
    timersList = myTimers.getAllTimers();
    emptyTaskContainer();
    displayTasks(tasksList);
    deleteTaskModal.setAttribute("data-number", "one");
  }
  displayUserProgress(progressObj, tasksList);
  closeModal(deleteTaskModal);

  selectedTask = null;

  let defaultTimer = timersList.find((timer) => timer.taskId == 0);
  defaultTimer = !defaultTimer ? myTimers.addTaskTimers(0) : defaultTimer;

  selectedOngoingTimer = defaultTimer?.ongoingTimer;
  selectedBreakTimer = defaultTimer?.breakTimer;

  updateTimerData(
    selectedTask,
    selectedOngoingTimer,
    selectedBreakTimer,
    tasksList.length,
    playOngoingBtn,
    playBreakBtn
  );
});

// *search for a task by title
searchField.addEventListener("input", (e) => {
  const foundTasks = myTasks.searchTask(searchField.value);
  emptyTaskContainer();
  displayTasks(foundTasks);

  if (!foundTasks.length && tasksList.length) {
    tasksContainer.children[tasksContainer.children.length - 1].querySelector(
      "p"
    ).innerText = "No Tasks Found 😔";
  } else {
    tasksContainer.children[tasksContainer.children.length - 1].querySelector(
      "p"
    ).innerHTML = `You have No Tasks <br/>
                    start adding a new one 😊`;
  }
});

// & complete & delete all tasks
completeAllTasksBtn.addEventListener("click", (e) => {
  //* stop break timer & switch its buttons
  selectedBreakTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "break",
        playBreakBtn,
        stopBreakBtn
      )
    : null;

  //* stop break timer & switch its buttons
  selectedOngoingTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "ongoing",
        playOngoingBtn,
        stopOngoingBtn
      )
    : null;
  selectedTask = null;

  let defaultTimer = timersList.find((timer) => timer.taskId == 0);
  defaultTimer = !defaultTimer ? myTimers.addTaskTimers(0) : defaultTimer;

  selectedOngoingTimer = defaultTimer?.ongoingTimer;
  selectedBreakTimer = defaultTimer?.breakTimer;

  updateTimerData(
    selectedTask,
    selectedOngoingTimer,
    selectedBreakTimer,
    tasksList.length,
    playOngoingBtn,
    playBreakBtn
  );

  if (tasksList.length) {
    myTasks.completeAllTasks();
    tasksList = myTasks.getAllTasks();

    myTimers.completeAllTimers();
    timersList = myTimers.getAllTimers();

    emptyTaskContainer();
    displayTasks(tasksList);
    // *update user progress
    displayUserProgress(progressObj, tasksList);
  }
});

deleteCompletedTaskskBtn.addEventListener("click", (e) => {
  //* stop break timer & switch its buttons
  selectedBreakTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "break",
        playBreakBtn,
        stopBreakBtn
      )
    : null;

  //* stop break timer & switch its buttons
  selectedOngoingTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "ongoing",
        playOngoingBtn,
        stopOngoingBtn
      )
    : null;
  if (tasksList.length) {
    deleteTaskModal.setAttribute("data-number", "completed");
    showModal(deleteTaskModal);
  }
});

deleteAllTasksBtn.addEventListener("click", (e) => {
  //* stop break timer & switch its buttons
  selectedBreakTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "break",
        playBreakBtn,
        stopBreakBtn
      )
    : null;

  //* stop break timer & switch its buttons
  selectedOngoingTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "ongoing",
        playOngoingBtn,
        stopOngoingBtn
      )
    : null;
  if (tasksList.length) {
    deleteTaskModal.setAttribute("data-number", "all");
    showModal(deleteTaskModal);
  }
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
export const ongoingTimerMins = document.querySelector(
  "#ongoing .count-down-time"
).children[0];
export const ongoingTimerSecs = document.querySelector(
  "#ongoing .count-down-time"
).children[1];
export const breakTimerMins = document.querySelector("#break .count-down-time")
  .children[0];
export const breakTimerSecs = document.querySelector("#break .count-down-time")
  .children[1];
export const playOngoingBtn = document.querySelector("#ongoing .play-btn");
export const stopOngoingBtn = document.querySelector("#ongoing .stop-btn");
export const replayOngoingBtn = document.querySelector("#ongoing .re-play");
export const nextSessionBtn = document.querySelector("#ongoing .next-step");
export const playBreakBtn = document.querySelector("#break .play-btn");
export const stopBreakBtn = document.querySelector("#break .stop-btn");
export const replayBreakBtn = document.querySelector("#break .re-play");
export const ongoingRange = document.querySelector("#ongoing .range");
export const breakRange = document.querySelector("#break .range");
export const celebrationMsg = document.querySelector("#celebration");
export const taskTitle = document.querySelector("#ongoing .task-info");
export const notificationSound = document.getElementById("notification-sound");
export const yaySound = document.getElementById("yay-sound");

// &default timer
if (!selectedTask) {
  let defaultTimer = timersList.find((timer) => timer.taskId == 0);
  defaultTimer = !defaultTimer ? myTimers.addTaskTimers(0) : defaultTimer;

  selectedOngoingTimer = defaultTimer?.ongoingTimer;
  selectedBreakTimer = defaultTimer?.breakTimer;

  updateTimerData(
    selectedTask,
    selectedOngoingTimer,
    selectedBreakTimer,
    tasksList.length,
    playOngoingBtn,
    playBreakBtn
  );
}

// &start timers
playOngoingBtn.addEventListener("click", () => {
  // &default timer
  if (!selectedTask) {
    let defaultTimer = timersList.find((timer) => timer.taskId == 0);
    defaultTimer = !defaultTimer ? myTimers.addTaskTimers(0) : defaultTimer;

    selectedOngoingTimer = defaultTimer?.ongoingTimer;
    selectedBreakTimer = defaultTimer?.breakTimer;
  }

  //* stop break timer & switch its buttons
  selectedBreakTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "break",
        playBreakBtn,
        stopBreakBtn
      )
    : null;

  myTimers.startTimer(selectedTask?.id, "ongoing"); //* start ongoing timer
  switchBtns(playOngoingBtn, stopOngoingBtn);

  selectedOngoingTimer = myTimers.retrieveTimers(
    selectedTask?.id
  )?.ongoingTimer;

  //* update range & txt with timer
  displayTimerData(
    selectedTask,
    myTasks,
    myTimers,
    selectedOngoingTimer,
    ongoingTimerMins,
    ongoingTimerSecs,
    ongoingRange,
    playOngoingBtn,
    stopOngoingBtn
  );
});

playBreakBtn.addEventListener("click", () => {
  // &default timer
  if (!selectedTask) {
    let defaultTimer = timersList.find((timer) => timer.taskId == 0);
    defaultTimer = !defaultTimer ? myTimers.addTaskTimers(0) : defaultTimer;

    selectedOngoingTimer = defaultTimer?.ongoingTimer;
    selectedBreakTimer = defaultTimer?.breakTimer;
  }
  //* stop ongoing timer & switch its buttons
  selectedOngoingTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "ongoing",
        playOngoingBtn,
        stopOngoingBtn
      )
    : null;

  myTimers.startTimer(selectedTask?.id, "break"); //* start ongoing timer
  switchBtns(playBreakBtn, stopBreakBtn);

  selectedBreakTimer = myTimers.retrieveTimers(selectedTask?.id)?.breakTimer;

  //* update range & txt with timer
  displayTimerData(
    selectedTask,
    myTasks,
    myTimers,
    selectedBreakTimer,
    breakTimerMins,
    breakTimerSecs,
    breakRange,
    playBreakBtn,
    stopBreakBtn
  );
});

// &stop timers
stopOngoingBtn.addEventListener("click", () => {
  myTimers.stopTimer(selectedTask?.id, "ongoing");

  clearInterval(displayInterval);
  switchBtns(playOngoingBtn, stopOngoingBtn);

  selectedOngoingTimer = myTimers.retrieveTimers(
    selectedTask?.id
  )?.ongoingTimer;
});

stopBreakBtn.addEventListener("click", () => {
  myTimers.stopTimer(selectedTask?.id, "break");

  clearInterval(displayInterval);
  switchBtns(playBreakBtn, stopBreakBtn);

  selectedBreakTimer = myTimers.retrieveTimers(selectedTask?.id)?.breakTimer;
});

// &replay timers
replayOngoingBtn.addEventListener("click", () => {
  // &default timer
  if (!selectedTask) {
    let defaultTimer = timersList.find((timer) => timer.taskId == 0);
    defaultTimer = !defaultTimer ? myTimers.addTaskTimers(0) : defaultTimer;

    selectedOngoingTimer = defaultTimer?.ongoingTimer;
    selectedBreakTimer = defaultTimer?.breakTimer;
  }
  //* stop break timer & switch its buttons
  selectedBreakTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "break",
        playBreakBtn,
        stopBreakBtn
      )
    : null;

  //* stop break timer & switch its buttons
  selectedOngoingTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "ongoing",
        playOngoingBtn,
        stopOngoingBtn
      )
    : null;

  if (
    !selectedOngoingTimer.isWorking ||
    (selectedOngoingTimer.minutes == 0 && selectedOngoingTimer.seconds == 0)
  ) {
    switchBtns(playOngoingBtn, stopOngoingBtn);
  }

  myTimers.rePlayTimer(selectedTask?.id, "ongoing");

  selectedOngoingTimer = myTimers.retrieveTimers(
    selectedTask?.id
  )?.ongoingTimer;

  //* update range & txt with timer
  displayTimerData(
    selectedTask,
    myTasks,
    myTimers,
    selectedOngoingTimer,
    ongoingTimerMins,
    ongoingTimerSecs,
    ongoingRange,
    playOngoingBtn,
    stopOngoingBtn
  );
});

replayBreakBtn.addEventListener("click", () => {
  // &default timer
  if (!selectedTask) {
    let defaultTimer = timersList.find((timer) => timer.taskId == 0);
    defaultTimer = !defaultTimer ? myTimers.addTaskTimers(0) : defaultTimer;

    selectedOngoingTimer = defaultTimer?.ongoingTimer;
    selectedBreakTimer = defaultTimer?.breakTimer;
  }
  //* stop break timer & switch its buttons
  selectedOngoingTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "ongoing",
        playOngoingBtn,
        stopOngoingBtn
      )
    : null;

  selectedBreakTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "break",
        playBreakBtn,
        stopBreakBtn
      )
    : null;

  if (
    !selectedBreakTimer.isWorking ||
    (selectedBreakTimer.minutes == 0 && selectedBreakTimer.seconds == 0)
  ) {
    switchBtns(playBreakBtn, stopBreakBtn);
  }

  myTimers.rePlayTimer(selectedTask?.id, "break");

  selectedBreakTimer = myTimers.retrieveTimers(selectedTask?.id)?.breakTimer;

  //* update range & txt with timer
  displayTimerData(
    selectedTask,
    myTasks,
    myTimers,
    selectedBreakTimer,
    breakTimerMins,
    breakTimerSecs,
    breakRange,
    playBreakBtn,
    stopBreakBtn
  );
});

// & move to next session in ongoing timer
nextSessionBtn.addEventListener("click", () => {
  //* stop timer of previous session
  selectedOngoingTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "ongoing",
        playOngoingBtn,
        stopOngoingBtn
      )
    : null;

  selectedBreakTimer.isWorking
    ? stopOtherWorkingTimer(
        selectedTask?.id,
        myTimers,
        "break",
        playBreakBtn,
        stopBreakBtn
      )
    : null;

  //*set new timer
  myTimers.resetTimer(selectedTask?.id, "ongoing");
  selectedOngoingTimer = myTimers.retrieveTimers(
    selectedTask?.id
  )?.ongoingTimer;

  //* update range & txt with timer
  updateUI(
    selectedOngoingTimer,
    ongoingTimerMins,
    ongoingTimerSecs,
    ongoingRange
  );

  // *update session
  myTasks.updateCurrentSession(selectedTask?.id);

  selectedTask = myTasks.retrieveTask(selectedTask?.id);

  updateTimerData(
    selectedTask,
    selectedOngoingTimer,
    selectedBreakTimer,
    tasksList.length,
    playOngoingBtn,
    playBreakBtn
  );
});
