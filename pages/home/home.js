Page({
  data: {
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

  goToSearch() {
    wx.navigateTo({
      url: "/pages/search/search"
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
  }
})
