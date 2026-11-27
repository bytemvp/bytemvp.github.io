// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Byte MVP · Build Fast. Be the MVP.";
export const SITE_DESCRIPTION = "Build Fast. Be the MVP.";

// 工具分类常量（前后台统一复用）
export const MANAGE_CATEGORIES = [
    "开发编程",
    "图像设计",
    "效率办公",
    "写作对话",
    "音频视频",
    "学习研究",
    "其他实用",
] as const;

export const TOOL_CATEGORIES = ["全部", ...MANAGE_CATEGORIES] as const;

// Supabase 云数据库配置（用于 AI 工具的云端实时同步）
export const SUPABASE_URL =
    import.meta.env.PUBLIC_SUPABASE_URL || "https://myqwanhwwuexbcpwgimh.supabase.co";
export const SUPABASE_ANON_KEY =
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_jOg3OX-gU6Rwa2Zr6w-2rg_FFEjhqfk";
