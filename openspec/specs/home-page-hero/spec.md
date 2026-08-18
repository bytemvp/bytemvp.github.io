## Purpose

首页 Hero 区域——个人品牌展示、核心标语与主行动按钮，是用户进入站点后的第一视觉焦点。

## Requirements

### Requirement: Hero 区域内容
首页 SHALL 包含一个 Hero 区域，展示个人名称/品牌、一句话标语和主行动按钮。

#### Scenario: Hero 内容可见
- **WHEN** 首页加载完成
- **THEN** 用户 SHALL 能看到个人名称/品牌标识、核心标语文字和至少一个行动按钮

### Requirement: Hero 行动按钮
Hero 区域的主行动按钮 SHALL 链接到博客或关于页面。

#### Scenario: 点击主按钮导航
- **WHEN** 用户点击 Hero 区域的主行动按钮
- **THEN** 用户 SHALL 被导航到对应的目标页面

### Requirement: Hero 响应式布局
Hero 区域 SHALL 在移动端和桌面端均有良好的视觉表现。

#### Scenario: 移动端 Hero
- **WHEN** 视口宽度小于 720px
- **THEN** Hero 内容 SHALL 垂直居中排列，文字和按钮保持可读性

#### Scenario: 桌面端 Hero
- **WHEN** 视口宽度大于等于 720px
- **THEN** Hero 区域 SHALL 利用水平空间展示更丰富的布局
