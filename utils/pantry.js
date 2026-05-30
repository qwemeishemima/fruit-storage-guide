var STORAGE_KEY = "myFoods"

function padNumber(value) {
  return value < 10 ? "0" + value : String(value)
}

function getTodayText() {
  var now = new Date()
  var year = now.getFullYear()
  var month = padNumber(now.getMonth() + 1)
  var day = padNumber(now.getDate())

  return year + "-" + month + "-" + day
}

function parseDateText(dateText) {
  var date

  if (!dateText) {
    return null
  }

  date = new Date(dateText + "T00:00:00")

  return isNaN(date.getTime()) ? null : date
}

function getDaysBetween(startDate, endDate) {
  var oneDay = 24 * 60 * 60 * 1000
  var startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()
  var endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime()

  return Math.max(0, Math.floor((endTime - startTime) / oneDay))
}

function parseShelfLifeDays(text) {
  var value = String(text || "").trim()
  var weekMatch
  var rangeMatch
  var dayMatch

  if (!value || value.indexOf("不建议") !== -1) {
    return null
  }

  if (value.indexOf("当天") !== -1) {
    return 0
  }

  weekMatch = value.match(/(\d+)\s*周/)
  if (weekMatch) {
    return Number(weekMatch[1]) * 7
  }

  rangeMatch = value.match(/(\d+)\s*-\s*(\d+)\s*天/)
  if (rangeMatch) {
    return Number(rangeMatch[1])
  }

  dayMatch = value.match(/(\d+)\s*天/)
  if (dayMatch) {
    return Number(dayMatch[1])
  }

  return null
}

function getStorageDays(food) {
  var coldDays

  if (!food) {
    return null
  }

  if (food.shelfLife && typeof food.shelfLife.defaultDays === "number") {
    return food.shelfLife.defaultDays
  }

  coldDays = parseShelfLifeDays(food.coldShelfLife)

  if (coldDays !== null) {
    return coldDays
  }

  return parseShelfLifeDays(food.roomTempShelfLife)
}

function getWarningDays(food) {
  if (food && food.shelfLife && typeof food.shelfLife.warningDays === "number") {
    return food.shelfLife.warningDays
  }

  return 1
}

function getPantryFoodStatus(record, food) {
  var storageDays = getStorageDays(food)
  var warningDays = getWarningDays(food)
  var addedDate = parseDateText(record && record.addedAt)
  var passedDays
  var remainingDays

  if (storageDays === null || !addedDate) {
    return {
      type: "unknown",
      text: "留意状态"
    }
  }

  passedDays = getDaysBetween(addedDate, new Date())
  remainingDays = storageDays - passedDays

  if (remainingDays < 0) {
    return {
      type: "expired",
      text: "可能不新鲜"
    }
  }

  if (remainingDays === 0) {
    return {
      type: "soon",
      text: "今天最好吃掉"
    }
  }

  if (remainingDays <= warningDays) {
    return {
      type: "soon",
      text: "尽快吃"
    }
  }

  return {
    type: "fresh",
    text: "新鲜"
  }
}

function getMyFoods() {
  var records = wx.getStorageSync(STORAGE_KEY)

  return Array.isArray(records) ? records : []
}

function saveMyFoods(records) {
  wx.setStorageSync(STORAGE_KEY, records)
}

function hasMyFood(foodId) {
  var records = getMyFoods()
  var i

  for (i = 0; i < records.length; i += 1) {
    if (records[i].foodId === foodId) {
      return true
    }
  }

  return false
}

function addMyFood(food) {
  var records
  var record
  var nextRecords
  var i

  if (!food || !food.id) {
    return {
      added: false,
      reason: "invalid"
    }
  }

  records = getMyFoods()

  for (i = 0; i < records.length; i += 1) {
    if (records[i].foodId === food.id) {
      return {
        added: false,
        reason: "exists"
      }
    }
  }

  record = {
    recordId: food.id + "_" + Date.now(),
    foodId: food.id,
    name: food.name,
    addedAt: getTodayText()
  }

  nextRecords = [record]

  for (i = 0; i < records.length; i += 1) {
    nextRecords.push(records[i])
  }

  saveMyFoods(nextRecords)

  return {
    added: true,
    record: record
  }
}

function removeMyFood(recordId) {
  var records = getMyFoods()
  var nextRecords = []
  var i

  for (i = 0; i < records.length; i += 1) {
    if (records[i].recordId !== recordId) {
      nextRecords.push(records[i])
    }
  }

  saveMyFoods(nextRecords)

  return nextRecords
}

module.exports = {
  getMyFoods: getMyFoods,
  addMyFood: addMyFood,
  removeMyFood: removeMyFood,
  hasMyFood: hasMyFood,
  parseShelfLifeDays: parseShelfLifeDays,
  getPantryFoodStatus: getPantryFoodStatus
}
