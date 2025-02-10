import {
  addNoteBtn,
  categoryItems,
  celebrationMsg,
  noteContent,
  sessionNum,
  sessionNumericals,
  sessionTime,
  titleField,
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

function calculareProgress(timer, range) {
  //* Calculate progress for range slider
  let remainingSeconds = timer.getMins() * 60 + timer.getSecs();
  let percentage = (remainingSeconds / timer.getTotalSeconds()) * 100;
  range.style.width = 100 - percentage + "%";
}

function updateUI(timer, minTxt, secTxt, range) {
  minTxt.innerText =
    timer.getMins() < 10 ? `0${timer.getMins()}` : timer.getMins();
  secTxt.innerText =
    timer.getSecs() < 10 ? `0${timer.getSecs()}` : timer.getSecs();

  //* Calculate progress for range slider
  calculareProgress(timer, range);
}

let displayInterval;
export const displayTimerData = (
  timer,
  minTxt,
  secTxt,
  range,
  btn_1,
  btn_2
) => {
  // *Calculate progress for range slider
  calculareProgress(timer, range);

  displayInterval = setInterval(() => {
    //* update ui every second
    updateUI(timer, minTxt, secTxt, range);

    //* reset timer ui
    resetTimerUI(timer, btn_1, btn_2);

    if (!timer.getIsWorking()) {
      clearInterval(displayInterval);
    }
  }, 1000);
};

export function stopOtherWorkingTimer(timer, btn_1, btn_2) {
  if (timer.getIsWorking()) {
    timer.stopTimer();
    switchBtns(btn_1, btn_2);
  }

  if (displayInterval != undefined) {
    clearInterval(displayInterval);
  }
}

function resetTimerUI(timer, btn_1, btn_2) {
  if (timer.getMins() == 0 && timer.getSecs() == 0) {
    timer.resetTimer();
    switchBtns(btn_1, btn_2);
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

export function showAndHideTaskNotes(noteField, showBtn) {
  noteField.classList.toggle("d-none");
  showBtn.children[0].classList.toggle("fa-plus");
  showBtn.children[0].classList.toggle("fa-minus");
}

export function showTaskNotes(noteField, showBtn) {
  noteField.classList.remove("d-none");
  showBtn.children[0].classList.remove("fa-plus");
  showBtn.children[0].classList.add("fa-minus");
}

export function hideTaskNotes(noteField, showBtn) {
  noteField.classList.add("d-none");
  showBtn.children[0].classList.add("fa-plus");
  showBtn.children[0].classList.remove("fa-minus");
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
  const category = {};
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

export function clearTaskDate(
  title,
  taskTime,
  sessionNum,
  addNoteBtn,
  noteContent,
  categoryItems
) {
  title.value = "";
  taskTime.value = "";
  sessionNum.innerText = "1";
  noteContent.value = "";
  hideTaskNotes(noteContent, addNoteBtn);
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
  icon.className = `fa-solid fa-check txt-color-medium-light ${
    task.isCompleted ? "uncomplete-task-btn" : "complete-task-btn"
  } w-100 text-center p-1`;
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
  container.appendChild(taskDiv);
}

export function displayTasks(tasksLength, taskList, tasksContainer) {
  if (tasksLength == 0) {
    tasksContainer.children[0].classList.remove("d-none");
    tasksContainer.children[0].classList.add("d-flex");
  } else {
    tasksContainer.children[0].classList.add("d-none");
    tasksContainer.children[0].classList.remove("d-flex");
    taskList.forEach((task) => {
      createTaskBox(task);
    });
  }
}

export function getTaskDate(sessionTime, sessionNum) {
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
    ? txt.celebrateTxt.classList.remove("d-none")
    : txt.celebrateTxt.classList.add("d-none");
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

  showTaskNotes(noteContent, addNoteBtn);
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

export function emptyTaskContainer(tasksContainer) {
  tasksContainer.innerHTML = `<div
  class="d-flex align-center center d-none text-center absolute position-0"
>
  <div class="txt-capitalize fs-3 mt-5 mb-5">
    <p class="mb-2">You have No Tasks</p>
    <p>start adding a new one 😊</p>
  </div>
</div>`;
}

export function updateSessionNum(selectedTask) {
  selectedTask
    ? sessionNumericals.classList.remove("d-none")
    : sessionNumericals.classList.add("d-none");

  sessionNumericals.children[0].innerText = selectedTask?.currentSession;
  sessionNumericals.children[1].innerText = selectedTask?.sessionNumber;
}

export function displayCelebrationMsg() {
  setTimeout(() => {
    // Get the user's scroll position
    const x = window.scrollX + window.innerWidth / 2 - 25; // Center horizontally
    const y = window.scrollY + window.innerHeight / 2 - 25; // Center vertically

    // Position the div at the user's scroll position
    celebrationMsg.style.left = `${x}px`;
    celebrationMsg.style.top = `${y}px`;
    celebrationMsg.style.transform = `translateX(-50%)`;
    celebrationMsg.classList.remove("d-none");
  }, 50);

  setTimeout(() => {
    celebrationMsg.classList.add("d-none");
  }, 500);
}
