#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DATA_FILE = path.join(rootDir, 'src', 'data', 'tools.json');
const ICONS_DIR = path.join(rootDir, 'public', 'tools-icons');

const PRESET_CATEGORIES = [
  '开发编程',
  '图像设计',
  '效率办公',
  '写作对话',
  '音频视频',
  '学习研究',
  '其他实用'
];

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function containsChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str || '');
}

function cleanTitle(title, domain) {
  if (!title) return domain;
  let cleaned = decodeHtmlEntities(title);
  cleaned = cleaned.replace(/\s*[-–—|:]\s*(Official Site|Home|Home Page|首页|官网|官方网站|Welcome).*$/i, '').trim();
  const domainBase = (domain || '').split('.')[0].toLowerCase();
  const parts = cleaned.split(/\s*[-–—|:]\s*/);
  if (parts.length > 1) {
    const matchingPart = parts.find((p) => p.toLowerCase().includes(domainBase));
    if (matchingPart && matchingPart.length <= 25) {
      return matchingPart.replace(/\s*(Official Site|Home|Home Page|首页|官网|官方网站|Welcome).*$/i, '').trim();
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
  return cleaned.replace(/\s+by\s+.*$/i, '').trim() || domain;
}

function cleanDescription(desc) {
  if (!desc) return '';
  return decodeHtmlEntities(desc).replace(/\s+/g, ' ').trim();
}

async function translateToChinese(text) {
  if (!text || !text.trim() || containsChinese(text)) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text.trim())}`;
    const res = await fetchWithTimeout(url, {}, 4000);
    if (!res.ok) return text;
    const json = await res.json();
    if (json && Array.isArray(json[0])) {
      const translated = json[0].map((item) => item[0]).filter(Boolean).join('');
      if (translated && translated.trim()) {
        return translated.trim();
      }
    }
  } catch (err) {
    // fallback to original if failed
  }
  return text;
}

function generateSlug(urlStr, title) {
  try {
    const parsed = new URL(urlStr);
    const hostParts = parsed.hostname.replace(/^www\./, '').split('.');
    let base = hostParts[0];
    if (base === 'github' && parsed.pathname.length > 1) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts[1]) base = parts[1];
    }
    return base.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'tool';
  } catch {
    return 'tool-' + Date.now();
  }
}

function suggestCategory(text) {
  const lower = (text || '').toLowerCase();
  if (/code|coding|dev|develop|program|git|vscode|compiler|api|terminal|编程|开发|前端|后端|代码/.test(lower)) {
    return '开发编程';
  }
  if (/image|photo|draw|art|paint|design|illustration|vector|logo|图片|图像|绘图|设计|插画/.test(lower)) {
    return '图像设计';
  }
  if (/chat|gpt|conversation|write|copywriting|essay|translate|对话|聊天|写作|文本|翻译/.test(lower)) {
    return '写作对话';
  }
  if (/music|song|audio|voice|speech|sound|video|movie|clip|音乐|声音|音频|视频|歌曲/.test(lower)) {
    return '音频视频';
  }
  if (/search|research|study|paper|academic|scholar|knowledge|搜索|检索|研究|学术|论文/.test(lower)) {
    return '学习研究';
  }
  if (/notion|note|todo|task|calendar|productivity|office|workflow|效率|办公|协作|日程|笔记/.test(lower)) {
    return '效率办公';
  }
  return '其他实用';
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        ...(options.headers || {})
      }
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function scrapeMetadata(targetUrl) {
  const parsed = new URL(targetUrl);
  const origin = parsed.origin;
  const domain = parsed.hostname.replace(/^www\./, '');

  let html = '';
  try {
    const res = await fetchWithTimeout(targetUrl, {}, 4000);
    if (res.ok) {
      html = await res.text();
    }
  } catch (err) {
    console.warn(`\x1b[33m⚠️ 网页抓取受限或超时 (${err.message})，将使用域名兜底信息\x1b[0m`);
  }

  // Extract title
  let title = '';
  const ogTitleMatch = html.match(/<meta[^>]+(?:property|name)=["'](?:og:)?title["'][^>]+content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:)?title["']/i);
  if (ogTitleMatch && ogTitleMatch[1]) {
    title = ogTitleMatch[1];
  } else {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1];
    }
  }
  title = cleanTitle(title, domain);

  // Extract description
  let description = '';
  const ogDescMatch = html.match(/<meta[^>]+(?:property|name)=["'](?:og:)?description["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:)?description["']/i);
  if (ogDescMatch && ogDescMatch[1]) {
    description = ogDescMatch[1];
  } else {
    const descMatch = html.match(/<meta[^>]+(?:name|property)=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']description["']/i);
    if (descMatch && descMatch[1]) {
      description = descMatch[1];
    }
  }
  description = cleanDescription(description);

  // If description is in a foreign language (e.g., English), automatically translate to Chinese
  if (description && !containsChinese(description)) {
    try {
      console.log(`\x1b[36m🌐 正在将抓取到的外语简介自动翻译为中文...\x1b[0m`);
      const zhDesc = await translateToChinese(description);
      if (zhDesc) {
        description = zhDesc;
      }
    } catch {}
  }

  // Extract icon candidates
  const iconCandidates = [];

  // 1. DuckDuckGo Favicon Service (very reliable & fast)
  iconCandidates.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);

  // 2. Apple touch icon
  const appleIconMatch = html.match(/<link[^>]+rel=["']apple-touch-icon(?:-precomposed)?["'][^>]+href=["']([^"']+)["']/i) ||
                         html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon(?:-precomposed)?["']/i);
  if (appleIconMatch && appleIconMatch[1]) {
    iconCandidates.push(new URL(appleIconMatch[1], targetUrl).href);
  }

  // 3. Shortcut/standard favicon
  const iconMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i) ||
                    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i);
  if (iconMatch && iconMatch[1]) {
    iconCandidates.push(new URL(iconMatch[1], targetUrl).href);
  }

  // 4. Origin favicon
  iconCandidates.push(`${origin}/favicon.ico`);

  // 5. Google Favicon service
  iconCandidates.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);

  return {
    title,
    description,
    domain,
    iconCandidates
  };
}

async function downloadIcon(candidates, slug) {
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  for (const iconUrl of candidates) {
    try {
      const res = await fetchWithTimeout(iconUrl, {}, 3500);
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 50) continue; // Skip empty/corrupt

      let ext = '.png';
      if (contentType.includes('svg') || iconUrl.endsWith('.svg')) {
        ext = '.svg';
      } else if (contentType.includes('x-icon') || iconUrl.endsWith('.ico')) {
        ext = '.ico';
      } else if (contentType.includes('webp') || iconUrl.endsWith('.webp')) {
        ext = '.webp';
      }

      const fileName = `${slug}${ext}`;
      const filePath = path.join(ICONS_DIR, fileName);
      fs.writeFileSync(filePath, buffer);
      return `/tools-icons/${fileName}`;
    } catch {
      // try next candidate
    }
  }

  // Fallback default SVG icon if all fails
  const fallbackFile = `${slug}.svg`;
  const fallbackPath = path.join(ICONS_DIR, fallbackFile);
  const letter = (slug[0] || 'T').toUpperCase();
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#248065" />
  <text x="32" y="42" font-family="system-ui, sans-serif" font-size="30" font-weight="bold" fill="#ffffff" text-anchor="middle">${letter}</text>
</svg>`;
  fs.writeFileSync(fallbackPath, svgContent);
  return `/tools-icons/${fallbackFile}`;
}

function promptQuestion(rl, questionText, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${questionText} \x1b[90m[默认: ${defaultValue}]\x1b[0m: ` : `${questionText}: `;
    rl.question(prompt, (answer) => {
      const trimmed = answer.trim();
      resolve(trimmed || defaultValue);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  let targetUrl = args.find((a) => !a.startsWith('-'));
  const isYesMode = args.includes('-y') || args.includes('--yes');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    if (!targetUrl) {
      targetUrl = await promptQuestion(rl, '🌐 请输入 AI 工具网址 (URL)');
    }

    if (!targetUrl) {
      console.error('\x1b[31m❌ 必须提供有效的网址！\x1b[0m');
      process.exit(1);
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    console.log(`\n\x1b[36m🔍 正在抓取网站元数据: ${targetUrl} ...\x1b[0m`);
    const meta = await scrapeMetadata(targetUrl);
    const slug = generateSlug(targetUrl, meta.title);

    console.log(`\x1b[36m📥 正在下载工具高清图标 ...\x1b[0m`);
    const localIconPath = await downloadIcon(meta.iconCandidates, slug);

    console.log('\n\x1b[32m✨ 抓取结果预览:\x1b[0m');
    console.log(`  \x1b[1m名称\x1b[0m: ${meta.title || '(未获取到)'}`);
    console.log(`  \x1b[1m图标\x1b[0m: ${localIconPath}`);
    console.log(`  \x1b[1m简介\x1b[0m: ${meta.description || '(未获取到)'}`);

    const suggestedCat = suggestCategory(`${meta.title} ${meta.description}`);
    let chosenCategory = suggestedCat;
    let finalTitle = meta.title || slug;
    let finalDesc = meta.description || '高效实用的 AI 工具';
    let finalTags = [];

    if (!isYesMode) {
      console.log('\n\x1b[35m📂 请选择分类:\x1b[0m');
      let defaultIdx = PRESET_CATEGORIES.indexOf(suggestedCat);
      if (defaultIdx === -1) defaultIdx = 0;

      PRESET_CATEGORIES.forEach((cat, idx) => {
        const isSuggested = idx === defaultIdx ? ' \x1b[33m(推荐)\x1b[0m' : '';
        console.log(`  [${idx + 1}] ${cat}${isSuggested}`);
      });
      const catAnswer = await promptQuestion(rl, '输入分类序号 (1-7)', String(defaultIdx + 1));
      const catIdx = parseInt(catAnswer, 10) - 1;
      if (catIdx >= 0 && catIdx < PRESET_CATEGORIES.length) {
        chosenCategory = PRESET_CATEGORIES[catIdx];
      }

      finalTitle = await promptQuestion(rl, '🏷️ 工具名称', finalTitle);
      finalDesc = await promptQuestion(rl, '📝 工具简介描述', finalDesc);
      const tagsInput = await promptQuestion(rl, '🏷️ 标签 (英文/中文逗号隔开，可选)', '');
      if (tagsInput) {
        finalTags = tagsInput.split(/[,，]/).map((t) => t.trim()).filter(Boolean);
      }
    }

    // Load or create tools.json
    let tools = [];
    if (fs.existsSync(DATA_FILE)) {
      try {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        tools = JSON.parse(content);
      } catch (e) {
        console.warn('⚠️ 读取原有 tools.json 出错，将初始化为空列表');
      }
    } else {
      const dataDir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }

    // Check if tool with same URL or slug already exists
    const existingIdx = tools.findIndex((t) => t.url === targetUrl || t.id === slug);
    const newTool = {
      id: slug,
      name: finalTitle,
      url: targetUrl,
      icon: localIconPath,
      category: chosenCategory,
      description: finalDesc,
      tags: finalTags.length > 0 ? finalTags : [chosenCategory],
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (existingIdx >= 0) {
      tools[existingIdx] = { ...tools[existingIdx], ...newTool };
      console.log(`\n\x1b[32m✅ 已更新已有工具条目: ${finalTitle} (${slug})\x1b[0m`);
    } else {
      tools.push(newTool);
      console.log(`\n\x1b[32m✅ 成功添加新工具: ${finalTitle} (${slug})\x1b[0m`);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(tools, null, 2), 'utf-8');
    console.log(`\x1b[32m💾 已同步写入数据文件: ${DATA_FILE}\x1b[0m\n`);
  } catch (err) {
    console.error('\x1b[31m❌ 发生错误:\x1b[0m', err);
  } finally {
    rl.close();
  }
}

main();
