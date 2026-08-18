## Purpose

首页导航卡片区域，引导用户前往博客、关于、工具等主要页面，提供清晰的站点导航入口。

## Requirements

### Requirement: 导航卡片区域
首页 SHALL 包含一个导航卡片区域，提供通往主要页面的入口。

#### Scenario: 导航卡片可见
- **WHEN** 首页渲染完成
- **THEN** 导航卡片区域 SHALL 显示至少 2-3 个页面入口卡片

### Requirement: 导航目标页面
导航卡片 SHALL 覆盖站点的主要页面：博客列表、关于页面、工具页面。

#### Scenario: 卡片链接正确
- **WHEN** 用户点击任意导航卡片
- **THEN** 用户 SHALL 被导航到对应的目标页面

### Requirement: 导航卡片视觉设计
每张导航卡片 SHALL 有清晰的标题和简洁的说明文字。

#### Scenario: 卡片内容可读
- **WHEN** 用户查看导航卡片
- **THEN** 卡片 SHALL 显示页面名称和一句简短说明

### Requirement: 导航卡片响应式
导航卡片区域 SHALL 在移动端和桌面端均有良好的布局。

#### Scenario: 移动端导航
- **WHEN** 视口宽度小于 720px
- **THEN** 导航卡片 SHALL 垂直堆叠显示

#### Scenario: 桌面端导航
- **WHEN** 视口宽度大于等于 720px
- **THEN** 导航卡片 SHALL 水平排列
