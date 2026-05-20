var foodUtils = require("../../utils/food")

function buildResultCards(foods) {
  var list = []

  for (var i = 0; i < foods.length; i += 1) {
    var food = foods[i]
    var category = foodUtils.getCategoryById(food.category)

    list.push({
      id: food.id,
      name: food.name,
      summary: food.summary,
      categoryName: category ? category.name : "未分类",
      visibleTags: (food.tags || []).slice(0, 3)
    })
  }

  return list
}

Page({
  data: {
    keyword: "",
    results: [],
    hasSearched: false,
    mode: "search",
    activeTag: "",
    autoFocus: false
  },

  onLoad: function (options) {
    var that = this

    if (options.focus === "1") {
      setTimeout(function () {
        that.setData({
          autoFocus: true
        })
      }, 120)
    }

    var tag = ""

    try {
      tag = decodeURIComponent(options.tag || "").trim()
    } catch (error) {
      tag = String(options.tag || "").trim()
    }

    if (!tag) {
      return
    }

    this.setData({
      keyword: "",
      results: buildResultCards(foodUtils.getFoodsByTag(tag)),
      hasSearched: true,
      mode: "tag",
      activeTag: tag
    })
  },

  onKeywordInput: function (event) {
    this.setData({
      keyword: event.detail.value
    })
  },

  onSearch: function () {
    var keyword = this.data.keyword.trim()

    if (!keyword) {
      this.setData({
        results: [],
        hasSearched: false,
        mode: "search",
        activeTag: ""
      })
      return
    }

    this.setData({
      results: buildResultCards(foodUtils.searchFoods(keyword)),
      hasSearched: true,
      mode: "search",
      activeTag: ""
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
