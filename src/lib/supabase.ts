/**
 * Supabase 云端数据读取、存储桶识别与公共类型定义
 */

export interface ToolItem {
	id: string;
	name: string;
	url: string;
	icon: string;
	category: string;
	description: string;
	tags: string[];
	createdAt?: string;
	sort_order?: number;
	source?: "preset" | "cloud";
}

export interface SupabaseSession {
	access_token: string;
	refresh_token: string;
	expires_at: number;
	email: string;
}

export const STORAGE_BUCKET = "tool-icons";
export const STORAGE_PUBLIC_MARKER = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
export const TOOLS_CACHE_KEY = "bytemvp_tools_cache";
export const SESSION_STORAGE_KEY = "bytemvp_supabase_session";

/**
 * 判断图标是否已托管在 Supabase Storage CDN 上
 */
export function isCdnIcon(iconUrl?: string): boolean {
	return Boolean(iconUrl && iconUrl.includes(STORAGE_PUBLIC_MARKER));
}

/**
 * 从 Supabase Storage 公开链接中提取文件名（用于删除工具时同步清理图标）
 */
export function extractStorageFileName(iconUrl?: string): string | null {
	if (!iconUrl) return null;
	const idx = iconUrl.indexOf(STORAGE_PUBLIC_MARKER);
	if (idx === -1) return null;
	const rawName = iconUrl.slice(idx + STORAGE_PUBLIC_MARKER.length).split(/[?#]/)[0];
	return rawName ? decodeURIComponent(rawName) : null;
}

/**
 * 统一规范化 tags 字段为字符串数组
 */
export function parseToolTags(tags: unknown): string[] {
	if (Array.isArray(tags)) {
		return tags.map((t) => String(t).trim()).filter(Boolean);
	}
	if (typeof tags === "string") {
		return tags
			.split(/[,，]/)
			.map((s) => s.trim())
			.filter(Boolean);
	}
	return [];
}

/**
 * 从 Supabase 读取已发布的 AI 工具列表（优先按 sort_order 升序，自动兼容旧表结构）
 */
export async function fetchCloudTools(supabaseUrl: string, supabaseKey: string): Promise<ToolItem[]> {
	if (!supabaseUrl || !supabaseKey) return [];
	const base = supabaseUrl.replace(/\/$/, "");
	const headers = {
		apikey: supabaseKey,
		Authorization: `Bearer ${supabaseKey}`,
	};

	let res = await fetch(`${base}/rest/v1/ai_tools?select=*&order=sort_order.asc,created_at.desc`, {
		headers,
	});

	// Fallback if sort_order column not yet added
	if (!res.ok && res.status === 400) {
		res = await fetch(`${base}/rest/v1/ai_tools?select=*&order=created_at.desc`, {
			headers,
		});
	}

	if (!res.ok) {
		throw new Error(`Supabase fetch failed: HTTP ${res.status}`);
	}

	const rows: Array<Record<string, unknown>> = await res.json();
	return rows.map((row) => ({
		id: String(row.id ?? ""),
		name: String(row.name ?? ""),
		url: String(row.url ?? ""),
		icon: String(row.icon ?? "/favicon.svg"),
		category: String(row.category ?? "其他实用"),
		description: String(row.description ?? ""),
		tags: parseToolTags(row.tags),
		sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
		source: "cloud",
	}));
}
