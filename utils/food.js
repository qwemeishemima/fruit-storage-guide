const { foods } = require("../data/foods")
const { categories } = require("../data/categories")

function normalizeKeyword(keyword) {
  return String(keyword || "").trim().toLowerCase()
}

function includesKeyword(value, keyword) {
  return String(value || "").toLowerCase().indexOf(keyword) !== -1
}

function getAllFoods() {
  return foods
}

function getFoodById(id) {
  const targetId = normalizeKeyword(id)

  return foods.find((food) => normalizeKeyword(food.id) === targetId) || null
}

function getFoodsByCategory(categoryId) {
  const targetCategory = normalizeKeyword(categoryId)

  if (!targetCategory) {
    return []
  }

  return foods.filter((food) => normalizeKeyword(food.category) === targetCategory)
}

function searchFoods(keyword) {
  const targetKeyword = normalizeKeyword(keyword)

  if (!targetKeyword) {
    return []
  }

  return foods.filter((food) => {
    const searchableItems = [
      food.name,
      ...(food.aliases || []),
      ...(food.keywords || []),
      ...(food.tags || [])
    ]

    return searchableItems.some((item) => includesKeyword(item, targetKeyword))
  })
}

function getFoodsByTag(tag) {
  const targetTag = normalizeKeyword(tag)

  if (!targetTag) {
    return []
  }

  return foods.filter((food) => {
    return (food.tags || []).some((item) => normalizeKeyword(item) === targetTag)
  })
}

function getCategoryById(categoryId) {
  const targetCategory = normalizeKeyword(categoryId)

  return categories.find((category) => normalizeKeyword(category.id) === targetCategory) || null
}

module.exports = {
  getAllFoods,
  getFoodById,
  getFoodsByCategory,
  searchFoods,
  getFoodsByTag,
  getCategoryById
}
