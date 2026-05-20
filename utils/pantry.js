const STORAGE_KEY = "myFoods"

function getTodayText() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
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
  hasMyFood
}
