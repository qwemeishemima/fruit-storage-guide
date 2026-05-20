var foodUtils = require("../../utils/food")

var recommendFoodId = "banana"
var commonFoodIds = ["tomato", "cucumber", "potato", "strawberry", "lettuce"]

function buildFoodCard(food) {
  if (!food) {
    return null
  }

  return {
    id: food.id,
    name: food.name,
    summary: food.summary,
    visibleTags: (food.tags || []).slice(0, 3)
  }
}

Page({
  data: {
    recommendFood: null,
    commonFoods: [],
    quickEntries: [
      {
        name: "不能放冰箱",
        tag: "不能放冰箱"
      },
      {
        name: "必须冷藏",
        tag: "必须冷藏"
      },
      {
        name: "容易坏",
        tag: "容易坏"
      },
      {
        name: "水果",
        tag: "水果"
      },
      {
        name: "蔬菜",
        tag: "蔬菜"
      }
    ]
  },

  onLoad: function () {
    var recommendFood = buildFoodCard(foodUtils.getFoodById(recommendFoodId))
    var commonFoods = []

    for (var i = 0; i < commonFoodIds.length; i += 1) {
      var food = buildFoodCard(foodUtils.getFoodById(commonFoodIds[i]))

      if (food) {
        commonFoods.push(food)
      }
    }

    this.setData({
      recommendFood: recommendFood,
      commonFoods: commonFoods
    })
  },

  goToSearch: function () {
    wx.navigateTo({
      url: "/pages/search/search?focus=1"
    })
  },

  goToTag: function (event) {
    var tag = event.currentTarget.dataset.tag

    if (!tag) {
      return
    }

    wx.navigateTo({
      url: "/pages/search/search?tag=" + encodeURIComponent(tag)
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
  }
})
