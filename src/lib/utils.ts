/**
 * 常用安全过滤与文本处理工具函数
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

/**
 * 转义 HTML 特殊字符，防止动态模板拼接导致 DOM 破坏或 XSS 注入
 */
export function escapeHtml(value: unknown): string {
	return String(value ?? "").replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] || ch);
}

/**
 * 校验并净化 URL，仅允许 http(s) 与站内相对路径，拦截 javascript: 等危险协议
 */
export function sanitizeUrl(url: unknown, fallback = "#"): string {
	const raw = String(url ?? "").trim();
	if (!raw) return fallback;
	if (raw.startsWith("/") && !raw.startsWith("//")) {
		return raw;
	}
	try {
		const parsed = new URL(raw);
		if (parsed.protocol === "http:" || parsed.protocol === "https:") {
			return parsed.href;
		}
	} catch {
		return fallback;
	}
	return fallback;
}

/**
 * 检测字符串中是否包含中文字符
 */
export function containsChinese(str: string): boolean {
	return /[\u4e00-\u9fa5]/.test(str || "");
}

/**
 * 清洗抓取到的网页标题，提取简洁工具名称
 */
export function cleanToolTitle(title: string, domain: string): string {
	if (!title) return domain;
	const cleaned = title
		.replace(/\s*[-–—|:]\s*(Official Site|Home|Home Page|首页|官网|官方网站|Welcome).*$/i, "")
		.trim();
	const domainBase = (domain || "").split(".")[0].toLowerCase();
	const parts = cleaned.split(/\s*[-–—|:]\s*/);
	if (parts.length > 1) {
		const matchingPart = parts.find((p) => p.toLowerCase().includes(domainBase));
		if (matchingPart && matchingPart.length <= 25) {
			return matchingPart
				.replace(/\s*(Official Site|Home|Home Page|首页|官网|官方网站|Welcome).*$/i, "")
				.trim();
		}
		const last = parts[parts.length - 1].trim();
		const first = parts[0].trim();
		if (last.length <= 25 && parts[0].length > last.length) {
			return last;
		}
		if (first.length <= 25) {
			return first;
		}
	}
	return cleaned.replace(/\s+by\s+.*$/i, "").trim() || domain;
}

/**
 * 调用 Google Translate 免费接口将英文工具简介自动翻译为中文
 */
export async function translateToChinese(text: string): Promise<string> {
	if (!text || !text.trim() || containsChinese(text)) return text;
	try {
		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text.trim())}`;
		const res = await fetch(url);
		if (!res.ok) return text;
		const json = await res.json();
		if (json && Array.isArray(json[0])) {
			const translated = json[0]
				.map((item: unknown[]) => (Array.isArray(item) ? item[0] : ""))
				.filter(Boolean)
				.join("");
			if (translated && translated.trim()) {
				return translated.trim();
			}
		}
	} catch (err) {
		console.warn("Translation failed, falling back to original:", err);
	}
	return text;
}
