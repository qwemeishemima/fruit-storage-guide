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
    statusType: status.type,
    statusPriority: pantryUtils.getStatusPriority(status),
    remainingDays: status.remainingDays
  }
}

function comparePantryItems(a, b) {
  if (a.statusPriority !== b.statusPriority) {
    return a.statusPriority - b.statusPriority
  }

  if (a.remainingDays !== null && b.remainingDays !== null && a.remainingDays !== b.remainingDays) {
    return a.remainingDays - b.remainingDays
  }

  return String(b.addedAt || "").localeCompare(String(a.addedAt || ""))
}

function buildPantryItems(records) {
  var list = []

  for (var i = 0; i < records.length; i += 1) {
    list.push(buildPantryItem(records[i]))
  }

  list.sort(comparePantryItems)

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

  goToAddFood: function () {
    wx.navigateTo({
      url: "/pages/category/category"
    })
  },

  deleteRecord: function (event) {
    var recordId = event.currentTarget.dataset.recordId
    var that = this

    if (!recordId) {
      return
    }

    wx.showModal({
      title: "删除食材",
      content: "确定从我的食材中移除这个食材吗？",
      confirmText: "删除",
      confirmColor: "#9b3d32",
      success: function (res) {
        var nextRecords
        var myFoods

        if (!res.confirm) {
          return
        }

        nextRecords = pantryUtils.removeMyFood(recordId)
        myFoods = buildPantryItems(nextRecords)

        that.setData({
          myFoods: myFoods,
          hasMyFoods: nextRecords.length > 0
        })

        wx.showToast({
          title: "已删除",
          icon: "success"
        })
      }
    })
  }
})
