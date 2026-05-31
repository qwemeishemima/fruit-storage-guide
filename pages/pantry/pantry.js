var foodUtils = require("../../utils/food")
var pantryUtils = require("../../utils/pantry")

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

function getPurchaseTimeText(addedAt) {
  var addedDate = parseDateText(addedAt)
  var days

  if (!addedDate) {
    return addedAt || "时间未知"
  }

  days = getDaysBetween(addedDate, new Date())

  if (days === 0) {
    return "今天买的"
  }

  if (days === 1) {
    return "昨天买的"
  }

  if (days === 2) {
    return "前天买的"
  }

  return "前几天买的"
}

function buildPantryItem(record) {
  var food = foodUtils.getFoodById(record.foodId)
  var status = pantryUtils.getPantryFoodStatus(record, food)

  return {
    recordId: record.recordId,
    foodId: record.foodId,
    name: record.name,
    addedAt: record.addedAt,
    purchaseTimeText: getPurchaseTimeText(record.addedAt),
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

function buildFoodGroups(myFoods) {
  var groupConfigs = [
    {
      key: "soon",
      title: "尽快吃掉",
      statusTypes: ["soon"]
    },
    {
      key: "fresh",
      title: "还算新鲜",
      statusTypes: ["fresh"]
    },
    {
      key: "expired",
      title: "可能不新鲜",
      statusTypes: ["expired"]
    },
    {
      key: "unknown",
      title: "保存期不确定",
      statusTypes: ["unknown"]
    }
  ]
  var groups = []
  var i
  var j
  var groupItems
  var item

  for (i = 0; i < groupConfigs.length; i += 1) {
    groupItems = []

    for (j = 0; j < myFoods.length; j += 1) {
      item = myFoods[j]

      if (groupConfigs[i].statusTypes.indexOf(item.statusType) !== -1) {
        groupItems.push(item)
      }
    }

    if (groupItems.length > 0) {
      groups.push({
        key: groupConfigs[i].key,
        title: groupConfigs[i].title,
        count: groupItems.length,
        items: groupItems
      })
    }
  }

  return groups
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
    foodGroups: [],
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
      foodGroups: buildFoodGroups(myFoods),
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
          foodGroups: buildFoodGroups(myFoods),
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
