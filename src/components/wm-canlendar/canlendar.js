// 获取当前月第一个是礼拜几
const getFirstDay = (year, month) => {
  return new Date(year, month - 1, 1).getDay()
}

// 获取当前月最后一天是几号
const getLastDate = (year, month) => {
  let nextMonth = month
  if (nextMonth > 11) {
    year++
  }
  return new Date(new Date(year, nextMonth, 1).getTime() - 1000 * 60 * 60 * 24).getDate()
}

// 获取当前月的最后一天是礼拜几
const getLastDay = (year, month) => {
  return new Date(year, month - 1, getLastDate(year, month)).getDay()
}

export const getCanlendar = (year, month, isGetLunar = false, isCompletion = true) => {
  let canlendars = []
  // 获取当前月第一个是礼拜几 礼拜天 是0  礼拜一是 1
  const firstDay = getFirstDay(year, month)
  // 获取当前月最后一天是几号
  const lastDate = getLastDate(year, month)
  // 获取当前月的最后一天是礼拜几
  const lastDay = getLastDay(year, month)
  // 上个月的最后一天是几号
  const prevLastDate = getLastDate(year, month - 1)

  let lines = []

  // 日历第一行
  for (let i = 1; i <= 7; i++) {
    if (i <= firstDay) {
      // 第一行包含了上个月的信息
      let currentY = year
      let currentM = month - 1
      if (currentM < 1) {
        currentY--
        currentM = 12
      }
      lines.push({
        dateStr: `${currentY}/${currentM}/${prevLastDate - (firstDay - i)}`,
        timeStamp: new Date(currentY, currentM, prevLastDate - (firstDay - i)).getTime(),
        val: prevLastDate - (firstDay - i),
        enabled: false,
        year: currentY,
        month: currentM
      })
    } else {
      lines.push({
        dateStr: `${year}/${month}/${i - firstDay}`,
        timeStamp: new Date(year, month, i - firstDay).getTime(),
        val: i - firstDay,
        enabled: true,
        year,
        month
      })
    }
  }

  canlendars.push(lines)
  lines = []

  let count = 0
  for (let i = (7 - firstDay + 1); i <= lastDate; i++) {
    const _Date = {
      dateStr: `${year}/${month}/${i}`,
      timeStamp: new Date(year, month, i).getTime(),
      val: i,
      enabled: true,
      year,
      month
    }
    // 7天为一个星期
    if (count < 7) {
      lines.push(_Date)
    } else {
      canlendars.push(lines)
      lines = []
      lines.push(_Date)
      count = 0
    }

    if (i === lastDate && count === 6) {
      canlendars.push(lines)
    }

    count++
  }

  lines = []
  let nextMonth = null
  if (lastDay < 6) {
    for (let i = 0; i <= 6; i++) {
      if (i <= lastDay) {
        lines.push({
          dateStr: `${year}/${month}/${lastDate - (lastDay - i)}`,
          timeStamp: new Date(year, month, lastDate - (lastDay - i)).getTime(),
          val: lastDate - (lastDay - i),
          enabled: true,
          year,
          month
        })
      } else {
        nextMonth = month + 1
        let currentY = year
        let currentM = month + 1
        if (currentM > 12) {
          currentY++
          currentM = 1
        }
        lines.push({
          dateStr: `${currentY}/${currentM}/${i - lastDay}`,
          timeStamp: new Date(currentY, currentM, i - lastDay).getTime(),
          val: i - lastDay,
          enabled: false,
          year: currentY,
          month: currentM
        })
      }
    }

    canlendars.push(lines)
  }
  if (canlendars.length === 5 && isCompletion) {
    // 补全第6行信息
    lines = []
    const nextMonthLastDay = canlendars[canlendars.length - 1][canlendars[canlendars.length - 1].length - 1].val
    const completionMonth = nextMonth !== null ? nextMonth : month++
    const completionDay = nextMonth !== null ? nextMonthLastDay + 1 : 1
    for (let i = completionDay; i <= (completionDay + 6); i++) {
      let currentY = year
      let currentM = completionMonth
      if (currentM > 12) {
        currentY++
        currentM = 1
      }
      lines.push({
        dateStr: `${currentY}/${currentM}/${i}`,
        timeStamp: new Date(currentY, currentM, i).getTime(),
        val: i,
        enabled: false,
        year: currentY,
        month: currentM
      })
    }
    canlendars.push(lines)
    lines = []
  }

  return canlendars
}
