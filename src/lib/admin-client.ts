/**
 * 管理后台 Supabase Auth 会话管理与 Storage 图标处理模块
 */

import {
	SESSION_STORAGE_KEY,
	STORAGE_BUCKET,
	extractStorageFileName,
	isCdnIcon,
	type SupabaseSession,
} from "./supabase";

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function getSavedSession(): SupabaseSession | null {
	try {
		const raw = localStorage.getItem(SESSION_STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch {
		// Ignore corrupted storage data
	}
	return null;
}

export function clearTokenRefreshTimer(): void {
	if (refreshTimer) {
		clearTimeout(refreshTimer);
		refreshTimer = null;
	}
}

export function saveSession(session: SupabaseSession | null): void {
	if (session) {
		localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
	} else {
		localStorage.removeItem(SESSION_STORAGE_KEY);
		clearTokenRefreshTimer();
	}
}

export async function refreshSession(
	supabaseUrl: string,
	supabaseKey: string,
	session: SupabaseSession
): Promise<SupabaseSession | null> {
	if (!session?.refresh_token || !supabaseUrl || !supabaseKey) {
		return null;
	}
	try {
		const endpoint = `${supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=refresh_token`;
		const res = await fetch(endpoint, {
			method: "POST",
			headers: {
				apikey: supabaseKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refresh_token: session.refresh_token }),
		});

		if (res.ok) {
			const data = await res.json();
			if (data.access_token) {
				const refreshed: SupabaseSession = {
					access_token: data.access_token,
					refresh_token: data.refresh_token || session.refresh_token,
					expires_at: Date.now() + (data.expires_in || 3600) * 1000,
					email: data.user?.email || session.email,
				};
				saveSession(refreshed);
				scheduleTokenRefresh(supabaseUrl, supabaseKey, refreshed);
				return refreshed;
			}
		}
	} catch (e) {
		console.warn("Session refresh notice:", e);
	}
	return null;
}

export function scheduleTokenRefresh(
	supabaseUrl: string,
	supabaseKey: string,
	session: SupabaseSession
): void {
	clearTokenRefreshTimer();
	const remainingMs = Math.max((session.expires_at || 0) - Date.now(), 0);
	const refreshDelay = Math.max(remainingMs - 5 * 60 * 1000, 60 * 1000);

	refreshTimer = setTimeout(async () => {
		const curSession = getSavedSession();
		if (curSession?.refresh_token) {
			await refreshSession(supabaseUrl, supabaseKey, curSession);
		}
	}, refreshDelay);
}

export async function getValidSession(
	supabaseUrl: string,
	supabaseKey: string
): Promise<SupabaseSession | null> {
	const session = getSavedSession();
	if (!session) return null;

	const bufferMs = 5 * 60 * 1000;
	if (Date.now() >= (session.expires_at || 0) - bufferMs && session.refresh_token) {
		const refreshed = await refreshSession(supabaseUrl, supabaseKey, session);
		if (refreshed) return refreshed;
	}

	return session.access_token ? session : null;
}

/**
 * 带自动 Bearer Token 注入与 401 自动无感续期的鉴权请求包装器
 */
export async function authFetch(
	supabaseUrl: string,
	supabaseKey: string,
	url: string,
	options: RequestInit = {}
): Promise<Response> {
	const session = await getValidSession(supabaseUrl, supabaseKey);
	if (!session?.access_token) {
		throw new Error("UNAUTHORIZED");
	}

	const headers = new Headers(options.headers || {});
	headers.set("apikey", supabaseKey);
	headers.set("Authorization", `Bearer ${session.access_token}`);

	let response = await fetch(url, {
		...options,
		headers,
	});

	if (response.status === 401 && session.refresh_token) {
		const refreshed = await refreshSession(supabaseUrl, supabaseKey, session);
		if (refreshed?.access_token) {
			headers.set("Authorization", `Bearer ${refreshed.access_token}`);
			response = await fetch(url, {
				...options,
				headers,
			});
		} else {
			throw new Error("UNAUTHORIZED");
		}
	}

	return response;
}

/**
 * 获取远程图标 Blob（直连优先，CORS 受阻时自动回退至图像代理）
 */
export async function fetchIconBlob(
	url: string
): Promise<{ blob: Blob; mimeType: string; ext: string }> {
	let res: Response | null = null;
	try {
		res = await fetch(url, { mode: "cors" });
		if (!res.ok) res = null;
	} catch {
		res = null;
	}

	if (!res) {
		try {
			const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
			res = await fetch(proxyUrl);
			if (!res.ok) res = null;
		} catch {
			res = null;
		}
	}

	if (!res || !res.ok) {
		throw new Error(`无法获取图标文件 (${url})`);
	}

	const blob = await res.blob();
	let mimeType = blob.type || "image/png";
	let ext = "png";

	const lowerUrl = url.toLowerCase();
	if (mimeType.includes("svg") || lowerUrl.includes(".svg")) {
		mimeType = "image/svg+xml";
		ext = "svg";
	} else if (mimeType.includes("webp") || lowerUrl.includes(".webp")) {
		mimeType = "image/webp";
		ext = "webp";
	} else if (mimeType.includes("icon") || mimeType.includes("ico") || lowerUrl.includes(".ico")) {
		mimeType = "image/x-icon";
		ext = "ico";
	} else if (
		mimeType.includes("jpeg") ||
		mimeType.includes("jpg") ||
		lowerUrl.includes(".jpg") ||
		lowerUrl.includes(".jpeg")
	) {
		mimeType = "image/jpeg";
		ext = "jpg";
	} else if (mimeType.includes("png") || lowerUrl.includes(".png")) {
		mimeType = "image/png";
		ext = "png";
	}

	return { blob, mimeType, ext };
}

/**
 * 上传图标文件或 Blob 至 Supabase Storage 并返回公开 CDN URL
 */
export async function uploadBlobToSupabaseStorage(
	supabaseUrl: string,
	supabaseKey: string,
	blobOrFile: Blob | File,
	fileSlug: string,
	forcedExt?: string,
	forcedMime?: string
): Promise<string> {
	const rawExt =
		forcedExt || (blobOrFile instanceof File ? blobOrFile.name.split(".").pop() : "") || "png";
	const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
	const cleanSlug = fileSlug.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "icon";
	const fileName = `${cleanSlug}.${ext}`;
	const mimeType =
		forcedMime ||
		blobOrFile.type ||
		(ext === "svg" ? "image/svg+xml" : ext === "ico" ? "image/x-icon" : "image/png");

	const base = supabaseUrl.replace(/\/$/, "");
	const endpoint = `${base}/storage/v1/object/${STORAGE_BUCKET}/${fileName}`;
	const res = await authFetch(supabaseUrl, supabaseKey, endpoint, {
		method: "POST",
		headers: {
			"Content-Type": mimeType,
			"x-upsert": "true",
		},
		body: blobOrFile,
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		if (
			res.status === 400 &&
			(err.message?.includes("Bucket not found") || err.code === "NoSuchBucket")
		) {
			throw new Error("BUCKET_NOT_FOUND");
		}
		throw new Error(err.message || `存储上传失败 HTTP ${res.status}`);
	}

	return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
}

/**
 * 将第三方外部图标转存至 Supabase Storage CDN
 */
export async function transferIconToSupabase(
	supabaseUrl: string,
	supabaseKey: string,
	iconUrl: string,
	fileSlug: string
): Promise<string> {
	if (!iconUrl) return "/favicon.svg";
	if (isCdnIcon(iconUrl)) return iconUrl;
	if (iconUrl.startsWith("/") && !iconUrl.startsWith("//")) return iconUrl;

	const { blob, mimeType, ext } = await fetchIconBlob(iconUrl);
	return uploadBlobToSupabaseStorage(supabaseUrl, supabaseKey, blob, fileSlug, ext, mimeType);
}

/**
 * 删除工具时顺带清理托管在 Supabase Storage 中的图标文件（忽略非 Storage 链接或不存在报错）
 */
export async function deleteIconFromSupabaseStorage(
	supabaseUrl: string,
	supabaseKey: string,
	iconUrl?: string
): Promise<void> {
	const fileName = extractStorageFileName(iconUrl);
	if (!fileName) return;
	try {
		const base = supabaseUrl.replace(/\/$/, "");
		const endpoint = `${base}/storage/v1/object/${STORAGE_BUCKET}/${encodeURIComponent(fileName)}`;
		await authFetch(supabaseUrl, supabaseKey, endpoint, {
			method: "DELETE",
		});
	} catch (e) {
		console.warn("Silent notice deleting storage icon:", e);
	}
}
