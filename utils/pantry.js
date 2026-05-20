const STORAGE_KEY = "myFoods"

function getTodayText() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function parseDateText(dateText) {
  if (!dateText) {
    return null
  }

  const date = new Date(`${dateText}T00:00:00`)

  return Number.isNaN(date.getTime()) ? null : date
}

function getDaysBetween(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000
  const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()
  const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime()

  return Math.max(0, Math.floor((endTime - startTime) / oneDay))
}

function parseShelfLifeDays(text) {
  const value = String(text || "").trim()

  if (!value || value.indexOf("不建议") !== -1 || value.indexOf("当天") !== -1) {
    return value.indexOf("当天") !== -1 ? 0 : null
  }

  const weekMatch = value.match(/(\d+)\s*周/)
  if (weekMatch) {
    return Number(weekMatch[1]) * 7
  }

  const rangeMatch = value.match(/(\d+)\s*-\s*(\d+)\s*天/)
  if (rangeMatch) {
    return Number(rangeMatch[1])
  }

  const dayMatch = value.match(/(\d+)\s*天/)
  if (dayMatch) {
    return Number(dayMatch[1])
  }

  return null
}

function getStorageDays(food) {
  if (!food) {
    return null
  }

  const coldDays = parseShelfLifeDays(food.coldShelfLife)

  if (coldDays !== null) {
    return coldDays
  }

  return parseShelfLifeDays(food.roomTempShelfLife)
}

function getPantryFoodStatus(record, food) {
  const storageDays = getStorageDays(food)
  const addedDate = parseDateText(record && record.addedAt)

  if (storageDays === null || !addedDate) {
    return {
      type: "unknown",
      text: "暂无明确保存期限"
    }
  }

  const passedDays = getDaysBetween(addedDate, new Date())
  const remainingDays = storageDays - passedDays

  if (passedDays === 0) {
    return {
      type: "fresh",
      text: `今天加入，建议 ${Math.max(storageDays, 1)} 天内吃完`
    }
  }

  if (remainingDays > 1) {
    return {
      type: "fresh",
      text: `还剩 ${remainingDays} 天左右`
    }
  }

  if (remainingDays >= 0) {
    return {
      type: "soon",
      text: "建议今天尽快吃"
    }
  }

  return {
    type: "expired",
    text: "可能已不新鲜，请检查后食用"
  }
}

function getMyFoods() {
  const records = wx.getStorageSync(STORAGE_KEY)

  return Array.isArray(records) ? records : []
}

function saveMyFoods(records) {
  wx.setStorageSync(STORAGE_KEY, records)
}

function hasMyFood(foodId) {
  return getMyFoods().some((record) => record.foodId === foodId)
}

function addMyFood(food) {
  if (!food || !food.id) {
    return {
      added: false,
      reason: "invalid"
    }
  }

  const records = getMyFoods()

  if (records.some((record) => record.foodId === food.id)) {
    return {
      added: false,
      reason: "exists"
    }
  }

  const record = {
    recordId: `${food.id}_${Date.now()}`,
    foodId: food.id,
    name: food.name,
    addedAt: getTodayText()
  }

  saveMyFoods([record, ...records])

  return {
    added: true,
    record
  }
}

function removeMyFood(recordId) {
  const records = getMyFoods()
  const nextRecords = records.filter((record) => record.recordId !== recordId)

  saveMyFoods(nextRecords)

  return nextRecords
}

module.exports = {
  getMyFoods,
  addMyFood,
  removeMyFood,
  hasMyFood,
  parseShelfLifeDays,
  getPantryFoodStatus
}
