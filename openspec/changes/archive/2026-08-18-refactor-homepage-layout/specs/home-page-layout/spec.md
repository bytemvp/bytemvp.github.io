## Purpose

定义首页的整体布局结构和响应式行为。（已存在，本次修改）

## REMOVED Requirements

### Requirement: Featured Content Area
<!-- 此需求已移除：首页不再展示精选文章 -->

### Requirement: Latest Posts List
<!-- 此需求已移除：首页不再展示最新文章列表 -->

## MODIFIED Requirements

### Requirement: Modern Home Page Structure
首页 SHALL 以 section 形式组织内容，包含 Hero、项目展示、导航卡片等区域。

#### Scenario: Section-based layout
- **WHEN** 首页加载完成
- **THEN** SHALL 依次展示 Hero 区域、项目展示区域、导航卡片区域

### Requirement: Responsive Layout
首页 SHALL 在常见断点下完全响应式。

#### Scenario: Mobile layout
- **WHEN** 视口宽度小于 720px
- **THEN** 各区域 SHALL 垂直堆叠，保持可读间距

#### Scenario: Desktop layout
- **WHEN** 视口宽度大于等于 720px
- **THEN** 各区域 SHALL 在适当时机使用多列布局
