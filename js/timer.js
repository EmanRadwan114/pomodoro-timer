export default class Timer {
  constructor(min, sec) {
    this.minutes = min;
    this.seconds = sec;
    this.timerInterval;
    this.isWorking = false;
    this.isStarted = false;
    this.totalSeconds = min * 60 + sec; // store total time
    this.initialMinutes = min;
    this.initialSeconds = sec;
  }
}
