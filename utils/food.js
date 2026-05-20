var foodsData = require("../data/foods")
var categoriesData = require("../data/categories")

var foods = foodsData.foods
var categories = categoriesData.categories

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
  var targetId = normalizeKeyword(id)
  var i

  for (i = 0; i < foods.length; i += 1) {
    if (normalizeKeyword(foods[i].id) === targetId) {
      return foods[i]
    }
  }

  return null
}

function getFoodsByCategory(categoryId) {
  var targetCategory = normalizeKeyword(categoryId)
  var result = []
  var i

  if (!targetCategory) {
    return result
  }

  for (i = 0; i < foods.length; i += 1) {
    if (normalizeKeyword(foods[i].category) === targetCategory) {
      result.push(foods[i])
    }
  }

  return result
}

function foodMatchesKeyword(food, targetKeyword) {
  var searchableItems = []
  var aliases = food.aliases || []
  var keywords = food.keywords || []
  var tags = food.tags || []
  var i

  searchableItems.push(food.name)

  for (i = 0; i < aliases.length; i += 1) {
    searchableItems.push(aliases[i])
  }

  for (i = 0; i < keywords.length; i += 1) {
    searchableItems.push(keywords[i])
  }

  for (i = 0; i < tags.length; i += 1) {
    searchableItems.push(tags[i])
  }

  for (i = 0; i < searchableItems.length; i += 1) {
    if (includesKeyword(searchableItems[i], targetKeyword)) {
      return true
    }
  }

  return false
}

function searchFoods(keyword) {
  var targetKeyword = normalizeKeyword(keyword)
  var result = []
  var i

  if (!targetKeyword) {
    return result
  }

  for (i = 0; i < foods.length; i += 1) {
    if (foodMatchesKeyword(foods[i], targetKeyword)) {
      result.push(foods[i])
    }
  }

  return result
}

function getFoodsByTag(tag) {
  var targetTag = normalizeKeyword(tag)
  var result = []
  var i
  var j
  var tags

  if (!targetTag) {
    return result
  }

  for (i = 0; i < foods.length; i += 1) {
    tags = foods[i].tags || []

    for (j = 0; j < tags.length; j += 1) {
      if (normalizeKeyword(tags[j]) === targetTag) {
        result.push(foods[i])
        break
      }
    }
  }

  return result
}

function getCategoryById(categoryId) {
  var targetCategory = normalizeKeyword(categoryId)
  var i

  for (i = 0; i < categories.length; i += 1) {
    if (normalizeKeyword(categories[i].id) === targetCategory) {
      return categories[i]
    }
  }

  return null
}

module.exports = {
  getAllFoods: getAllFoods,
  getFoodById: getFoodById,
  getFoodsByCategory: getFoodsByCategory,
  searchFoods: searchFoods,
  getFoodsByTag: getFoodsByTag,
  getCategoryById: getCategoryById
}
