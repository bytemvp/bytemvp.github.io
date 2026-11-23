-- Byte MVP AI Tools · Supabase 安全表结构配置
-- 官方标准推荐写法：使用 auth.role() = 'authenticated' 识别已登录管理员

-- 0. 添加排序序号字段 (sort_order)，用于支持拖拽自定义排序并持久化保存
alter table public.ai_tools add column if not exists sort_order integer default 0;

-- 1. 开启行级安全策略
alter table public.ai_tools enable row level security;

-- 2. 允许所有人公开读取（前台普通访客正常浏览，只读）
drop policy if exists "Allow public read" on public.ai_tools;
create policy "Allow public read" on public.ai_tools
  for select
  using (true);

-- 3. 封死匿名写入！仅允许已登录的管理员账号进行新增
drop policy if exists "Allow public insert" on public.ai_tools;
drop policy if exists "Only admin insert" on public.ai_tools;
create policy "Only admin insert" on public.ai_tools
  for insert
  with check (auth.role() = 'authenticated');

-- 4. 仅允许已登录的管理员账号进行修改（支持内容编辑与拖拽排序更新）
drop policy if exists "Allow public update" on public.ai_tools;
drop policy if exists "Only admin update" on public.ai_tools;
create policy "Only admin update" on public.ai_tools
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 5. 仅允许已登录的管理员账号进行删除
drop policy if exists "Allow public delete" on public.ai_tools;
drop policy if exists "Only admin delete" on public.ai_tools;
create policy "Only admin delete" on public.ai_tools
  for delete
  using (auth.role() = 'authenticated');
