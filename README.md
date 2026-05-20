# 蔬果怎么放

“蔬果怎么放”是一款面向普通家庭用户的微信小程序原生项目，用来快速查询水果、蔬菜等常见食材的保存方式。

一句话定位：

> 查怎么存，记别放坏。

产品说明：

> 蔬菜水果保存指南，记录食材保鲜期，提醒别放坏。

## 核心功能

当前 MVP 已支持：

- 首页搜索入口和快捷筛选入口。
- 按关键词搜索食材，支持名称、别名、关键词和标签匹配。
- 按分类浏览食材。
- 查看食材详情，包括冷藏建议、保存方式、保存时间、密封建议、怕水/干燥建议、乙烯影响、保存小贴士等。
- 从详情页把食材加入“我的食材”。
- “我的食材”使用本地 storage 保存记录。
- 在“我的食材”中查看、删除已添加食材。
- 根据添加日期和保存时间粗略展示本地预计食用状态。

当前阶段不包含：

- 云开发。
- 登录或用户体系。
- 订阅消息或真实提醒。
- AI 保存建议。
- 后台管理系统。

## 技术栈

- 微信小程序原生开发。
- WXML / WXSS / JavaScript。
- CommonJS 模块导出与引用。
- 本地静态数据。
- 微信小程序本地存储 `wx.getStorageSync` / `wx.setStorageSync`。

未使用：

- Taro
- UniApp
- Vue
- React
- 第三方 UI 框架

## 目录结构

```text
.
├── app.js
├── app.json
├── app.wxss
├── data/
│   ├── categories.js      # 食材分类数据
│   └── foods.js           # 食材静态数据
├── pages/
│   ├── home/              # 首页
│   ├── search/            # 搜索与标签筛选页
│   ├── detail/            # 食材详情页
│   ├── category/          # 分类页
│   ├── pantry/            # 我的食材页
│   └── profile/           # 我的页
├── utils/
│   ├── food.js            # 食材查询工具函数
│   └── pantry.js          # 我的食材本地存储工具函数
├── project.config.json    # 微信开发者工具项目配置
├── sitemap.json
└── AGENTS.md              # Codex 项目开发协作约束
```

## 本地运行方式

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本仓库根目录。
4. AppID 使用 `project.config.json` 中配置的 AppID，或选择测试号。
5. 不启用云开发。
6. 点击“编译”运行小程序。

运行后可验证：

- 首页搜索框进入搜索页并自动聚焦。
- 首页快捷入口进入对应标签筛选结果。
- 分类页切换分类并查看真实食材列表。
- 搜索 `番茄` 可找到 `西红柿`，搜索 `青瓜` 可找到 `黄瓜`，搜索 `马铃薯` 可找到 `土豆`。
- 点击食材卡片进入详情页。
- 在详情页点击右下角 `+` 将食材加入“我的食材”。
- 在“我的食材”页查看预计食用状态并删除记录。

## 数据说明

食材数据集中维护在 `data/foods.js`，分类数据集中维护在 `data/categories.js`。

页面不应重复硬编码完整食材数据。需要读取食材时，优先使用 `utils/food.js` 中的工具函数：

- `getAllFoods()`
- `getFoodById(id)`
- `getFoodsByCategory(categoryId)`
- `searchFoods(keyword)`
- `getFoodsByTag(tag)`
- `getCategoryById(categoryId)`

“我的食材”相关本地存储逻辑集中在 `utils/pantry.js`，storage key 为：

```text
myFoods
```

记录结构：

```js
{
  recordId,
  foodId,
  name,
  addedAt
}
```

完整食材信息仍从静态数据中读取，避免本地 storage 中的数据和食材库更新后不一致。

## 开发原则

- 一次只做一个模块。
- 优先使用最简单、最稳、最适合 MVP 的方案。
- 不提前引入云开发、登录、消息通知、AI 等复杂能力。
- 不在页面中重复维护食材数据。
- UI 保持清爽、自然、生活化，适合家庭日常工具。
