var foodUtils = require("../../utils/food")
var categoryData = require("../../data/categories")

var homeCategoryLimit = 4
var commonFoodLimit = 6
var dailyTips = [
  "绿叶菜别直接塞冰箱，先用厨房纸包一下，再装袋冷藏。",
  "香蕉未熟时别放冰箱，熟后想延缓变软再冷藏更合适。",
  "土豆要避光通风保存，别和洋葱长期放在一起。",
  "草莓买回后先别清洗，吃之前再洗，更不容易坏。",
  "西红柿未熟时常温放，熟透后想多放一两天再冷藏。",
  "蘑菇怕潮，冷藏时可以用厨房纸吸走多余水汽。",
  "葱姜蒜要注意通风干燥，潮湿环境更容易发霉。",
  "切开的水果要密封冷藏，并尽量当天或第二天吃完。"
]

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

function getTodayTip() {
  var today = new Date()
  var startOfYear = new Date(today.getFullYear(), 0, 0)
  var dayOfYear = Math.floor((today - startOfYear) / 86400000)
  var tipIndex = dayOfYear % dailyTips.length

  return dailyTips[tipIndex]
}

function getDateSeed() {
  var today = new Date()

  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
}

function getStableFoodScore(food, seed) {
  var source = String(food.id || food.name || "")
  var score = seed
  var i

  for (i = 0; i < source.length; i += 1) {
    score = (score * 31 + source.charCodeAt(i)) % 1000003
  }

  return score
}

function getDailyCommonFoods() {
  var foods = foodUtils.getAllFoods().slice()
  var seed = getDateSeed()
  var result = []
  var i
  var limit

  foods.sort(function (a, b) {
    var scoreDiff = getStableFoodScore(a, seed) - getStableFoodScore(b, seed)

    if (scoreDiff !== 0) {
      return scoreDiff
    }

    return String(a.id || a.name || "").localeCompare(String(b.id || b.name || ""))
  })

  limit = Math.min(commonFoodLimit, foods.length)

  for (i = 0; i < limit; i += 1) {
    result.push(buildFoodCard(foods[i]))
  }

  return result
}

Page({
  data: {
    todayTip: "",
    commonFoods: [],
    categoryEntries: categoryData.categories.slice(0, homeCategoryLimit),
    quickEntries: [
      {
        name: "别放冰箱",
        tag: "不能放冰箱"
      },
      {
        name: "先别清洗",
        tag: "怕水"
      },
      {
        name: "绿叶菜这样放",
        tag: "叶菜"
      },
      {
        name: "快点吃掉",
        tag: "容易坏"
      }
    ]
  },

  onLoad: function () {
    this.setData({
      todayTip: getTodayTip(),
      commonFoods: getDailyCommonFoods()
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

  goToCategory: function (event) {
    var id = event.currentTarget.dataset.id
    var url = "/pages/category/category"

    if (id) {
      url += "?categoryId=" + encodeURIComponent(id)
    }

    wx.navigateTo({
      url: url
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
