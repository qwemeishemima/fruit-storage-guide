const { categories } = require("../../data/categories")
const { getFoodsByCategory } = require("../../utils/food")

function buildCategories(activeCategoryId) {
  return categories.map((category) => ({
    ...category,
    isActive: category.id === activeCategoryId
  }))
}

function buildFoodCards(categoryId) {
  return getFoodsByCategory(categoryId).map((food) => ({
    ...food,
    visibleTags: (food.tags || []).slice(0, 3)
  }))
}

Page({
  data: {
    categories,
    activeCategoryId: "",
    activeCategory: null,
    foods: [],
    hasFoods: false
  },

  onLoad() {
    const firstCategory = categories[0]

    if (!firstCategory) {
      return
    }

    this.setActiveCategory(firstCategory.id)
  },

  setActiveCategory(categoryId) {
    const activeCategory = categories.find((category) => category.id === categoryId) || null
    const foods = buildFoodCards(categoryId)

    this.setData({
      categories: buildCategories(categoryId),
      activeCategoryId: categoryId,
      activeCategory,
      foods,
      hasFoods: foods.length > 0
    })
  },

  onCategoryTap(event) {
    const { id } = event.currentTarget.dataset

    if (!id || id === this.data.activeCategoryId) {
      return
    }

    this.setActiveCategory(id)
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
