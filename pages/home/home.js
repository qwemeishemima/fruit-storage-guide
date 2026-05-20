const { getFoodById } = require("../../utils/food")

const recommendFoodId = "banana"
const commonFoodIds = ["tomato", "cucumber", "potato", "strawberry", "lettuce"]

function buildFoodCard(food) {
  if (!food) {
    return null
  }

  return {
    ...food,
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

  onLoad() {
    const recommendFood = buildFoodCard(getFoodById(recommendFoodId))
    const commonFoods = commonFoodIds
      .map((id) => buildFoodCard(getFoodById(id)))
      .filter(Boolean)

    this.setData({
      recommendFood,
      commonFoods
    })
  },

  goToSearch() {
    wx.navigateTo({
      url: "/pages/search/search?focus=1"
    })
  },

  goToTag(event) {
    const { tag } = event.currentTarget.dataset

    if (!tag) {
      return
    }

    wx.navigateTo({
      url: `/pages/search/search?tag=${encodeURIComponent(tag)}`
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
  }
})
