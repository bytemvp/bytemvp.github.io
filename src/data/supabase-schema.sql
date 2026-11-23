-- Byte MVP AI Tools · Supabase SQL 表结构配置
-- 使用方法：
-- 1. 登录 https://supabase.com 免费创建一个项目
-- 2. 进入项目左侧导航的 "SQL Editor"
-- 3. 粘贴以下 SQL 语句并点击 "Run" 执行即可：

create table if not exists public.ai_tools (
  id text primary key,
  name text not null,
  url text not null,
  icon text,
  category text not null,
  description text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 开启行级权限保护 (RLS)
alter table public.ai_tools enable row level security;

-- 允许所有人公开读取工具列表
drop policy if exists "Allow public read" on public.ai_tools;
create policy "Allow public read" on public.ai_tools for select using (true);

-- 允许通过网页接口插入新工具（前端受管理口令保护）
drop policy if exists "Allow public insert" on public.ai_tools;
create policy "Allow public insert" on public.ai_tools for insert with check (true);

-- 允许更新（可选）
drop policy if exists "Allow public update" on public.ai_tools;
create policy "Allow public update" on public.ai_tools for update using (true);
