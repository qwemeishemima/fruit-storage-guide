var categoryData = require("../../data/categories")
var foodUtils = require("../../utils/food")
var categories = categoryData.categories

function buildCategories(activeCategoryId) {
  var list = []

  for (var i = 0; i < categories.length; i += 1) {
    var category = categories[i]
    list.push({
      id: category.id,
      name: category.name,
      desc: category.desc,
      icon: category.icon,
      color: category.color,
      isActive: category.id === activeCategoryId
    })
  }

  return list
}

function buildFoodCards(categoryId) {
  var foods = foodUtils.getFoodsByCategory(categoryId)
  var list = []

  for (var i = 0; i < foods.length; i += 1) {
    var food = foods[i]
    list.push({
      id: food.id,
      name: food.name,
      summary: food.summary,
      visibleTags: (food.tags || []).slice(0, 3)
    })
  }

  return list
}

Page({
  data: {
    categories: categories,
    activeCategoryId: "",
    activeCategory: null,
    foods: [],
    hasFoods: false
  },

  onLoad: function () {
    var firstCategory = categories[0]

    if (!firstCategory) {
      return
    }

    this.setActiveCategory(firstCategory.id)
  },

  setActiveCategory: function (categoryId) {
    var activeCategory = null

    for (var i = 0; i < categories.length; i += 1) {
      if (categories[i].id === categoryId) {
        activeCategory = categories[i]
        break
      }
    }

    var foods = buildFoodCards(categoryId)

    this.setData({
      categories: buildCategories(categoryId),
      activeCategoryId: categoryId,
      activeCategory: activeCategory,
      foods: foods,
      hasFoods: foods.length > 0
    })
  },

  onCategoryTap: function (event) {
    var id = event.currentTarget.dataset.id

    if (!id || id === this.data.activeCategoryId) {
      return
    }

    this.setActiveCategory(id)
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
