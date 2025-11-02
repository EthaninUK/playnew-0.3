// ========================================
// n8n Function Node: Clean RSS Data
// ========================================
// 用途: 解析 RSS XML 并提取新闻数据
// 使用位置: Fetch RSS 节点之后

const items = $input.all();
const cleanedData = [];

for (const item of items) {
  // 获取 RSS 响应 (可能是字符串或已解析的对象)
  let rssText = item.json;

  // 如果是对象，尝试获取字符串
  if (typeof rssText === 'object') {
    rssText = item.binary?.data || JSON.stringify(rssText);
  }

  // 简单的正则表达式解析 RSS XML
  // 提取所有 <item> 标签中的内容
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const matches = [...rssText.matchAll(itemRegex)];

  console.log(`Found ${matches.length} items in RSS feed`);

  for (const match of matches) {
    const itemXml = match[1];

    // 提取各个字段
    const title = (itemXml.match(/<title>(.*?)<\/title>/) || [])[1] || '';
    const link = (itemXml.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/) || [])[1] || '';
    const description = (itemXml.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/) || [])[1] || '';
    const pubDate = (itemXml.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
    const guid = (itemXml.match(/<guid>(.*?)<\/guid>/) || [])[1] || '';

    // 清理 HTML 标签获取纯文本内容
    const cleanText = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // 创建条目
    const entry = {
      title: title.trim(),
      content: cleanText,
      link: link.trim(),
      source: 'Cointelegraph',
      published_at: pubDate || new Date().toISOString(),
      guid: guid
    };

    // 过滤条件
    const wordCount = entry.content.split(' ').length;
    const publishedDate = new Date(entry.published_at);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const isRecent = publishedDate > oneDayAgo;

    // 只保留符合条件的新闻
    if (wordCount > 10 && entry.title && isRecent) {
      cleanedData.push({ json: entry });
    }
  }
}

console.log(`✅ Extracted ${cleanedData.length} valid articles from RSS feed`);
return cleanedData;
