/**
 * 网站元信息抓取、智能分类推断与 URL 标准化模块
 */

import { cleanToolTitle, containsChinese, translateToChinese } from "./utils";

export interface ScrapedToolMetadata {
	validUrl: string;
	domain: string;
	fallbackIcon: string;
	name: string;
	description: string;
	icon: string;
	category: string;
	scrapedOk: boolean;
	translated: boolean;
}

/**
 * 标准化网址用于重复校验（忽略协议差异、www 前缀与末尾斜杠）
 */
export function normalizeToolUrl(rawUrl: string): string {
	try {
		const withProto = /^https?:\/\//i.test(rawUrl.trim())
			? rawUrl.trim()
			: `https://${rawUrl.trim()}`;
		const parsed = new URL(withProto);
		const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
		const path = parsed.pathname.replace(/\/+$/, "");
		return `${host}${path}${parsed.search}`.toLowerCase();
	} catch {
		return rawUrl.trim().toLowerCase().replace(/\/+$/, "");
	}
}

/**
 * 根据标题和描述关键词智能推断工具归属分类
 */
export function guessToolCategory(text: string): string {
	const lower = (text || "").toLowerCase();
	if (/code|coding|dev|program|vscode|开发|编程|前端|后端|代码/.test(lower)) {
		return "开发编程";
	}
	if (/image|photo|draw|art|design|图片|图像|绘图|设计/.test(lower)) {
		return "图像设计";
	}
	if (/chat|gpt|conversation|write|translate|对话|写作|文本/.test(lower)) {
		return "写作对话";
	}
	if (/music|audio|voice|video|音乐|音频|视频/.test(lower)) {
		return "音频视频";
	}
	if (/search|research|paper|搜索|研究|学术/.test(lower)) {
		return "学习研究";
	}
	if (/notion|note|productivity|office|效率|办公|笔记/.test(lower)) {
		return "效率办公";
	}
	return "其他实用";
}

/**
 * 从目标网址自动抓取站点标题、中文简介与 Logo 图标
 */
export async function scrapeToolMetadata(
	rawUrl: string,
	onProgress?: (stageText: string) => void
): Promise<ScrapedToolMetadata> {
	let validUrl = rawUrl.trim();
	if (!/^https?:\/\//i.test(validUrl)) {
		validUrl = `https://${validUrl}`;
	}

	const parsed = new URL(validUrl);
	const domain = parsed.hostname.replace(/^www\./, "");
	const fallbackIcon = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
	const domainBase = domain.split(".")[0] || domain;
	const titleGuess = domainBase.charAt(0).toUpperCase() + domainBase.slice(1);

	let name = titleGuess;
	let description = "";
	let icon = fallbackIcon;
	let category = "其他实用";
	let scrapedOk = false;
	let translated = false;

	try {
		const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(validUrl)}`);
		if (res.ok) {
			const json = await res.json();
			const data = json?.data;
			if (data) {
				scrapedOk = true;
				if (data.title) {
					name = cleanToolTitle(data.title, domain) || titleGuess;
				}
				if (data.description) {
					let desc = String(data.description).trim();
					if (desc && !containsChinese(desc)) {
						onProgress?.("翻译为中文中...");
						try {
							const zh = await translateToChinese(desc);
							if (zh && zh !== desc) {
								desc = zh;
								translated = true;
							}
						} catch (e) {
							console.warn("Auto translate notice:", e);
						}
					}
					description = desc;
				}
				if (data.logo?.url) {
					icon = data.logo.url;
				}
				category = guessToolCategory(`${data.title || ""} ${data.description || ""}`);
			}
		}
	} catch {
		scrapedOk = false;
	}

	return {
		validUrl,
		domain,
		fallbackIcon,
		name,
		description,
		icon,
		category,
		scrapedOk,
		translated,
	};
}
