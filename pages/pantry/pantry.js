const { getFoodById } = require("../../utils/food")
const { getMyFoods, removeMyFood, getPantryFoodStatus } = require("../../utils/pantry")

function buildPantryItem(record) {
  const food = getFoodById(record.foodId)
  const status = getPantryFoodStatus(record, food)

  return {
    ...record,
    summary: food ? food.summary : "暂无保存结论",
    statusText: status.text,
    statusType: status.type
  }
}

Page({
  data: {
    myFoods: [],
    hasMyFoods: false
  },

  onShow() {
    this.loadMyFoods()
  },

  loadMyFoods() {
    const myFoods = getMyFoods().map(buildPantryItem)

    this.setData({
      myFoods,
      hasMyFoods: myFoods.length > 0
    })
  },

  goToDetail(event) {
    const { id } = event.currentTarget.dataset

    if (!id) {
      return
    }

    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  deleteRecord(event) {
    const { recordId } = event.currentTarget.dataset

    if (!recordId) {
      return
    }

    const nextRecords = removeMyFood(recordId)

    this.setData({
      myFoods: nextRecords.map(buildPantryItem),
      hasMyFoods: nextRecords.length > 0
    })

    wx.showToast({
      title: "已删除",
      icon: "success"
    })
  }
})
