## Purpose

首页项目/作品展示区块，替代原有的文章列表，向访客展示技术能力和代表性项目。

## Requirements

### Requirement: 项目展示区域
首页 SHALL 包含一个项目/作品展示区域，展示至少 2-4 个代表性项目。

#### Scenario: 项目卡片显示
- **WHEN** 首页渲染完成
- **THEN** 展示区域 SHALL 显示项目卡片，每张卡片包含项目名称和简短描述

### Requirement: 项目信息结构
每张项目卡片 SHALL 包含项目名称和一句话描述。

#### Scenario: 项目内容完整
- **WHEN** 用户查看项目卡片
- **THEN** 卡片 SHALL 显示项目名称和简洁的功能描述

### Requirement: 展示区域响应式
项目展示区域 SHALL 在不同屏幕尺寸下自适应布局。

#### Scenario: 移动端展示
- **WHEN** 视口宽度小于 720px
- **THEN** 项目卡片 SHALL 垂直堆叠显示

#### Scenario: 桌面端展示
- **WHEN** 视口宽度大于等于 720px
- **THEN** 项目卡片 SHALL 水平排列（2-3 列网格）
