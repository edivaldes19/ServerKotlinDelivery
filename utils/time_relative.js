module.exports = (current, previous) => {
    let msPerMinute = 60 * 1000
    let msPerHour = msPerMinute * 60
    let msPerDay = msPerHour * 24
    let msPerMonth = msPerDay * 30
    let msPerYear = msPerDay * 365
    let elapsed = current - previous
    if (elapsed < msPerMinute) {
        return 'hace ' + Math.round(elapsed / 1000) + ' segundo(s).'
    } else if (elapsed < msPerHour) {
        return 'hace ' + Math.round(elapsed / msPerMinute) + ' minuto(s).'
    } else if (elapsed < msPerDay) {
        return 'hace ' + Math.round(elapsed / msPerHour) + ' hora(s).'
    } else if (elapsed < msPerMonth) {
        return 'aproximadamente ' + Math.round(elapsed / msPerDay) + ' día(s).'
    } else if (elapsed < msPerYear) {
        return 'aproximadamente ' + Math.round(elapsed / msPerMonth) + ' mes(es).'
    } else {
        return 'aproximadamente ' + Math.round(elapsed / msPerYear) + ' año(s).'
    }
}