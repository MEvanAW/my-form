export const timesService = {
  timeSeparator: ':',
  emptyString: '',
  translateTimeByHour(timeString, hourNumber) {
    const times = timeString.split(this.timeSeparator)
    let hour = +times[0] + hourNumber
    if (hour < 0) {
      hour += 24
    } else if (hour >= 24) {
      hour -= 24
    }
    times[0] = hour
    return [
      ('' + times[0]).padStart(2, '0'),
      ('' + times[1]).padStart(2, '0'),
      ('' + times[2]).padStart(2, '0'),
    ].join(this.timeSeparator)
  },
  getDurationInSeconds(startTimeString, endTimeString) {
    const startTimes = startTimeString.split(this.timeSeparator)
    const endTimes = endTimeString.split(this.timeSeparator)
    let seconds =
      +endTimes[2] -
      startTimes[2] +
      (+endTimes[1] - startTimes[1]) * 60 +
      (+endTimes[0] - startTimes[0]) * 3600
    if (seconds < 0) {
      seconds += 86400
    }
    return seconds
  },
  formatSecondsToString(seconds) {
    const hours = Math.floor(seconds / 3600)
    const accumulate = seconds - hours * 3600
    const minutes = Math.floor(accumulate / 60)
    seconds = accumulate - minutes * 60
    let timeString = this.emptyString
    if (hours) {
      timeString += `${hours} JAM `
    }
    if (minutes) {
      timeString += `${minutes} MENIT `
    }
    if (seconds) {
      timeString += `${seconds} DETIK `
    }
    return timeString.trim()
  },
  isLessThanNow(timeString) {
    return timeString < this.currentTimeString()
  },
  isMoreThanNow(timeString) {
    return timeString > this.currentTimeString()
  },
  currentTimeString() {
    const date = new Date()
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  },
}
