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
    statusText: status.text,
    statusType: status.type,
    statusPriority: pantryUtils.getStatusPriority(status),
    remainingDays: status.remainingDays,
    statusTip: getStatusTip(status)
  }
}

function getStatusTip(status) {
  if (!status) {
    return "先留意外观和气味，再决定是否食用"
  }

  if (status.type === "expired") {
    return "可能已经过期，请检查气味和状态"
  }

  if (status.type === "soon" && status.remainingDays === 0) {
    return "建议今天吃掉"
  }

  if (status.type === "soon") {
    return "建议今天或明天吃掉"
  }

  if (status.type === "fresh") {
    return "还可以继续保存"
  }

  return "先留意外观和气味，再决定是否食用"
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

function buildPantryOverview(myFoods) {
  var urgentCount = 0
  var i

  for (i = 0; i < myFoods.length; i += 1) {
    if (myFoods[i].statusType === "soon" || myFoods[i].statusType === "expired") {
      urgentCount += 1
    }
  }

  return {
    totalText: "已记录 " + myFoods.length + " 种食材",
    urgentText: urgentCount + " 种建议尽快吃",
    urgentCount: urgentCount
  }
}

Page({
  data: {
    myFoods: [],
    hasMyFoods: false,
    overview: {
      totalText: "已记录 0 种食材",
      urgentText: "0 种建议尽快吃",
      urgentCount: 0
    }
  },

  onShow: function () {
    this.loadMyFoods()
  },

  loadMyFoods: function () {
    var myFoods = buildPantryItems(pantryUtils.getMyFoods())
    var overview = buildPantryOverview(myFoods)

    this.setData({
      myFoods: myFoods,
      hasMyFoods: myFoods.length > 0,
      overview: overview
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
    wx.switchTab({
      url: "/pages/home/home"
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
          hasMyFoods: myFoods.length > 0,
          overview: buildPantryOverview(myFoods)
        })

        wx.showToast({
          title: "已删除",
          icon: "success"
        })
      }
    })
  }
})
