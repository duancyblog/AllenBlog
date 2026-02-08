// Ech0 API 工具函数

interface EssayData {
	id: number;
	content: string;
	time: string;
	tags: string[];
	images?: string[];
}

// 备用数据，当API获取失败时使用
const fallbackData: EssayData[] = [
	{
		id: 1,
		content: "数据加载中，请稍后刷新页面...",
		time: new Date().toISOString().split("T")[0],
		tags: ["系统"],
	},
];

/**
 * 从Ech0 RSS获取动态数据
 * @param apiUrl Ech0 API地址
 * @returns 转换后的动态数据数组
 */
export async function fetchEch0Posts(apiUrl: string): Promise<EssayData[]> {
	try {
		console.log("Fetching Ech0 posts from:", `${apiUrl}/rss`);

		// 设置超时
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

		const response = await fetch(`${apiUrl}/rss`, {
			signal: controller.signal,
			headers: {
				Accept: "application/rss+xml, application/xml, text/xml, */*",
			},
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch Ech0 posts: ${response.status} ${response.statusText}`,
			);
		}

		const xmlText = await response.text();
		console.log("RSS response length:", xmlText.length);

		if (!xmlText || xmlText.length === 0) {
			throw new Error("Empty RSS response");
		}

		const data = parseRssData(xmlText);
		console.log("Parsed essays count:", data.length);

		if (data.length === 0) {
			console.warn("No essays found in RSS feed");
			return fallbackData;
		}

		return data;
	} catch (error) {
		console.error("Error fetching Ech0 posts:", error);
		// 出错时返回备用数据，避免页面显示空白
		return fallbackData;
	}
}

/**
 * 解析RSS XML数据
 * @param xmlText RSS XML文本
 * @returns 转换后的动态数据数组
 */
function parseRssData(xmlText: string): EssayData[] {
	// 使用正则表达式解析RSS数据，避免使用DOMParser（浏览器特有API）
	const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
	const entries: EssayData[] = [];
	let match: RegExpExecArray | null = null;

	let index = 0;
	while (true) {
		match = entryRegex.exec(xmlText);
		if (match === null) break;
		const entryText = match[1];
		index++;

		// 提取更新时间
		const updatedRegex = /<updated>([\s\S]*?)<\/updated>/;
		const updatedMatch = entryText.match(updatedRegex);
		const updated = updatedMatch ? updatedMatch[1] : "";

		// 提取摘要（使用更宽松的正则表达式，支持换行符）
		const summaryRegex = /<summary[^>]*>([\s\S]*?)<\/summary>/i;
		const summaryMatch = entryText.match(summaryRegex);
		const summary = summaryMatch ? summaryMatch[1] : "";

		// 提取纯文本内容
		const content = extractPlainText(summary);

		// 提取图片
		const images = extractImages(summary);

		entries.push({
			id: index,
			content,
			time: formatDate(updated),
			tags: ["生活"], // 默认标签
			images: images.length > 0 ? images : undefined,
		});
	}

	// 按ID倒序排列
	return entries.sort((a, b) => b.id - a.id);
}

/**
 * 从HTML中提取纯文本
 * @param html HTML文本
 * @returns 纯文本
 */
function extractPlainText(html: string): string {
	if (!html) return "[无内容]";

	// 解码HTML实体
	const decodedHtml = html
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&#34;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&#xA;/g, "\n")
		.replace(/&#xD;/g, "\r")
		.replace(/&#10;/g, "\n")
		.replace(/&#13;/g, "\r");

	// 使用正则表达式移除HTML标签
	const plainText = decodedHtml.replace(/<[^>]*>/g, "").trim();

	// 如果纯文本为空，说明可能是纯图片的说说，返回一个占位符
	return plainText || "[图片]";
}

/**
 * 从HTML中提取图片URL
 * @param html HTML文本
 * @returns 图片URL数组
 */
function extractImages(html: string): string[] {
	if (!html) return [];

	// 解码HTML实体
	const decodedHtml = html
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&#34;/g, '"')
		.replace(/&#39;/g, "'");

	// 使用更宽松的正则表达式提取图片URL
	const imgRegex = /<img[^>]*src=["']([^"']+)["']/gi;
	const images: string[] = [];
	let match: RegExpExecArray | null = null;

	while (true) {
		match = imgRegex.exec(decodedHtml);
		if (match === null) break;
		let url = match[1];

		// 将HTTP URL转换为HTTPS
		if (url.startsWith("http://")) {
			url = url.replace("http://", "https://");
		}

		images.push(url);
	}

	return images;
}

/**
 * 格式化日期
 * @param dateString ISO日期字符串
 * @returns YYYY-MM-DD格式的日期字符串
 */
function formatDate(dateString: string): string {
	if (!dateString) return new Date().toISOString().split("T")[0];

	try {
		const date = new Date(dateString);
		return date.toISOString().split("T")[0];
	} catch {
		return new Date().toISOString().split("T")[0];
	}
}
