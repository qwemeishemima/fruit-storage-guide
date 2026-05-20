const { searchFoods, getFoodsByTag, getCategoryById } = require("../../utils/food")

function buildResultCards(foods) {
  return foods.map((food) => {
    const category = getCategoryById(food.category)

    return {
      ...food,
      categoryName: category ? category.name : "未分类",
      visibleTags: (food.tags || []).slice(0, 3)
    }
  })
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

  onLoad(options) {
    if (options.focus === "1") {
      setTimeout(() => {
        this.setData({
          autoFocus: true
        })
      }, 120)
    }

    let tag = ""

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
      results: buildResultCards(getFoodsByTag(tag)),
      hasSearched: true,
      mode: "tag",
      activeTag: tag
    })
  },

  onKeywordInput(event) {
    this.setData({
      keyword: event.detail.value
    })
  },

  onSearch() {
    const keyword = this.data.keyword.trim()

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
      results: buildResultCards(searchFoods(keyword)),
      hasSearched: true,
      mode: "search",
      activeTag: ""
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
