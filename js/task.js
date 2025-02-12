export default class Task {
  constructor(
    id,
    title,
    sessionNumber,
    taskFullDate,
    taskDate,
    startTime,
    endTime,
    category,
    notes,
    ongoingTimer,
    breakTimer
  ) {
    this.id = id;
    this.title = title;
    this.sessionNumber = sessionNumber;
    this.currentSession = 1;
    this.taskFullDate = taskFullDate;
    this.taskDate = taskDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.category = category;
    this.isCompleted = false;
    this.notes = notes;
    this.ongoingTimer = ongoingTimer;
    this.breakTimer = breakTimer;
  }
}
