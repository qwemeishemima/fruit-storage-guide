var foodUtils = require("../../utils/food")
var pantryUtils = require("../../utils/pantry")

var purchaseTimeOptions = ["今天买的", "昨天买的", "前几天买的"]
var purchaseTimeDayOffsets = [0, 1, 3]

function hasDisplayValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  return String(value || "").trim() !== ""
}

function createInfoItem(label, value) {
  return {
    label: label,
    value: value,
    visible: hasDisplayValue(value)
  }
}

function createInfoSection(title, items, tips) {
  var visibleItems = []
  var visibleTips = tips || []
  var i

  for (i = 0; i < items.length; i += 1) {
    if (items[i].visible) {
      visibleItems.push(items[i])
    }
  }

  return {
    title: title,
    isCore: false,
    items: visibleItems,
    tips: visibleTips,
    hasContent: visibleItems.length > 0 || visibleTips.length > 0
  }
}

function createCoreSection(food) {
  var fridgeAdviceItem = createInfoItem("放不放冰箱", food.fridgeAdvice)
  var shelfLifeItems = []
  var roomTempItem = createInfoItem("常温", food.roomTempShelfLife)
  var coldItem = createInfoItem("冷藏", food.coldShelfLife)

  if (roomTempItem.visible) {
    shelfLifeItems.push(roomTempItem)
  }

  if (coldItem.visible) {
    shelfLifeItems.push(coldItem)
  }

  return {
    title: "怎么放",
    isCore: true,
    fridgeAdviceItem: fridgeAdviceItem.visible ? fridgeAdviceItem : null,
    shelfLifeItems: shelfLifeItems,
    items: [],
    tips: [],
    hasContent: fridgeAdviceItem.visible || shelfLifeItems.length > 0
  }
}

function getVisibleTips(tips) {
  var visibleTips = []
  var sourceTips = tips || []
  var i

  for (i = 0; i < sourceTips.length; i += 1) {
    if (hasDisplayValue(sourceTips[i])) {
      visibleTips.push(sourceTips[i])
    }
  }

  return visibleTips
}

function buildInfoSections(food, visibleTips) {
  return [
    createCoreSection(food),
    createInfoSection("保存方法", [
      createInfoItem("怎么保存", food.storageMethod),
      createInfoItem("密封", food.sealedAdvice),
      createInfoItem("怕水", food.waterAdvice)
    ]),
    createInfoSection("注意事项", [
      createInfoItem("乙烯", food.ethyleneAdvice),
      createInfoItem("买回后", food.afterPurchaseAdvice)
    ], visibleTips)
  ]
}

function padNumber(value) {
  return value < 10 ? "0" + value : String(value)
}

function getDateTextByOffset(dayOffset) {
  var date = new Date()

  date.setDate(date.getDate() - dayOffset)

  return date.getFullYear() + "-" + padNumber(date.getMonth() + 1) + "-" + padNumber(date.getDate())
}

Page({
  data: {
    food: null,
    categoryName: "",
    infoSections: [],
    isInPantry: false
  },

  onLoad: function (options) {
    var food = foodUtils.getFoodById(options.id)
    var category
    var infoSections
    var visibleTips

    if (!food) {
      this.setData({
        food: null,
        categoryName: "",
        infoSections: [],
        isInPantry: false
      })
      return
    }

    category = foodUtils.getCategoryById(food.category)
    visibleTips = getVisibleTips(food.tips)
    infoSections = buildInfoSections(food, visibleTips)

    this.setData({
      food: food,
      categoryName: category ? category.name : "未分类",
      infoSections: infoSections,
      isInPantry: pantryUtils.hasMyFood(food.id)
    })
  },

  handlePantryAction: function () {
    if (this.data.isInPantry) {
      wx.switchTab({
        url: "/pages/pantry/pantry"
      })
      return
    }

    this.showPurchaseTimePicker()
  },

  showPurchaseTimePicker: function () {
    var that = this

    wx.showActionSheet({
      alertText: "什么时候买的？",
      itemList: purchaseTimeOptions,
      success: function (res) {
        var dayOffset = purchaseTimeDayOffsets[res.tapIndex]

        that.addToPantry(getDateTextByOffset(dayOffset || 0))
      },
      fail: function () {}
    })
  },

  addToPantry: function (addedAt) {
    var result

    if (!this.data.food) {
      return
    }

    result = pantryUtils.addMyFood(this.data.food, {
      addedAt: addedAt
    })

    if (!result.added && result.reason === "exists") {
      wx.showToast({
        title: "已经在我的食材中",
        icon: "none"
      })
      return
    }

    if (!result.added) {
      wx.showToast({
        title: "添加失败",
        icon: "none"
      })
      return
    }

    this.setData({
      isInPantry: true
    })

    wx.showToast({
      title: "已加入我的食材",
      icon: "success"
    })
  }
})
