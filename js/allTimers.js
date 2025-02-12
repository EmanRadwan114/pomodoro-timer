import Timer from "./timer.js";

export default class TimersContainer {
  #timersContainer;
  #timerInterval;

  constructor() {
    this.#timersContainer = [];
    this.#timerInterval = null;
  }

  saveAllTimers() {
    localStorage.setItem("timers", JSON.stringify(this.#timersContainer));
  }

  getAllTimers() {
    if (localStorage.getItem("timers")) {
      this.#timersContainer = JSON.parse(localStorage.getItem("timers"));
    }
    return this.#timersContainer;
  }

  addTaskTimers(taskId = 0) {
    const newTimers = { taskId, isCompleted: false };
    newTimers.ongoingTimer = new Timer(24, 60);
    newTimers.breakTimer = new Timer(4, 60);
    this.#timersContainer.push(newTimers);
    this.saveAllTimers();
    return newTimers;
  }

  retrieveTimers(taskId = 0) {
    return this.#timersContainer.find((timer) => timer.taskId === +taskId);
  }

  completeTimer(id = 0) {
    this.#timersContainer = this.getAllTimers();
    this.#timersContainer = this.#timersContainer.map((elem) => {
      if (elem.taskId === +id) {
        elem.isCompleted = !elem.isCompleted;
      }
      return elem;
    });
    this.saveAllTimers();
  }

  deleteTimer(taskId) {
    this.#timersContainer = this.getAllTimers();
    this.#timersContainer = this.#timersContainer.filter((elem) => {
      return elem.taskId !== +taskId;
    });
    this.saveAllTimers();
  }

  completeAllTimers() {
    this.#timersContainer = this.getAllTimers();

    this.#timersContainer = this.#timersContainer.map((timer) => {
      timer.isCompleted = true;
      return timer;
    });

    this.saveAllTimers();
  }

  deleteCompletedTimers() {
    this.#timersContainer = this.getAllTimers();

    this.#timersContainer = this.#timersContainer.filter((timer) => {
      return timer.isCompleted == false;
    });

    this.saveAllTimers();
  }

  deleteAllTimers() {
    this.#timersContainer = this.#timersContainer.filter(
      (timer) => timer.taskId == 0
    );
    this.saveAllTimers();
  }

  startTimer(taskId = 0, timerType) {
    const taskTimers = this.#timersContainer.find(
      (timer) => timer.taskId === +taskId
    );

    let myTimer =
      timerType == "ongoing"
        ? taskTimers.ongoingTimer
        : timerType == "break"
        ? taskTimers.breakTimer
        : "";

    myTimer.isWorking = true;
    myTimer.isStarted = true;

    this.#timersContainer = this.#timersContainer.map((timer) => {
      if (timer.taskId === +taskId && timerType == "ongoing") {
        timer.ongoingTimer = myTimer;
      } else if (timer.taskId === +taskId && timerType == "ongoing") {
        timer.breakTimer = myTimer;
      }
      return timer;
    });

    this.saveAllTimers();

    this.timerInterval = setInterval(() => {
      if (
        (myTimer.minutes != 0 && myTimer.seconds != 0) ||
        (myTimer.minutes == 0 && myTimer.seconds != 0)
      ) {
        myTimer.seconds--;
        if (myTimer.seconds < 0 && myTimer.minutes > 0) {
          myTimer.seconds = 59;
          myTimer.minutes--;
        }
        if (myTimer.minutes == 0 && myTimer.seconds == 0) {
          this.stopTimer(taskId, timerType);
        }
      } else {
        this.stopTimer(taskId, timerType);
      }
    }, 1000);
  }

  stopTimer(taskId = 0, timerType) {
    clearInterval(this.timerInterval);

    const taskTimers = this.#timersContainer.find(
      (timer) => timer.taskId === +taskId
    );

    let myTimer =
      timerType == "ongoing"
        ? taskTimers.ongoingTimer
        : timerType == "break"
        ? taskTimers.breakTimer
        : "";

    if (!taskId && myTimer.minutes == 0 && myTimer.seconds == 0) {
      this.resetTimer(taskId, timerType);
    }

    myTimer.isWorking = false;

    this.#timersContainer = this.#timersContainer.map((timer) => {
      if (timer.taskId === +taskId && timerType == "ongoing") {
        timer.ongoingTimer = myTimer;
      } else if (timer.taskId === +taskId && timerType == "ongoing") {
        timer.breakTimer = myTimer;
      }
      return timer;
    });

    this.saveAllTimers();
  }

  rePlayTimer(taskId = 0, timerType) {
    const taskTimers = this.#timersContainer.find(
      (timer) => timer.taskId === +taskId
    );
    let myTimer =
      timerType == "ongoing"
        ? taskTimers.ongoingTimer
        : timerType == "break"
        ? taskTimers.breakTimer
        : "";

    this.resetTimer(taskId, timerType);
    if (!myTimer.isWorking) this.startTimer(taskId, timerType);
  }

  resetTimer(taskId = 0, timerType) {
    const taskTimers = this.retrieveTimers(taskId);
    let myTimer =
      timerType == "ongoing"
        ? taskTimers.ongoingTimer
        : timerType == "break"
        ? taskTimers.breakTimer
        : "";
    myTimer.isStarted = !taskId ? true : false;
    myTimer.minutes = myTimer.initialMinutes;
    myTimer.seconds = myTimer.initialSeconds;
    myTimer.totalSeconds = myTimer.initialMinutes * 60 + myTimer.initialSeconds; // Reset total time

    this.#timersContainer = this.#timersContainer.map((timer) => {
      if (timer.taskId === +taskId && timerType == "ongoing") {
        timer.ongoingTimer = myTimer;
      } else if (timer.taskId === +taskId && timerType == "ongoing") {
        timer.breakTimer = myTimer;
      }
      return timer;
    });

    this.saveAllTimers();
  }
}
