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

-- ==============================================================================
-- 6. 创建图标存储桶 (tool-icons)，用于永久存储和 CDN 全球加速所有 AI 工具图标
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('tool-icons', 'tool-icons', true)
on conflict (id) do update set public = true;

-- 7. 存储桶行级安全 (RLS) 策略：所有人（前台访客）公开只读下载/查看图标
drop policy if exists "Allow public read tool-icons" on storage.objects;
create policy "Allow public read tool-icons" on storage.objects
  for select
  using (bucket_id = 'tool-icons');

-- 8. 仅允许已登录的管理员上传图标
drop policy if exists "Allow admin insert tool-icons" on storage.objects;
create policy "Allow admin insert tool-icons" on storage.objects
  for insert
  with check (bucket_id = 'tool-icons' and auth.role() = 'authenticated');

-- 9. 仅允许已登录的管理员修改/覆盖图标
drop policy if exists "Allow admin update tool-icons" on storage.objects;
create policy "Allow admin update tool-icons" on storage.objects
  for update
  using (bucket_id = 'tool-icons' and auth.role() = 'authenticated')
  with check (bucket_id = 'tool-icons' and auth.role() = 'authenticated');

-- 10. 仅允许已登录的管理员删除图标
drop policy if exists "Allow admin delete tool-icons" on storage.objects;
create policy "Allow admin delete tool-icons" on storage.objects
  for delete
  using (bucket_id = 'tool-icons' and auth.role() = 'authenticated');
