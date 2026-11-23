// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Byte MVP · Build Fast. Be the MVP.";
export const SITE_DESCRIPTION = "Build Fast. Be the MVP.";

// Supabase 云数据库配置（用于 AI 工具的云端实时同步）
// 可通过环境变量 PUBLIC_SUPABASE_URL、PUBLIC_SUPABASE_ANON_KEY 注入，也可在后台管理页面中配置
export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || "";
export const DEFAULT_ADMIN_PIN = import.meta.env.PUBLIC_ADMIN_PIN || "admin123";
