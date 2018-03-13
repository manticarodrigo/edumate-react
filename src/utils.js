function timeDifference(current, previous) {

  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const milliSecondsPerMonth = milliSecondsPerDay * 30
  const milliSecondsPerYear = milliSecondsPerDay * 365

  const elapsed = current - previous

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now'
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 min ago'
  }

  else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed/milliSecondsPerMinute) + ' minutes ago'
  }

  else if (elapsed < milliSecondsPerDay ) {
    return Math.round(elapsed/milliSecondsPerHour ) + ' hours ago'
  }

  else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed/milliSecondsPerDay) + ' days ago'
  }

  else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed/milliSecondsPerMonth) + ' months ago'
  }

  else {
    return Math.round(elapsed/milliSecondsPerYear ) + ' years ago'
  }
}

function timeLeft(current, endDate) {

  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const milliSecondsPerMonth = milliSecondsPerDay * 30
  const milliSecondsPerYear = milliSecondsPerDay * 365

  const difference = endDate - current

  if (difference < milliSecondsPerMinute / 3) {
    return 'Final results'
  }

  if (difference < milliSecondsPerMinute) {
    return 'less than 1 min left'
  }

  else if (difference < milliSecondsPerHour) {
    return Math.round(difference/milliSecondsPerMinute) + ' minutes left'
  }

  else if (difference < milliSecondsPerDay ) {
    return Math.round(difference/milliSecondsPerHour ) + ' hours left'
  }

  else if (difference < milliSecondsPerMonth) {
    return Math.round(difference/milliSecondsPerDay) + ' days left'
  }

  else if (difference < milliSecondsPerYear) {
    return Math.round(difference/milliSecondsPerMonth) + ' months left'
  }

  else {
    return Math.round(difference/milliSecondsPerYear ) + ' years left'
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime()
  const updated = new Date(date).getTime()
  return timeDifference(now, updated)
}

export function timeLeftForDate(date) {
  const now = new Date().getTime()
  const endDate = new Date(date).getTime()
  return timeLeft(now, endDate)
}