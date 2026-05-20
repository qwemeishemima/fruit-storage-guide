var foodUtils = require("../../utils/food")
var pantryUtils = require("../../utils/pantry")

Page({
  data: {
    food: null,
    categoryName: "",
    infoItems: [],
    isInPantry: false
  },

  onLoad: function (options) {
    var food = foodUtils.getFoodById(options.id)
    var category
    var infoItems

    if (!food) {
      this.setData({
        food: null,
        categoryName: "",
        infoItems: [],
        isInPantry: false
      })
      return
    }

    category = foodUtils.getCategoryById(food.category)
    infoItems = [
      {
        label: "是否建议冷藏",
        value: food.fridgeAdvice
      },
      {
        label: "推荐保存方式",
        value: food.storageMethod
      },
      {
        label: "常温保存时间",
        value: food.roomTempShelfLife
      },
      {
        label: "冷藏保存时间",
        value: food.coldShelfLife
      },
      {
        label: "密封建议",
        value: food.sealedAdvice
      },
      {
        label: "怕水/干燥建议",
        value: food.waterAdvice
      },
      {
        label: "乙烯影响",
        value: food.ethyleneAdvice
      },
      {
        label: "买回后处理",
        value: food.afterPurchaseAdvice
      }
    ]

    this.setData({
      food: food,
      categoryName: category ? category.name : "未分类",
      infoItems: infoItems,
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

    this.addToPantry()
  },

  addToPantry: function () {
    var result

    if (!this.data.food) {
      return
    }

    result = pantryUtils.addMyFood(this.data.food)

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
