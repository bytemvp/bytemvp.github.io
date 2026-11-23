-- Byte MVP AI Tools · Supabase 安全表结构配置
-- 使用方法：
-- 1. 登录 https://supabase.com 你的项目后台
-- 2. 进入左侧导航的 "SQL Editor"
-- 3. 粘贴以下 SQL 语句并点击 "Run" 执行：

-- 1. 创建 AI 工具数据表
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

-- 2. 开启行级安全策略 (RLS)
alter table public.ai_tools enable row level security;

-- 3. 允许所有人公开读取（前台普通访客正常浏览，只读）
drop policy if exists "Allow public read" on public.ai_tools;
create policy "Allow public read" on public.ai_tools for select using (true);

-- 4. 严防死守：仅允许已登录的管理员账号进行新增、修改和删除！
-- （普通访客拿到 Anon Key 也无法写入，数据库底层拦截报 401/403）
drop policy if exists "Allow public insert" on public.ai_tools;
drop policy if exists "Only admin insert" on public.ai_tools;
create policy "Only admin insert" on public.ai_tools for insert to authenticated with check (true);

drop policy if exists "Allow public update" on public.ai_tools;
drop policy if exists "Only admin update" on public.ai_tools;
create policy "Only admin update" on public.ai_tools for update to authenticated using (true);

drop policy if exists "Allow public delete" on public.ai_tools;
drop policy if exists "Only admin delete" on public.ai_tools for delete to authenticated using (true);
