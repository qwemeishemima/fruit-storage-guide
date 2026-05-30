var foodUtils = require("../../utils/food")
var pantryUtils = require("../../utils/pantry")

function isAttentionStatus(status) {
  return status && (status.type === "soon" || status.type === "expired")
}

function countAttentionFoods(records) {
  var count = 0
  var i
  var food
  var status

  for (i = 0; i < records.length; i += 1) {
    food = foodUtils.getFoodById(records[i].foodId)
    status = pantryUtils.getPantryFoodStatus(records[i], food)

    if (isAttentionStatus(status)) {
      count += 1
    }
  }

  return count
}

Page({
  data: {
    overview: {
      myFoodCount: 0,
      attentionCount: 0,
      foodCount: 0
    },
    usageSteps: [
      {
        order: 1,
        text: "搜索或分类找到食材"
      },
      {
        order: 2,
        text: "查看保存建议"
      },
      {
        order: 3,
        text: "加入我的食材"
      },
      {
        order: 4,
        text: "快到期时及时吃掉"
      }
    ]
  },

  onShow: function () {
    this.refreshOverview()
  },

  refreshOverview: function () {
    var records = pantryUtils.getMyFoods()
    var foods = foodUtils.getAllFoods()

    this.setData({
      overview: {
        myFoodCount: records.length,
        attentionCount: countAttentionFoods(records),
        foodCount: foods.length
      }
    })
  },

  clearMyFoods: function () {
    var that = this

    wx.showModal({
      title: "清空我的食材",
      content: "确定清空全部食材记录吗？此操作不会删除保鲜百科数据。",
      confirmText: "清空",
      confirmColor: "#9b3d32",
      success: function (res) {
        if (!res.confirm) {
          return
        }

        pantryUtils.clearMyFoods()
        that.refreshOverview()

        wx.showToast({
          title: "已清空",
          icon: "success"
        })
      }
    })
  }
})
