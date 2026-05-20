var foodUtils = require("../../utils/food")
var pantryUtils = require("../../utils/pantry")

function buildPantryItem(record) {
  var food = foodUtils.getFoodById(record.foodId)
  var status = pantryUtils.getPantryFoodStatus(record, food)

  return {
    recordId: record.recordId,
    foodId: record.foodId,
    name: record.name,
    addedAt: record.addedAt,
    summary: food ? food.summary : "暂无保存结论",
    statusText: status.text,
    statusType: status.type
  }
}

function buildPantryItems(records) {
  var list = []

  for (var i = 0; i < records.length; i += 1) {
    list.push(buildPantryItem(records[i]))
  }

  return list
}

Page({
  data: {
    myFoods: [],
    hasMyFoods: false
  },

  onShow: function () {
    this.loadMyFoods()
  },

  loadMyFoods: function () {
    var myFoods = buildPantryItems(pantryUtils.getMyFoods())

    this.setData({
      myFoods: myFoods,
      hasMyFoods: myFoods.length > 0
    })
  },

  goToDetail: function (event) {
    var id = event.currentTarget.dataset.id

    if (!id) {
      return
    }

    wx.navigateTo({
      url: "/pages/detail/detail?id=" + id
    })
  },

  deleteRecord: function (event) {
    var recordId = event.currentTarget.dataset.recordId

    if (!recordId) {
      return
    }

    var nextRecords = pantryUtils.removeMyFood(recordId)
    var myFoods = buildPantryItems(nextRecords)

    this.setData({
      myFoods: myFoods,
      hasMyFoods: nextRecords.length > 0
    })

    wx.showToast({
      title: "已删除",
      icon: "success"
    })
  }
})
