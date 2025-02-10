export default class Timer {
  #minutes;
  #seconds;
  #timerInterval;
  #isWorking;
  #totalSeconds;
  #initialMinutes;
  #initialSeconds;

  constructor(min, sec) {
    this.#minutes = min;
    this.#seconds = sec;
    this.#timerInterval;
    this.#isWorking = false;
    this.#totalSeconds = min * 60 + sec; // store total time
    this.#initialMinutes = min;
    this.#initialSeconds = sec;
  }

  //* setters & getters
  setMins(val) {
    this.#minutes = val;
  }
  getMins() {
    return this.#minutes;
  }
  setSecs(val) {
    this.#seconds = val;
  }
  getSecs() {
    return this.#seconds;
  }
  setIsWorking(val) {
    this.#isWorking = val;
  }
  getIsWorking() {
    return this.#isWorking;
  }
  getTotalSeconds() {
    return this.#totalSeconds;
  }
  //* methods
  startTimer() {
    this.#isWorking = true;
    this.#timerInterval = setInterval(() => {
      this.#seconds--;
      if (this.#seconds < 0 && this.#minutes > 0) {
        this.#seconds = 59;
        this.#minutes--;
      }
      if (this.#minutes <= 0 && this.#seconds <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    this.#isWorking = false;
    clearInterval(this.#timerInterval);
  }

  rePlayTimer() {
    this.setMins(this.#initialMinutes);
    this.setSecs(this.#initialSeconds);
    this.#totalSeconds = this.#initialMinutes * 60 + this.#initialSeconds; // Reset total time
    if (!this.#isWorking) this.startTimer();
  }

  moveToNextSession() {
    this.setMins(this.#initialMinutes);
    this.setSecs(this.#initialSeconds);
    this.#totalSeconds = this.#initialMinutes * 60 + this.#initialSeconds; // Reset total time
  }

  resetTimer() {
    this.#minutes = this.#initialMinutes;
    this.#seconds = this.#initialSeconds;
  }
}
