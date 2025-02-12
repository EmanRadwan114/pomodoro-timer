import {
  addNoteBtn,
  breakRange,
  breakTimerMins,
  breakTimerSecs,
  categoryItems,
  celebrationMsg,
  nextSessionBtn,
  noteContent,
  notificationSound,
  ongoingRange,
  ongoingTimerMins,
  ongoingTimerSecs,
  sessionNum,
  sessionNumericals,
  sessionTime,
  tasksContainer,
  taskTitle,
  titleField,
  validationTxt,
  yaySound,
} from "./main.js";

export const displayCurrentDate = () => {
  let currentDate = new Date();
  currentDate = currentDate.toDateString();
  return currentDate;
};

export function switchTab(currentTab, otherTab, currentSec, otherSec) {
  currentTab.classList.add("bg-color-primary-dark");
  otherTab.classList.remove("bg-color-primary-dark");
  currentSec.classList.remove("d-none");
  otherSec.classList.add("d-none");
}

export function switchBtns(btn_1, btn_2) {
  btn_1.parentNode.classList.toggle("d-none");
  btn_2.parentNode.classList.toggle("d-none");
}

function calculateProgress(timer, range) {
  //* Calculate progress for range slider
  let remainingSeconds = timer.minutes * 60 + timer.seconds;
  let percentage = (remainingSeconds / timer.totalSeconds) * 100;
  range.style.width = 100 - percentage + "%";
}

export function updateUI(timer, minTxt, secTxt, range) {
  if (timer.isStarted) {
    minTxt.innerText = timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes;
    secTxt.innerText = timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds;
  } else {
    minTxt.innerText = timer.minutes + 1;
    secTxt.innerText = "00";
  }

  //* Calculate progress for range slider
  calculateProgress(timer, range);
}

export let displayInterval;
export const displayTimerData = (
  selectedTask,
  myTasks,
  myTimers,
  timer,
  minTxt,
  secTxt,
  range,
  btn_1,
  btn_2
) => {
  // *Calculate progress for range slider
  updateUI(timer, minTxt, secTxt, range);

  displayInterval = setInterval(() => {
    //* update ui every second
    updateUI(timer, minTxt, secTxt, range);

    //* reset timer ui
    if (
      (timer.minutes == 0 && timer.seconds == 0) ||
      (timer.initialMinutes == timer.minutes &&
        timer.initialSeconds == timer.seconds &&
        timer.isStarted)
    ) {
      switchBtns(btn_1, btn_2);
      notificationSound.play();
      clearInterval(displayInterval);
    }
    if (
      timer.minutes == 0 &&
      timer.seconds == 0 &&
      selectedTask.currentSession == selectedTask.sessionNumber &&
      !selectedTask.isCompleted
    ) {
      myTasks.completeTask(selectedTask.id);
      myTimers.completeTimer(selectedTask.id);
      document
        .querySelector(`#task-box-${selectedTask.id} .circle`)
        .classList.toggle("bg-color-secondary");
      displayCelebrationMsg();
      btn_1.style.cssText =
        "background-color:grey; color:white; border:2px solid grey; cursor:not-allowed";
      btn_1.setAttribute("disabled", "disabled");
    }
    if (!timer.isWorking) {
      clearInterval(displayInterval);
    }
  }, 1000);
};

export function stopOtherWorkingTimer(
  taskId,
  myTimers,
  timerType,
  btn_1,
  btn_2
) {
  myTimers.stopTimer(taskId, timerType);
  switchBtns(btn_1, btn_2);

  if (displayInterval != undefined) {
    clearInterval(displayInterval);
  }
}

export function showModal(modal) {
  modal.classList.remove("d-none");
  modal.classList.add("row");
  document.querySelector(".container").classList.add("d-none");
  document.querySelector(".container").classList.remove("row");
}

export function closeModal(modal) {
  modal.classList.add("d-none");
  modal.classList.remove("row");
  document.querySelector(".container").classList.add("row");
  document.querySelector(".container").classList.remove("d-none");
}

export function showAndHideTaskNotes() {
  noteContent.classList.toggle("d-none");
  addNoteBtn.children[0].classList.toggle("fa-plus");
  addNoteBtn.children[0].classList.toggle("fa-minus");
}

export function showTaskNotes() {
  noteContent.classList.remove("d-none");
  addNoteBtn.children[0].classList.remove("fa-plus");
  addNoteBtn.children[0].classList.add("fa-minus");
}

export function hideTaskNotes() {
  noteContent.classList.add("d-none");
  addNoteBtn.children[0].classList.add("fa-plus");
  addNoteBtn.children[0].classList.remove("fa-minus");
}

export function switchtoAddMode(addBtn, editBtn) {
  addBtn.parentNode.classList.remove("d-none");
  editBtn.parentNode.classList.add("d-none");
}

export function switchtoEditMode(addBtn, editBtn) {
  editBtn.parentNode.classList.remove("d-none");
  addBtn.parentNode.classList.add("d-none");
}

export function chooseCategory(categoryItems) {
  const category = { category: "work", icon: "fa-solid fa-briefcase" };
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      categoryItems.forEach((categ) => {
        categ.style.outline = "";
      });
      item.style.outline = "3px solid var(--text-color)";
      category.category = item.children[1].innerText;
      category.icon = item.children[0].className;
    });
  });

  return category;
}
export let isFormValidated = null;
export function validateForm() {
  titleField.addEventListener("input", (e) => {
    if (!e.target.value || e.target.value.length < 3) {
      e.target.nextElementSibling.classList.remove("d-none");
      isFormValidated = false;
    } else {
      e.target.nextElementSibling.classList.add("d-none");
      isFormValidated = true;
    }
  });
}

export function clearTaskDate() {
  titleField.value = "";
  validationTxt.classList.add("d-none");
  titleField.nextElementSibling.classList.add("d-none");
  sessionTime.value = "";
  sessionNum.innerText = "1";
  noteContent.value = "";
  hideTaskNotes();
  categoryItems.forEach((categ) => {
    categ.style.outline = "";
  });
}

export function createTaskBox(task) {
  const container = document.getElementById("tasks-container");

  // Create the main row div
  const taskDiv = document.createElement("div");
  taskDiv.id = `task-box-${task.id}`;
  taskDiv.className = "row mt-4 box radius-small g-2";

  // Create first column (circle)
  const col1 = document.createElement("div");
  col1.className = `col-2 col-sm-1`;
  const circleDiv = document.createElement("div");
  circleDiv.className = `circle border-secondary radius-circle cursor d-flex center align-center ${
    task.isCompleted ? "bg-color-secondary" : ""
  }`;

  col1.appendChild(circleDiv);

  const icon = document.createElement("i");
  icon.className = `fa-solid fa-check txt-color-medium-light p-1 ${
    task.isCompleted ? "uncomplete-task-btn" : "complete-task-btn"
  } w-100 text-center`;
  icon.setAttribute("data-identity", task.id);
  circleDiv.appendChild(icon);

  // Create second column (title and time)
  const col2 = document.createElement("div");
  col2.className = "col-8 col-sm-6 cursor";
  const titleElement = document.createElement("h3");
  titleElement.className = "fs-3 mb-2 txt-capitalize";
  titleElement.textContent = task.title;
  const timeParagraph = document.createElement("p");
  timeParagraph.className = "txt-color-primary";
  timeParagraph.innerHTML = `
  <span class="start-time">${task.startTime}</span> - <span class="end-time">${task.endTime}</span>
  <p class="mt-2 mb-2 task-day">${task.taskDate}</p>
  `;
  col2.appendChild(titleElement);
  col2.appendChild(timeParagraph);

  // Create third column (session info and menu)
  const col3 = document.createElement("div");
  col3.className = "col-2 col-sm-5 row end cursor";

  const sessionDiv = document.createElement("div");
  sessionDiv.className = "col-sm-10 d-none d-sm-block";
  const sessionP = document.createElement("p");
  sessionP.className = "session mb-2 text-end";
  sessionP.innerHTML = `Session <span class="current-session">${task.currentSession}</span> / <span class="session-count">${task.sessionNumber}</span>`;
  sessionDiv.appendChild(sessionP);

  const menuCol = document.createElement("div");
  menuCol.className = "col-sm-2";
  const menuDiv = document.createElement("div");
  menuDiv.id = "menu";
  menuDiv.className = "cursor relative text-end";
  const menuIcon = document.createElement("i");
  menuIcon.className =
    "fa-solid fa-ellipsis-vertical menu-bullets cursor txt-color-dark pe-2 ps-2";

  const menuList = document.createElement("ul");
  menuList.className =
    "menu-items text-start radius-small bg-color-secondary-opaque txt-color-light";

  [
    "Display Task",
    `${task.isCompleted ? "Uncomplete Task" : "Complete Task"}`,
    "Edit Task",
    "Delete Task",
  ].forEach((text) => {
    const li = document.createElement("li");
    li.className = `cursor m-4 radius-small pt-1 pb-1 pe-3 ps-3 ${text
      .split(" ")
      .join("-")
      .toLocaleLowerCase()}-btn`;
    li.setAttribute("data-identity", task.id);
    li.textContent = text;
    menuList.appendChild(li);

    task.isCompleted
      ? li.innerText.toLowerCase() == "edit task"
        ? li.classList.add("d-none")
        : li.classList.remove("d-none")
      : "";
  });

  menuDiv.appendChild(menuIcon);
  menuDiv.appendChild(menuList);
  menuCol.appendChild(menuDiv);
  col3.appendChild(sessionDiv);
  col3.appendChild(menuCol);

  // Append all columns to the main row
  taskDiv.appendChild(col1);
  taskDiv.appendChild(col2);
  taskDiv.appendChild(col3);

  // Append the task box to the container
  container.prepend(taskDiv);
}

export function displayTasks(tasksList) {
  const child = tasksContainer.children[tasksContainer.children.length - 1];
  if (tasksList.length == 0) {
    child.classList.remove("d-none");
    child.classList.add("d-flex");
  } else {
    child.classList.add("d-none");
    child.classList.remove("d-flex");
    tasksList.forEach((task) => {
      createTaskBox(task);
    });
  }
}

export function getTaskDate() {
  let taskTime = sessionTime.value ? new Date(sessionTime.value) : new Date();
  const taskFullDate = sessionTime.value
    ? sessionTime.value
    : sessionTime.getAttribute("min");
  const taskDay = taskTime.toLocaleDateString();
  let startTime = taskTime;
  const startTimeDisplay = taskTime
    .toLocaleTimeString()
    .split(":")
    .splice(0, 2)
    .join(":");

  const endTimeStamps = taskTime.setMinutes(
    25 * +sessionNum.innerText + taskTime.getMinutes()
  );
  let endTime = new Date(endTimeStamps);
  let endDateDisplay = endTime
    .toLocaleTimeString()
    .split(":")
    .splice(0, 2)
    .join(":");

  startTime =
    startTimeDisplay + " " + startTime.toLocaleTimeString().split(" ")[1];
  endTime = endDateDisplay + " " + endTime.toLocaleTimeString().split(" ")[1];

  return {
    taskFullDate,
    taskDay,
    startTime,
    endTime,
  };
}

export function displayUserProgress(txt, tasksList) {
  txt.completedTasks.innerText = tasksList.filter(
    (task) => task.isCompleted == true
  ).length;
  txt.totalTasks.innerText = tasksList.length;

  txt.tasksNum.innerText =
    tasksList.length > 1
      ? `(${tasksList.length} Tasks)`
      : `(${tasksList.length} Task)`;

  tasksList.filter((task) => task.isCompleted == true).length >= 1
    ? (txt.celebrateTxt.innerText = `Tasks Were Completed 🎉👏`)
    : (txt.celebrateTxt.innerText = `Track Your Progress Here 🕘`);
}

export function displayTaskInfo(myTasks, id) {
  const targetTask = myTasks.retrieveTask(id);

  document.querySelector("#show-task-details .task-info h3").innerText =
    targetTask.title;
  document.querySelector("#show-task-details .task-img i").className =
    targetTask.category.icon;
  document.querySelector(
    "#show-task-details .task-info .current-session"
  ).innerText = targetTask.currentSession;
  document.querySelector(
    "#show-task-details .task-info .session-count"
  ).innerText = targetTask.sessionNumber;
  document.querySelector(
    "#show-task-details .task-info .start-time"
  ).innerText = targetTask.startTime;
  document.querySelector("#show-task-details .task-info .end-time").innerText =
    targetTask.endTime;
  document.querySelector("#show-task-details .task-info .task-date").innerText =
    targetTask.taskDate;
  document.querySelector("#show-task-details .notes-content").innerText =
    targetTask.notes;
}

export function displayTaskInfoForEdit(targetTask) {
  titleField.value = targetTask.title;
  sessionTime.value = targetTask.taskFullDate;
  sessionNum.innerText = targetTask.sessionNumber;
  noteContent.value = targetTask.notes;
  categoryItems.forEach((item) => {
    if (
      item.children[1].innerText?.toLocaleLowerCase() ==
      targetTask.category.category?.toLocaleLowerCase()
    ) {
      item.style.outline = "3px solid var(--text-color)";
    }
  });

  showTaskNotes();
}

export function displayUpdatedData(updatedTask) {
  document.querySelector(`#task-box-${updatedTask.id} h3`).innerText =
    updatedTask.title;
  document.querySelector(
    `#task-box-${updatedTask.id} .current-session`
  ).innerText = updatedTask.currentSession;
  document.querySelector(
    `#task-box-${updatedTask.id} .session-count`
  ).innerText = updatedTask.sessionNumber;
  document.querySelector(`#task-box-${updatedTask.id} .task-day`).innerText =
    updatedTask.taskDate;
  document.querySelector(`#task-box-${updatedTask.id} .start-time`).innerText =
    updatedTask.startTime;
  document.querySelector(`#task-box-${updatedTask.id} .end-time`).innerText =
    updatedTask.endTime;
}

export function emptyTaskContainer() {
  tasksContainer.innerHTML = ` 
                <div
                  class="d-flex align-center center text-center vh-25 start-txt"
                >
                  <div class="txt-capitalize mt-5 mb-5">
                    <p class="mb-2 fs-3">You have No Tasks <br/>
                    start adding a new one 😊</p>
                  </div>
                </div>`;
}

export function updateTimerData(
  selectedTask,
  selectedOngoingTimer,
  selectedBreakTimer,
  tasksListLength,
  btn_1,
  btn_2
) {
  if (selectedTask) {
    if (
      selectedTask.sessionNumber > 1 &&
      !selectedTask.isCompleted &&
      selectedTask.sessionNumber != selectedTask.currentSession
    ) {
      nextSessionBtn.style.cssText = "cursor:pointer";
      nextSessionBtn.removeAttribute("disabled");
    } else {
      nextSessionBtn.style.cssText =
        "color:grey; border:2px solid grey; cursor:not-allowed";
      nextSessionBtn.setAttribute("disabled", "disabled");
    }

    if (selectedTask.isCompleted) {
      btn_1.style.cssText =
        "background-color:grey; color:white; border:2px solid grey; cursor:not-allowed";
      btn_1.setAttribute("disabled", "disabled");
      btn_2.style.cssText =
        "background-color:grey; color:white; border:2px solid grey; cursor:not-allowed";
      btn_2.setAttribute("disabled", "disabled");
    } else {
      btn_1.style.cssText = "cursor:pointer";
      btn_1.removeAttribute("disabled");
      btn_2.style.cssText = "cursor:pointer";
      btn_2.removeAttribute("disabled");
    }

    sessionNumericals.children[0].innerText = selectedTask.currentSession;
    sessionNumericals.children[1].innerText = selectedTask.sessionNumber;
    taskTitle.children[0].innerText = tasksListLength - selectedTask.id + 1;
    taskTitle.children[1].innerText = selectedTask.title;

    updateUI(
      selectedOngoingTimer,
      ongoingTimerMins,
      ongoingTimerSecs,
      ongoingRange
    );
    updateUI(selectedBreakTimer, breakTimerMins, breakTimerSecs, breakRange);
  } else {
    sessionNumericals.children[0].innerText = "1";
    sessionNumericals.children[1].innerText = "1";
    taskTitle.children[0].innerText = "#";
    taskTitle.children[1].innerText = "Start Timer 😊";
    nextSessionBtn.style.cssText =
      "color:grey; border:2px solid grey; cursor:not-allowed";
    btn_1.style.cssText = "cursor:pointer";
    btn_1.removeAttribute("disabled");
    btn_2.style.cssText = "cursor:pointer";
    btn_2.removeAttribute("disabled");
    updateUI(
      selectedOngoingTimer,
      ongoingTimerMins,
      ongoingTimerSecs,
      ongoingRange
    );
    updateUI(selectedBreakTimer, breakTimerMins, breakTimerSecs, breakRange);
  }
}

function displayCelebrationMsg() {
  yaySound.play();
  // Get the user's scroll position
  const x = window.scrollX + window.innerWidth / 2 - 25; // Center horizontally
  const y = window.scrollY + window.innerHeight / 2 - 25; // Center vertically

  // Position the div at the user's scroll position
  celebrationMsg.style.left = `${x}px`;
  celebrationMsg.style.top = `${y}px`;
  celebrationMsg.style.transform = `translateX(-50%)`;

  setTimeout(() => {
    celebrationMsg.classList.remove("v-hidden", "opacity-0");
  }, 1000);

  setTimeout(() => {
    celebrationMsg.classList.add("v-hidden", "opacity-0");
  }, 3500);
}
